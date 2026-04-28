"use client";
import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";
import { VOICE_LINES, STOCK, MENU_ITEMS, STAFF, SUPPLIERS, RECIPES } from "@/lib/data";

export interface VoiceEntry { user: string; ai: string; time: string; }
export interface RecipeCtx  { name: string; step: number; stepText: string; totalSteps: number; }

type VoiceState = "idle" | "listening" | "processing" | "speaking" | "paused";

interface VoiceCtx {
  state:          VoiceState;
  autoReading:    boolean;
  text:           string;
  history:        VoiceEntry[];
  trigger:        () => void;
  speakText:      (text: string, label?: string) => void;
  ask:            (question: string) => void;
  startAutoRead:  (items: { text: string; stepLabel: string }[], startIdx: number, onStep: (i: number) => void) => void;
  stopAutoRead:   () => void;
  screen:         string;
  setScreen:      (s: string) => void;
  recipeContext:  RecipeCtx | null;
  setRecipeContext:(ctx: RecipeCtx | null) => void;
  supported:      boolean;
  orbOpen:        boolean;
  openOrb:        () => void;
  closeOrb:       () => void;
}

const Ctx = createContext<VoiceCtx>({
  state: "idle", autoReading: false, text: "", history: [],
  trigger: () => {}, speakText: () => {}, ask: () => {},
  startAutoRead: () => {}, stopAutoRead: () => {},
  screen: "dashboard", setScreen: () => {},
  recipeContext: null, setRecipeContext: () => {},
  supported: false,
  orbOpen: false, openOrb: () => {}, closeOrb: () => {},
});

// ── Data helpers ──────────────────────────────────────────────
function loadData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback) as T;
  } catch { return fallback; }
}

function splitSentences(text: string): string[] {
  // Split on sentence-ending punctuation while preserving the delimiter
  return text.split(/(?<=[.!?—])\s+/).map(s => s.trim()).filter(Boolean);
}

function smartResponse(transcript: string, screen: string, recipeCtx: RecipeCtx | null): string {
  const t = transcript.toLowerCase().trim();
  const stock     = loadData("rasoi_stock",     STOCK);
  const menu      = loadData("rasoi_menu",      MENU_ITEMS);
  const staff     = loadData("rasoi_staff",     STAFF);
  const suppliers = loadData("rasoi_suppliers", SUPPLIERS);
  const recipes   = loadData("rasoi_recipes",   RECIPES);

  // Global: named recipe query
  const namedRecipe = recipes.map((r: any) => ({ r, key: r.name.toLowerCase() }))
    .find(({ key }: { key: string }) => key.split(" ").some((w: string) => w.length > 3 && t.includes(w)))?.r;
  if (namedRecipe && (t.includes("recipe") || t.includes("how") || t.includes("make") || t.includes("cook") || t.includes("ingredient") || t.includes("step"))) {
    if (t.includes("ingredient") || t.includes("need"))
      return `${namedRecipe.name} needs ${namedRecipe.ingredients.map((i: any) => `${i.name} ${i.qty}`).join(", ")}.`;
    return `${namedRecipe.name} has ${namedRecipe.steps.length} steps and takes ${namedRecipe.time}. Step one — ${namedRecipe.steps[0].text}`;
  }

  // Global: chopping / cutting / knife technique questions
  if (t.includes("chop") || t.includes("cut") || t.includes("slice") || t.includes("dice") || t.includes("mince") || t.includes("julienne") || t.includes("grate") || t.includes("peel")) {
    if (t.includes("onion"))
      return "To chop onions: cut the top off, halve through the root, peel. Make horizontal cuts then vertical cuts towards the root, then slice across for an even dice. Keep the root intact — it holds the layers together. Chilling the onion for 10 minutes reduces tears.";
    if (t.includes("garlic"))
      return "To mince garlic: crush the clove flat with your knife to loosen the skin, peel it off. Slice thin, then rock your knife over the slices until finely minced. A pinch of salt helps break it into a paste.";
    if (t.includes("tomato"))
      return "To chop tomatoes: score a small X at the base, blanch in boiling water for 30 seconds, then peel. Halve, scoop out the seeds, and dice the flesh cleanly. For curries, just rough-chop is fine.";
    if (t.includes("ginger"))
      return "To chop ginger: scrape the skin off with the edge of a spoon, then slice into coins. Stack the coins and cut into matchsticks, then mince across. Or grate directly on a microplane for a smooth paste.";
    if (t.includes("chilli") || t.includes("chili") || t.includes("pepper"))
      return "To chop chillies: slit lengthwise, scrape out the seeds and white membrane to reduce heat, then slice or mince finely. Always wash your hands well after — avoid touching your eyes.";
    if (t.includes("potato") || t.includes("carrot") || t.includes("vegetable"))
      return "For even cuts: square off the sides first, then cut into planks, then into sticks, then dice. Consistent size means even cooking. A sharp knife and a stable board are the most important tools.";
    return "Keep your knife sharp and use a claw grip — curl your fingertips under while holding the ingredient. A sharp knife is safer than a dull one. What are you cutting?";
  }

  // Global: how-to cooking questions
  if ((t.includes("how") || t.includes("what") || t.includes("teach") || t.includes("explain")) && (t.includes("cook") || t.includes("make") || t.includes("prepare") || t.includes("fry") || t.includes("boil") || t.includes("marinate") || t.includes("season"))) {
    if (t.includes("tadka") || t.includes("tarka") || t.includes("temper"))
      return "Tadka: heat ghee until shimmering, add whole spices like cumin or mustard seeds, wait 20 to 30 seconds until they splutter, then pour immediately over the dish. The hot oil carries the flavour. Don't let it burn.";
    if (t.includes("marinate"))
      return "For marinating: always include an acid like yoghurt or lemon, a fat like oil, and spices. Chicken needs at least 2 hours, overnight is better. Always marinate in the fridge.";
    if (t.includes("biryani"))
      return "Biryani needs par-cooked rice at 70 percent done, layered with the cooked meat and gravy, then sealed and dum cooked on lowest flame for 25 minutes. Never lift the lid during dum.";
    if (t.includes("roti") || t.includes("naan") || t.includes("bread"))
      return "For soft rotis: knead the dough well until smooth, rest for 30 minutes, roll thin and cook on high heat. Press gently with a cloth while cooking so it puffs up.";
  }

  if (t.includes("revenue") || t.includes("profit")) {
    const rev = menu.reduce((s: number, i: any) => s + i.price * i.sales, 0);
    const top = [...menu].sort((a: any, b: any) => b.margin - a.margin)[0];
    return `Monthly revenue around ₹${rev.toLocaleString("en-IN")}. Best margin is ${top?.name} at ${top?.margin}%.`;
  }

  switch (screen) {
    case "dashboard": {
      const low = stock.filter((s: any) => s.stock <= s.reorder);
      const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
      const onDuty = staff.filter((s: any) => s.shifts.includes(day));
      const top = [...menu].sort((a: any, b: any) => b.margin - a.margin)[0];
      if (t.includes("staff") || t.includes("team")) return `${onDuty.length} staff on duty: ${onDuty.slice(0,3).map((s: any) => s.name.split(" ")[0]).join(", ")}.`;
      if (t.includes("alert") || t.includes("issue")) return low.length > 0 ? `${low.length} stock alerts: ${low.map((i: any) => i.name).join(", ")}.` : "No alerts, kitchen is running smoothly.";
      return `${onDuty.length} staff on duty, ${low.length} stock alerts. Best margin dish: ${top?.name} at ${top?.margin}%.`;
    }
    case "inventory": {
      const low = stock.filter((s: any) => s.stock <= s.reorder);
      const item = stock.find((s: any) => s.name.toLowerCase().split(" ").some((w: string) => t.includes(w) && w.length > 3));
      if (item) return `${item.name}: ${item.stock} ${item.unit} in stock. ${item.stock <= item.reorder ? `Below reorder — order from ${item.supplier}.` : "Stock is healthy."}`;
      if (t.includes("dairy") || t.includes("paneer") || t.includes("ghee") || t.includes("cream")) {
        const dairy = stock.filter((s: any) => s.cat === "Dairy");
        return dairy.length > 0 ? `Dairy: ${dairy.map((i: any) => `${i.name} ${i.stock}${i.unit}`).join(", ")}.` : "No dairy tracked.";
      }
      return low.length > 0 ? `${low.length} items below reorder level: ${low.slice(0,3).map((i: any) => i.name).join(", ")}.` : "All stock is healthy.";
    }
    case "recipe": {
      if (recipeCtx) {
        const { name, step, stepText, totalSteps } = recipeCtx;
        if (t.includes("substitute") || t.includes("replace") || t.includes("instead")) {
          const rec = recipes.find((r: any) => r.name === name);
          const match = rec?.ingredients?.find((i: any) => i.sub && t.split(" ").some((w: string) => i.name.toLowerCase().includes(w)));
          if (match?.sub) return `For ${match.name}, you can use ${match.sub}.`;
          return "For cream, use cashew paste soaked overnight. For ghee, use butter. For paneer, firm tofu works great.";
        }
        if (t.includes("ingredient") || t.includes("what do i need")) {
          const rec = recipes.find((r: any) => r.name === name);
          return rec ? `${name} needs ${rec.ingredients.map((i: any) => `${i.name} ${i.qty}`).join(", ")}.` : stepText;
        }
        if (t.includes("how long") || t.includes("time")) {
          const rec = recipes.find((r: any) => r.name === name);
          return rec ? `${name} takes ${rec.time} total. You're on step ${step + 1} of ${totalSteps}.` : "Check the recipe card for timing.";
        }
        if (t.includes("how many")) return `${name} has ${totalSteps} steps. You're on step ${step + 1}.`;
        return `You're on step ${step + 1} of ${totalSteps}. ${stepText}`;
      }
      const active = recipes.find((r: any) => r.active) || recipes[0];
      return active ? `Currently set to ${active.name}. Ask me about ingredients, timing, or substitutes.` : "Open a recipe to get started.";
    }
    case "techniques": {
      if (t.includes("julienne"))  return "Julienne: square off sides, cut 5cm planks at 2mm, stack and slice into 2mm matchsticks. Keep knuckles curled as a blade guide.";
      if (t.includes("dum"))       return "Dum: seal with atta dough, lowest flame, 30 to 45 minutes. Never lift the lid — trapped steam does the work.";
      if (t.includes("tadka") || t.includes("tarka")) return "Tarka: heat ghee until shimmering, add whole spices, 20 to 30 seconds until they splutter, pour immediately.";
      if (t.includes("brunoise"))  return "Brunoise: 3mm julienne first, then cross-cut at 3mm. Consistency requires practice.";
      if (t.includes("chiffonade")) return "Chiffonade: stack leaves face-down, roll tight, slice into thin ribbons. Sharp knife only.";
      if (t.includes("bhuno") || t.includes("saute")) return "Bhunoing: high heat, constant stirring, until oil visibly separates from the sides.";
      return "Ask me about julienne, dum cooking, tarka, brunoise, chiffonade, or bhunoing.";
    }
    case "timers": {
      if (t.includes("biryani")) return "Biryani dum: 25 to 30 minutes on lowest flame after sealing.";
      if (t.includes("dal"))     return "Dal Makhani: minimum 30 minutes, up to 2 hours for best results.";
      if (t.includes("naan"))    return "Naan: 90 seconds each side in tandoor. Butter immediately after pulling.";
      return "Ask me timing for any dish — biryani, dal, naan, and more.";
    }
    case "menu": {
      const byMargin = [...menu].sort((a: any, b: any) => b.margin - a.margin);
      const bySales  = [...menu].sort((a: any, b: any) => b.sales - a.sales);
      if (t.includes("margin") || t.includes("profit")) return `Top margins: ${byMargin.slice(0,3).map((i: any) => `${i.name} at ${i.margin}%`).join(", ")}.`;
      if (t.includes("popular") || t.includes("selling")) return `Best sellers: ${bySales.slice(0,3).map((i: any) => `${i.name} — ${i.sales} orders`).join(", ")}.`;
      return `${menu.length} dishes on menu. Best earner: ${byMargin[0]?.name} at ${byMargin[0]?.margin}%.`;
    }
    case "staff": {
      const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
      const today = staff.filter((s: any) => s.shifts.includes(day));
      if (t.includes("today") || t.includes("who") || t.includes("duty"))
        return today.length > 0 ? `${today.length} on duty: ${today.map((s: any) => `${s.name} on ${s.station}`).join(", ")}.` : "No staff scheduled today.";
      if (t.includes("off") || t.includes("leave")) {
        const off = staff.filter((s: any) => !s.shifts.includes(day));
        return off.length > 0 ? `Off today: ${off.map((s: any) => s.name.split(" ")[0]).join(", ")}.` : "Everyone is in today.";
      }
      return `${staff.length} team members, ${today.length} working today.`;
    }
    case "suppliers": {
      const pending = suppliers.filter((s: any) => s.status === "order-placed");
      const daily   = suppliers.filter((s: any) => s.delivery === "Daily");
      if (t.includes("pending") || t.includes("order")) return pending.length > 0 ? `${pending.length} pending orders: ${pending.map((s: any) => s.name).join(", ")}.` : "No pending orders.";
      if (t.includes("deliver")) return daily.length > 0 ? `Daily deliveries from ${daily.map((s: any) => s.name).join(", ")}.` : "No daily deliveries.";
      return `${suppliers.length} suppliers, ${pending.length} pending orders.`;
    }
  }
  const lines = VOICE_LINES[screen] || VOICE_LINES["dashboard"];
  return lines[Math.floor(Math.random() * lines.length)].ai;
}

// ── Real Claude AI response (falls back to keyword matching) ──
async function getSmartResponse(transcript: string, screen: string, recipeCtx: RecipeCtx | null): Promise<string> {
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("rasoi_api_key") : null;
  if (!apiKey) return smartResponse(transcript, screen, recipeCtx);

  const stock     = loadData("rasoi_stock",     STOCK);
  const menu      = loadData("rasoi_menu",      MENU_ITEMS);
  const staff     = loadData("rasoi_staff",     STAFF);
  const recipes   = loadData("rasoi_recipes",   RECIPES);

  const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
  const ctx = [
    `Screen: ${screen}`,
    recipeCtx ? `Cooking: ${recipeCtx.name}, step ${recipeCtx.step + 1}/${recipeCtx.totalSteps}: "${recipeCtx.stepText}"` : "",
    `On duty today: ${staff.filter((s: any) => s.shifts.includes(day)).map((s: any) => `${s.name} (${s.role}, ${s.station})`).join(", ") || "none"}`,
    `Low stock: ${stock.filter((s: any) => s.stock <= s.reorder).map((s: any) => s.name).join(", ") || "none"}`,
    `Top dishes: ${[...menu].sort((a: any, b: any) => b.margin - a.margin).slice(0, 3).map((m: any) => `${m.name} ${m.margin}%`).join(", ")}`,
    `Recipes: ${recipes.map((r: any) => r.name).join(", ")}`,
  ].filter(Boolean).join("\n");

  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 6000);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-allow-browser": "true",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 100,
        system: `You are Rasoi AI, a voice assistant for an Indian restaurant kitchen. Answer in 1-2 short sentences (max 35 words). The answer is spoken aloud — no bullet points, no markdown, no lists. Be specific, practical, and helpful.\n\nKitchen context:\n${ctx}`,
        messages: [{ role: "user", content: transcript }],
      }),
      signal: controller.signal,
    });
    clearTimeout(tid);
    const data = await res.json();
    if (data.content?.[0]?.text) return data.content[0].text;
  } catch {}

  return smartResponse(transcript, screen, recipeCtx);
}

// ── Helpers ───────────────────────────────────────────────────
const isStop     = (t: string) => /(stop|end|cancel|quit|enough|finish|done cooking|exit)/i.test(t);
const isPause    = (t: string) => /(pause|wait|hold on|hold it|slow down|one sec|just a|moment)/i.test(t);
const isContinue = (t: string) => /(continue|resume|go on|carry on|yes|yeah|ready|sure|ok|next|proceed)/i.test(t);
const isRepeat   = (t: string) => /(repeat|again|say that|what|pardon|sorry|missed)/i.test(t);

// ── Provider ──────────────────────────────────────────────────
export function VoiceProvider({ children }: { children: ReactNode }) {
  const [state,         setState]          = useState<VoiceState>("idle");
  const [autoReading,   setAutoReading]    = useState(false);
  const [text,          setText]           = useState("");
  const [history,       setHist]           = useState<VoiceEntry[]>([]);
  const [screen,        setScreen]         = useState("dashboard");
  const [recipeContext, setRecipeContext]   = useState<RecipeCtx | null>(null);
  const [supported,     setSupported]      = useState(false);
  const [orbOpen,       setOrbOpen]        = useState(false);

  const wakeRef      = useRef<any>(null);
  const recogRef     = useRef<any>(null);
  const timers       = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stateRef     = useRef(state);
  const screenRef    = useRef(screen);
  const recipeCtxRef = useRef(recipeContext);
  const cancelRef    = useRef(false);
  const pauseRef     = useRef(false);
  const resumeRef    = useRef<(() => void) | null>(null);
  const orbOpenRef   = useRef(false);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { screenRef.current = screen; }, [screen]);
  useEffect(() => { recipeCtxRef.current = recipeContext; }, [recipeContext]);

  useEffect(() => {
    const SR = typeof window !== "undefined"
      ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    setSupported(!!SR);
  }, []);

  const stopAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (recogRef.current)  { try { recogRef.current.abort();  } catch {} recogRef.current  = null; }
    if (wakeRef.current)   { try { wakeRef.current.abort();   } catch {} wakeRef.current   = null; }
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  // ── Core TTS — promise resolves when done, with timeout fallback ──
  const speakAsync = useCallback((response: string, label: string): Promise<void> => {
    return new Promise(resolve => {
      const ts = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      setHist(prev => [{ user: label, ai: response, time: ts }, ...prev.slice(0, 19)]);
      setState("speaking");
      setText(response);

      if (typeof window === "undefined" || !window.speechSynthesis) {
        setTimeout(resolve, Math.max(2000, response.split(/\s+/).length * 400));
        return;
      }

      window.speechSynthesis.cancel();

      const run = () => {
        const utt = new SpeechSynthesisUtterance(response);
        utt.lang  = "en-IN";
        utt.rate  = 0.88;
        utt.pitch = 1.05;
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find(v => v.lang === "en-IN") || voices.find(v => v.lang.startsWith("en"));
        if (v) utt.voice = v;

        // Duration fallback — Chrome onend is not always reliable
        const wordCount = response.split(/\s+/).length;
        const estMs = Math.max(3000, (wordCount / 2.2) * 1000 + 1200);
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          clearInterval(nudge);
          clearTimeout(fallback);
          resolve();
        };
        const nudge    = setInterval(() => window.speechSynthesis.resume?.(), 8000);
        const fallback = setTimeout(finish, estMs);
        timers.current.push(nudge as unknown as ReturnType<typeof setTimeout>);
        timers.current.push(fallback);
        utt.onend  = finish;
        utt.onerror = finish;
        window.speechSynthesis.speak(utt);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) { run(); }
      else {
        window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.onvoiceschanged = null; run(); };
        const t = setTimeout(run, 500);
        timers.current.push(t);
      }
    });
  }, []);

  // ── Short mic listen — resolves transcript or null on timeout ──
  const listenOnce = useCallback((duration: number): Promise<string | null> => {
    return new Promise(resolve => {
      if (cancelRef.current) { resolve(null); return; }
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) { setTimeout(() => resolve(null), duration); return; }

      const r = new SR();
      r.lang = "en-IN"; r.maxAlternatives = 1;
      let done = false;
      const finish = (result: string | null) => {
        if (done) return; done = true;
        try { r.abort(); } catch {}
        resolve(result);
      };
      r.onresult = (e: any) => finish(e.results[0][0].transcript);
      r.onerror  = () => finish(null);
      r.onend    = () => finish(null);
      try {
        setState("listening");
        setText("Listening…");
        r.start();
      } catch { setTimeout(() => resolve(null), duration); return; }
      const t = setTimeout(() => finish(null), duration);
      timers.current.push(t);
    });
  }, []);

  // ── Wait in paused state — continuously listens until continue/stop ──
  const waitForResume = useCallback(async (stepLabel: string) => {
    while (!cancelRef.current) {
      setState("paused");
      setText(`Paused at ${stepLabel} — say "continue" when ready`);
      const heard = await listenOnce(6000);
      if (cancelRef.current) return;
      if (!heard) continue; // timeout, keep listening

      const t = heard.toLowerCase();
      if (isStop(t))     { cancelRef.current = true; return; }
      if (isContinue(t)) { pauseRef.current = false; return; }

      // Question while paused — answer and stay paused
      const answer = await getSmartResponse(heard, screenRef.current, recipeCtxRef.current);
      await speakAsync(`${answer} — Say "continue" when you're ready.`, heard);
    }
  }, [listenOnce, speakAsync]);

  // ── Main conversational auto-read loop ────────────────────────
  const startAutoRead = useCallback(async (
    items: { text: string; stepLabel: string }[],
    startIdx: number,
    onStep: (i: number) => void
  ) => {
    stopAll();
    cancelRef.current = false;
    pauseRef.current  = false;
    setAutoReading(true);

    for (let i = startIdx; i < items.length; i++) {
      if (cancelRef.current) break;

      onStep(i);
      const { text: stepText, stepLabel } = items[i];
      const sentences = splitSentences(stepText);

      // Read each sentence, checking for pause after each one
      for (let si = 0; si < sentences.length; si++) {
        if (cancelRef.current) break;
        if (pauseRef.current) {
          await waitForResume(stepLabel);
          if (cancelRef.current) break;
        }

        await speakAsync(sentences[si], stepLabel);
        if (cancelRef.current) break;

        // Quick listen between sentences (500ms) — catches "pause" / "stop"
        if (si < sentences.length - 1) {
          const quick = await listenOnce(500);
          if (quick) {
            const qt = quick.toLowerCase();
            if (isStop(qt))  { cancelRef.current = true; break; }
            if (isPause(qt)) { pauseRef.current = true; }
          }
        }
      }

      if (cancelRef.current) break;

      // Last step — finish
      if (i === items.length - 1) {
        await speakAsync("That's all the steps. Your dish is ready — enjoy!", "Done");
        break;
      }

      // Between steps — listen for commands (2.5 sec)
      const heard = await listenOnce(2500);
      setState("speaking"); setText("");
      if (cancelRef.current) break;

      if (heard) {
        const t = heard.toLowerCase();

        if (isStop(t)) {
          await speakAsync("Alright, stopping here. Come back when you're ready!", "Stopped");
          break;
        }
        if (isPause(t)) {
          await waitForResume(`step ${i + 1}`);
          if (cancelRef.current) break;
          continue;
        }
        if (isRepeat(t)) {
          i--; continue;
        }

        // It's a question — answer and offer to continue
        const answer = await getSmartResponse(heard, screenRef.current, recipeCtxRef.current);
        await speakAsync(`${answer} — Ready for step ${i + 2}?`, heard);
        if (cancelRef.current) break;

        const confirm = await listenOnce(5000);
        setState("speaking"); setText("");
        if (cancelRef.current) break;

        if (confirm && isStop(confirm)) {
          await speakAsync("Alright, stopping. Well done so far!", "Stopped");
          break;
        }
        // Yes / silence / anything else → continue
      }
      // Silence between steps → auto-continue
    }

    if (!cancelRef.current) { setState("idle"); setText(""); }
    setAutoReading(false);
    cancelRef.current = false;
    pauseRef.current  = false;
  }, [stopAll, speakAsync, listenOnce, waitForResume]);

  const stopAutoRead = useCallback(() => {
    cancelRef.current = true;
    resumeRef.current?.();
    resumeRef.current = null;
    stopAll();
    setState("idle");
    setText("");
    setAutoReading(false);
  }, [stopAll]);

  // ── ChatGPT-style continuous orb conversation ──────────────────
  const closeOrb = useCallback(() => {
    cancelRef.current = true;
    orbOpenRef.current = false;
    stopAll();
    setOrbOpen(false);
    setState("idle");
    setText("");
    setAutoReading(false);
  }, [stopAll]);

  const openOrb = useCallback(async () => {
    if (orbOpenRef.current) { closeOrb(); return; }
    stopAll();
    cancelRef.current = false;
    pauseRef.current  = false;
    orbOpenRef.current = true;
    setOrbOpen(true);

    while (orbOpenRef.current && !cancelRef.current) {
      const heard = await listenOnce(9000);
      if (!orbOpenRef.current || cancelRef.current) break;

      if (!heard) continue; // timeout — keep listening

      const t = heard.toLowerCase();
      if (isStop(t) || t.includes("goodbye") || t.includes("bye") || t.includes("close") || t.includes("exit")) {
        await speakAsync("Goodbye! I'm here whenever you need me.", heard);
        break;
      }

      setState("processing"); setText(heard);
      await new Promise<void>(r => { const tid = setTimeout(r, 300); timers.current.push(tid); });
      if (!orbOpenRef.current || cancelRef.current) break;

      const answer = await getSmartResponse(heard, screenRef.current, recipeCtxRef.current);
      await speakAsync(answer, heard);
    }

    orbOpenRef.current = false;
    cancelRef.current  = false;
    setOrbOpen(false);
    setState("idle");
    setText("");
  }, [stopAll, closeOrb, listenOnce, speakAsync]);

  // ── Public: immediate TTS ─────────────────────────────────────
  const speakText = useCallback((text: string, label = "Read") => {
    stopAll();
    speakAsync(text, label).then(() => { setState("idle"); setText(""); });
  }, [stopAll, speakAsync]);

  // ── Public: instant answer without mic ────────────────────────
  const ask = useCallback((question: string) => {
    stopAll();
    setState("processing"); setText(question);
    const t = setTimeout(async () => {
      const response = await getSmartResponse(question, screenRef.current, recipeCtxRef.current);
      speakAsync(response, question).then(() => { setState("idle"); setText(""); });
    }, 300);
    timers.current.push(t);
  }, [stopAll, speakAsync]);

  // ── Free mic trigger ──────────────────────────────────────────
  const trigger = useCallback(() => {
    if (stateRef.current !== "idle" || autoReading) {
      stopAutoRead(); return;
    }
    timers.current.forEach(clearTimeout);
    if (wakeRef.current) { try { wakeRef.current.abort(); } catch {} wakeRef.current = null; }

    const SR = typeof window !== "undefined"
      ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;

    if (!SR) {
      const lines = VOICE_LINES[screenRef.current] || VOICE_LINES["dashboard"];
      const line = lines[Math.floor(Math.random() * lines.length)];
      setState("listening"); setText("");
      const t1 = setTimeout(() => { setState("processing"); setText(line.user); }, 1800);
      const t2 = setTimeout(() => speakAsync(line.ai, line.user).then(() => { setState("idle"); setText(""); }), 3300);
      timers.current = [t1, t2];
      return;
    }

    setState("listening"); setText("");
    const recog = new SR();
    recogRef.current = recog;
    recog.lang = "en-IN"; recog.interimResults = true; recog.maxAlternatives = 1;

    recog.onresult = (e: any) => {
      const partial = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setText(partial);
      if (e.results[e.results.length - 1].isFinal) {
        recog.stop();
        setState("processing");
        const t = setTimeout(async () => {
          const response = await getSmartResponse(partial, screenRef.current, recipeCtxRef.current);
          speakAsync(response, partial).then(() => { setState("idle"); setText(""); });
        }, 400);
        timers.current.push(t);
      }
    };
    recog.onspeechend = () => { try { recog.stop(); } catch {} };
    recog.onerror = (e: any) => {
      if (e.error === "no-speech") { setState("idle"); setText(""); return; }
      const lines = VOICE_LINES[screenRef.current] || VOICE_LINES["dashboard"];
      const line = lines[Math.floor(Math.random() * lines.length)];
      setState("processing"); setText(line.user);
      const t = setTimeout(() => speakAsync(line.ai, line.user).then(() => { setState("idle"); setText(""); }), 600);
      timers.current.push(t);
    };
    recog.onend = () => { setState(s => s === "listening" ? "idle" : s); };
    try { recog.start(); } catch { setState("idle"); }
  }, [stopAutoRead, autoReading, speakAsync]);

  // ── Wake word ─────────────────────────────────────────────────
  useEffect(() => {
    if (!supported || state !== "idle") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    let cancelled = false;
    let restartTimer: ReturnType<typeof setTimeout> | null = null;
    const start = () => {
      if (cancelled || stateRef.current !== "idle") return;
      try {
        const wr = new SR(); wakeRef.current = wr;
        wr.lang = "en-IN"; wr.continuous = true; wr.interimResults = true;
        wr.onresult = (e: any) => {
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const t = e.results[i][0].transcript.toLowerCase();
            if (t.includes("rasoi") || t.includes("hey")) {
              cancelled = true; wakeRef.current = null;
              try { wr.abort(); } catch {}
              trigger(); return;
            }
          }
        };
        wr.onerror = (e: any) => { if (e.error === "not-allowed") cancelled = true; };
        wr.onend = () => { wakeRef.current = null; if (!cancelled) restartTimer = setTimeout(start, 1500); };
        wr.start();
      } catch { cancelled = true; }
    };
    restartTimer = setTimeout(start, 2000);
    return () => {
      cancelled = true;
      if (restartTimer) clearTimeout(restartTimer);
      if (wakeRef.current) { try { wakeRef.current.abort(); } catch {} wakeRef.current = null; }
    };
  }, [supported, state, trigger]);

  // ── Space key ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.code === "Space" && tag !== "INPUT" && tag !== "TEXTAREA") { e.preventDefault(); openOrb(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openOrb]);

  useEffect(() => () => stopAll(), [stopAll]);

  return (
    <Ctx.Provider value={{ state, autoReading, text, history, trigger, speakText, ask, startAutoRead, stopAutoRead, screen, setScreen, recipeContext, setRecipeContext, supported, orbOpen, openOrb, closeOrb }}>
      {children}
    </Ctx.Provider>
  );
}

export const useVoice = () => useContext(Ctx);
