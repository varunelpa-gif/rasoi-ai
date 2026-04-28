"use client";
import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";
import { VOICE_LINES, STOCK, MENU_ITEMS, STAFF, SUPPLIERS, RECIPES } from "@/lib/data";

export interface VoiceEntry { user: string; ai: string; time: string; }

export interface RecipeCtx {
  name: string;
  step: number;
  stepText: string;
  totalSteps: number;
}

type VoiceState = "idle" | "listening" | "processing" | "speaking" | "paused";

interface VoiceCtx {
  state: VoiceState;
  autoReading: boolean;
  text: string;
  history: VoiceEntry[];
  trigger: () => void;
  speakText: (text: string, label?: string) => void;
  ask: (question: string) => void;
  startAutoRead: (items: { text: string; stepLabel: string }[], startIdx: number, onStep: (i: number) => void) => void;
  stopAutoRead: () => void;
  pauseAutoRead: () => void;
  resumeAutoRead: () => void;
  screen: string;
  setScreen: (s: string) => void;
  recipeContext: RecipeCtx | null;
  setRecipeContext: (ctx: RecipeCtx | null) => void;
  supported: boolean;
}

const Ctx = createContext<VoiceCtx>({
  state: "idle", autoReading: false, text: "", history: [],
  trigger: () => {}, speakText: () => {}, ask: () => {},
  startAutoRead: () => {}, stopAutoRead: () => {}, pauseAutoRead: () => {}, resumeAutoRead: () => {},
  screen: "dashboard", setScreen: () => {},
  recipeContext: null, setRecipeContext: () => {},
  supported: false,
});

function loadData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback) as T;
  } catch { return fallback; }
}

function smartResponse(transcript: string, screen: string, recipeCtx: RecipeCtx | null): string {
  const t = transcript.toLowerCase().trim();
  const stock     = loadData("rasoi_stock",     STOCK);
  const menu      = loadData("rasoi_menu",      MENU_ITEMS);
  const staff     = loadData("rasoi_staff",     STAFF);
  const suppliers = loadData("rasoi_suppliers", SUPPLIERS);
  const recipes   = loadData("rasoi_recipes",   RECIPES);

  // Global: recipe name queries from any screen
  const mentionedRecipe = recipes.map((r: any) => ({ r, key: r.name.toLowerCase() }))
    .find(({ key }: { key: string }) => key.split(" ").some((w: string) => w.length > 3 && t.includes(w)))?.r;

  if (mentionedRecipe && (t.includes("recipe") || t.includes("how") || t.includes("make") || t.includes("cook") || t.includes("ingredient") || t.includes("step"))) {
    if (t.includes("ingredient") || t.includes("need"))
      return `${mentionedRecipe.name} needs: ${mentionedRecipe.ingredients.map((i: any) => `${i.name} ${i.qty}`).join(", ")}.`;
    return `${mentionedRecipe.name}: ${mentionedRecipe.steps.length} steps, takes ${mentionedRecipe.time}. Step 1 — ${mentionedRecipe.steps[0].text}`;
  }

  if (t.includes("help") || t.includes("what can you"))
    return `I can guide you through recipes step by step, answer questions about ingredients, substitutes, timing, or anything about your kitchen. Just ask!`;

  if (t.includes("revenue") || t.includes("money") || t.includes("profit")) {
    const rev = menu.reduce((s: number, i: any) => s + i.price * i.sales, 0);
    const top = [...menu].sort((a: any, b: any) => b.margin - a.margin)[0];
    return `Monthly revenue is approximately ₹${rev.toLocaleString("en-IN")}. Best margin dish is ${top?.name} at ${top?.margin}%.`;
  }

  if (t.includes("stock") && !["inventory", "timers"].includes(screen)) {
    const low = stock.filter((s: any) => s.stock <= s.reorder);
    return low.length > 0
      ? `${low.length} items need reordering: ${low.slice(0, 3).map((i: any) => i.name).join(", ")}.`
      : "All stock levels are healthy right now.";
  }

  switch (screen) {
    case "dashboard": {
      const low = stock.filter((s: any) => s.stock <= s.reorder);
      const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
      const onDuty = staff.filter((s: any) => s.shifts.includes(day));
      const top = [...menu].sort((a: any, b: any) => b.margin - a.margin)[0];
      if (t.includes("staff") || t.includes("team")) return `${onDuty.length} staff on duty: ${onDuty.slice(0,3).map((s: any) => s.name.split(" ")[0]).join(", ")}.`;
      if (t.includes("alert") || t.includes("issue")) return low.length > 0 ? `${low.length} stock alerts: ${low.map((i: any) => i.name).join(", ")}.` : "No alerts, kitchen is running smoothly.";
      if (t.includes("margin")) return top ? `Best margin tonight is ${top.name} at ${top.margin}%. Push it on your specials board.` : "Check menu planning for margin details.";
      return `Kitchen status: ${onDuty.length} staff on duty, ${low.length} stock alert${low.length !== 1 ? "s" : ""}. Best margin: ${top?.name} at ${top?.margin}%.`;
    }
    case "inventory": {
      const low = stock.filter((s: any) => s.stock <= s.reorder);
      const critical = stock.filter((s: any) => (s.stock / s.max) * 100 <= 20);
      if (t.includes("critical") || t.includes("urgent") || t.includes("empty"))
        return critical.length > 0
          ? `Critical: ${critical.map((i: any) => `${i.name} — only ${i.stock}${i.unit} left`).join(", ")}. Order immediately.`
          : "Nothing critical, all items above 20%.";
      if (t.includes("dairy") || t.includes("paneer") || t.includes("ghee") || t.includes("cream")) {
        const dairy = stock.filter((s: any) => s.cat === "Dairy");
        return dairy.length > 0 ? `Dairy: ${dairy.map((i: any) => `${i.name} ${i.stock}${i.unit}`).join(", ")}.` : "No dairy tracked.";
      }
      if (t.includes("spice") || t.includes("masala") || t.includes("chilli")) {
        const spices = stock.filter((s: any) => s.cat === "Spices");
        return spices.length > 0 ? `Spices: ${spices.map((i: any) => `${i.name} ${i.stock}${i.unit}`).join(", ")}.` : "No spices tracked.";
      }
      const item = stock.find((s: any) => s.name.toLowerCase().split(" ").some((w: string) => t.includes(w) && w.length > 3));
      if (item) return `${item.name}: ${item.stock} ${item.unit} in stock. ${item.stock <= item.reorder ? `Below reorder — order from ${item.supplier}.` : "Stock is healthy."}`;
      return low.length > 0
        ? `${low.length} items below reorder: ${low.map((i: any) => `${i.name} (${i.stock}${i.unit})`).join(", ")}.`
        : `All ${stock.length} items are well stocked.`;
    }
    case "recipe": {
      if (recipeCtx) {
        const { name, step, stepText, totalSteps } = recipeCtx;
        if (t.includes("substitute") || t.includes("replace") || t.includes("instead")) {
          const rec = recipes.find((r: any) => r.name === name);
          const match = rec?.ingredients?.find((i: any) => i.sub && t.split(" ").some((w: string) => i.name.toLowerCase().includes(w)));
          if (match?.sub) return `For ${match.name}, you can use ${match.sub}.`;
          return "For cream, use cashew paste soaked overnight. For ghee, use butter. For paneer, firm tofu works well.";
        }
        if (t.includes("ingredient") || t.includes("what do i need")) {
          const rec = recipes.find((r: any) => r.name === name);
          return rec ? `${name} needs: ${rec.ingredients.map((i: any) => `${i.name} ${i.qty}`).join(", ")}.` : stepText;
        }
        if (t.includes("how long") || t.includes("time") || t.includes("minute")) {
          const rec = recipes.find((r: any) => r.name === name);
          return rec ? `${name} takes ${rec.time} total. You're on step ${step + 1} of ${totalSteps}.` : "Check the recipe card for timing.";
        }
        return `You're on step ${step + 1} of ${totalSteps} for ${name}. ${stepText}`;
      }
      const active = recipes.find((r: any) => r.active) || recipes[0];
      if (t.includes("substitute") || t.includes("replace"))
        return "For cream, use cashew paste. For ghee, use butter. For paneer, firm tofu works.";
      if (t.includes("ingredient"))
        return active ? `${active.name} needs: ${active.ingredients?.map((i: any) => `${i.name} ${i.qty}`).join(", ")}.` : "Select a recipe first.";
      return active ? `Currently on ${active.name}. Tap it to start guided cooking, or ask me anything.` : "Tap a recipe card to get started.";
    }
    case "techniques": {
      if (t.includes("julienne") || t.includes("matchstick")) return "Julienne: square off vegetable sides, cut into 5cm planks at 2mm, stack and slice into 2mm matchsticks. Keep knuckles curled as a blade guide.";
      if (t.includes("dum") || t.includes("sealed")) return "Dum cooking: seal with atta dough, lowest flame possible, 30 to 45 minutes. Never lift the lid mid-cook — the trapped steam does all the work.";
      if (t.includes("tadka") || t.includes("tarka") || t.includes("temper")) return "Tarka: heat ghee until shimmering, add whole spices, wait 20 to 30 seconds until they splutter, pour immediately. The sizzle tells you it's ready.";
      if (t.includes("brunoise") || t.includes("dice")) return "Brunoise is a 3mm precision dice. First julienne at exactly 3mm, then cross-cut at 3mm. Consistency requires practice.";
      if (t.includes("chiffonade") || t.includes("ribbon")) return "Chiffonade: stack leaves face-down, roll into a tight cigar, slice into thin ribbons. Sharp knife only — dull blades bruise the herbs.";
      if (t.includes("bhuno") || t.includes("saute") || t.includes("masala")) return "Bhunoing: high heat, constant stirring. Cook until oil visibly separates from the sides — that's when the rawness is completely gone.";
      return "Ask me about julienne, chiffonade, brunoise, dum cooking, tarka, or bhunoing.";
    }
    case "timers": {
      if (t.includes("biryani") || t.includes("dum")) return "Biryani dum: 25 to 30 minutes on lowest flame after sealing. Set a 5-minute warning to prepare your garnish.";
      if (t.includes("dal") || t.includes("makhani")) return "Dal Makhani: minimum 30 minutes, up to 2 hours for restaurant quality. Stir every 5 minutes and add water if too thick.";
      if (t.includes("naan") || t.includes("bread") || t.includes("roti")) return "Naan in tandoor: 90 seconds each side at high heat. Butter immediately after pulling.";
      return "Tell me the dish and I'll give you the timing. Tap plus to start a new timer.";
    }
    case "menu": {
      const byMargin = [...menu].sort((a: any, b: any) => b.margin - a.margin);
      const bySales  = [...menu].sort((a: any, b: any) => b.sales - a.sales);
      if (t.includes("margin") || t.includes("profit")) return `Top margins: ${byMargin.slice(0,3).map((i: any) => `${i.name} at ${i.margin}%`).join(", ")}.`;
      if (t.includes("popular") || t.includes("selling")) return `Best sellers: ${bySales.slice(0,3).map((i: any) => `${i.name} — ${i.sales} orders`).join(", ")}.`;
      const menuItem = menu.find((i: any) => i.name.toLowerCase().split(" ").some((w: string) => t.includes(w) && w.length > 3));
      if (menuItem) return `${menuItem.name}: costs ₹${menuItem.cost}, priced ₹${menuItem.price}, margin ${menuItem.margin}%, sold ${menuItem.sales} this month.`;
      return `${menu.length} dishes on menu. Best earner: ${byMargin[0]?.name} at ${byMargin[0]?.margin}%.`;
    }
    case "staff": {
      const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
      const today = staff.filter((s: any) => s.shifts.includes(day));
      if (t.includes("today") || t.includes("who") || t.includes("working") || t.includes("duty"))
        return today.length > 0
          ? `${today.length} on duty today: ${today.map((s: any) => `${s.name} on ${s.station}`).join(", ")}.`
          : `No staff scheduled for ${day}.`;
      if (t.includes("off") || t.includes("leave") || t.includes("absent")) {
        const off = staff.filter((s: any) => !s.shifts.includes(day));
        return off.length > 0 ? `Off today: ${off.map((s: any) => s.name.split(" ")[0]).join(", ")}.` : "Everyone is scheduled today.";
      }
      return `${staff.length} team members total, ${today.length} working today.`;
    }
    case "suppliers": {
      const pending = suppliers.filter((s: any) => s.status === "order-placed");
      const daily   = suppliers.filter((s: any) => s.delivery === "Daily");
      if (t.includes("pending") || t.includes("order") || t.includes("transit"))
        return pending.length > 0
          ? `${pending.length} pending order${pending.length > 1 ? "s" : ""}: ${pending.map((s: any) => s.name).join(", ")}.`
          : "No pending orders.";
      if (t.includes("deliver") || t.includes("today"))
        return daily.length > 0
          ? `Daily deliveries: ${daily.map((s: any) => s.name).join(", ")}.`
          : "No daily deliveries scheduled.";
      return `${suppliers.length} suppliers, ${pending.length} pending orders.`;
    }
  }
  const lines = VOICE_LINES[screen] || VOICE_LINES["dashboard"];
  return lines[Math.floor(Math.random() * lines.length)].ai;
}

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [state, setState]               = useState<VoiceState>("idle");
  const [autoReading, setAutoReading]   = useState(false);
  const [text, setText]                 = useState("");
  const [history, setHist]              = useState<VoiceEntry[]>([]);
  const [screen, setScreen]             = useState("dashboard");
  const [recipeContext, setRecipeContext] = useState<RecipeCtx | null>(null);
  const [supported, setSupported]       = useState(false);

  const recogRef        = useRef<any>(null);
  const wakeRef         = useRef<any>(null);
  const timers          = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stateRef        = useRef(state);
  const screenRef       = useRef(screen);
  const recipeCtxRef    = useRef(recipeContext);
  const autoReadCancel  = useRef(false);
  const autoReadPause   = useRef(false);
  const resumeSignal    = useRef<(() => void) | null>(null);

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
    if (recogRef.current) { try { recogRef.current.abort(); } catch {} recogRef.current = null; }
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  // Core TTS — resolves onDone when speech ends (with timeout fallback for Chrome reliability)
  const doSpeak = useCallback((response: string, label: string, onDone?: () => void) => {
    const ts = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setHist(prev => [{ user: label, ai: response, time: ts }, ...prev.slice(0, 19)]);
    setState("speaking");
    setText(response);

    if (typeof window === "undefined" || !window.speechSynthesis) {
      const t = setTimeout(() => { setState("idle"); setText(""); onDone?.(); }, 5000);
      timers.current.push(t);
      return;
    }

    window.speechSynthesis.cancel();

    const run = () => {
      const utt = new SpeechSynthesisUtterance(response);
      utt.lang = "en-IN";
      utt.rate = 0.88;
      utt.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang === "en-IN") || voices.find(v => v.lang.startsWith("en"));
      if (preferred) utt.voice = preferred;

      // Estimate duration as fallback for Chrome's unreliable onend
      const wordCount = response.split(/\s+/).length;
      const estMs = Math.max(4000, (wordCount / 2.2) * 1000 + 1500);

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearInterval(nudge);
        clearTimeout(fallback);
        if (onDone) { onDone(); } else { setState("idle"); setText(""); }
      };

      const nudge = setInterval(() => window.speechSynthesis.resume?.(), 8000);
      const fallback = setTimeout(finish, estMs);
      timers.current.push(nudge as unknown as ReturnType<typeof setTimeout>);
      timers.current.push(fallback);

      utt.onend = finish;
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
  }, []);

  // Promise wrapper for async/await use
  const speakAsync = useCallback((response: string, label: string): Promise<void> => {
    return new Promise(resolve => doSpeak(response, label, resolve));
  }, [doSpeak]);

  // Brief mic listen — resolves with transcript or null on timeout/error
  const commandListen = useCallback((duration: number): Promise<string | null> => {
    return new Promise(resolve => {
      if (autoReadCancel.current) { resolve(null); return; }
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) { setTimeout(() => resolve(null), duration); return; }

      const r = new SR();
      r.lang = "en-IN";
      r.maxAlternatives = 1;

      let done = false;
      const finish = (result: string | null) => {
        if (done) return;
        done = true;
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

  // ── Conversational auto-read ──────────────────────────────────
  const startAutoRead = useCallback(async (
    items: { text: string; stepLabel: string }[],
    startIdx: number,
    onStep: (i: number) => void
  ) => {
    stopAll();
    autoReadCancel.current = false;
    autoReadPause.current  = false;
    setAutoReading(true);

    // Stop wake word while in conversation
    if (wakeRef.current) { try { wakeRef.current.abort(); } catch {} wakeRef.current = null; }

    const say = (t: string, l: string) => speakAsync(t, l);
    const listen = (ms: number) => commandListen(ms);

    const isStop    = (t: string) => /(stop|end|cancel|quit|enough|done|finish)/i.test(t);
    const isPause   = (t: string) => /(pause|wait|hold|slow|one sec|moment)/i.test(t);
    const isContinue = (t: string) => /(continue|resume|yes|yeah|go|next|carry|proceed|ready|sure|ok)/i.test(t);
    const isRepeat  = (t: string) => /(repeat|again|re-read|what|pardon|sorry)/i.test(t);

    for (let i = startIdx; i < items.length; i++) {
      if (autoReadCancel.current) break;

      // Handle pause signal from UI button
      if (autoReadPause.current) {
        setState("paused");
        await say(`Paused at step ${i + 1}. Say "continue" whenever you're ready, or ask me anything.`, "Paused");
        // Wait until UI/voice resumes
        await new Promise<void>(resolve => {
          resumeSignal.current = resolve;
          const check = setInterval(() => { if (autoReadCancel.current) { clearInterval(check); resolve(); } }, 300);
        });
        autoReadPause.current = false;
        if (autoReadCancel.current) break;
      }

      // Read the current step
      onStep(i);
      setState("speaking");
      await say(items[i].text, items[i].stepLabel);

      if (autoReadCancel.current) break;

      // Last step — done
      if (i === items.length - 1) {
        await say("That's all the steps! Well done. Your dish is ready to serve.", "Complete");
        break;
      }

      // Listen for command between steps (2.5 seconds)
      const heard = await listen(2500);
      setState("speaking");
      setText("");

      if (autoReadCancel.current) break;

      if (!heard) {
        // Silence — auto-continue
        continue;
      }

      const t = heard.toLowerCase();

      if (isStop(t)) {
        await say("Alright, stopping here. Come back whenever you're ready to continue cooking!", "Stopped");
        break;
      }

      if (isPause(t)) {
        setState("paused");
        await say(`Sure, paused at step ${i + 1}. Say "continue" when you're ready.`, "Paused");
        await new Promise<void>(resolve => {
          resumeSignal.current = resolve;
          const check = setInterval(() => { if (autoReadCancel.current) { clearInterval(check); resolve(); } }, 300);
        });
        autoReadPause.current = false;
        if (autoReadCancel.current) break;
        // Re-read the next step after resume
        continue;
      }

      if (isRepeat(t)) {
        i--; // will be incremented back to same step
        continue;
      }

      // It's a question — answer it, then offer to continue
      const answer = smartResponse(heard, screenRef.current, recipeCtxRef.current);
      const nextStepNum = i + 2;
      await say(`${answer} — Shall I continue with step ${nextStepNum}?`, heard);

      if (autoReadCancel.current) break;

      // Listen for yes/no/another question
      setState("listening");
      const confirm = await listen(5000);
      setState("speaking");
      setText("");

      if (autoReadCancel.current) break;

      if (!confirm || isContinue(confirm)) {
        // Continue to next step
        continue;
      }

      if (isStop(confirm)) {
        await say("No problem. Come back when you're ready!", "Stopped");
        break;
      }

      // Another question!
      const answer2 = smartResponse(confirm, screenRef.current, recipeCtxRef.current);
      await say(`${answer2} — Ready for step ${nextStepNum}?`, confirm);

      const confirm2 = await listen(4000);
      if (!confirm2 || isContinue(confirm2)) {
        continue;
      }
      await say("Alright, stopping for now. Come back anytime!", "Stopped");
      break;
    }

    if (!autoReadCancel.current) {
      setState("idle");
      setText("");
    }
    setAutoReading(false);
    autoReadCancel.current = false;
  }, [stopAll, speakAsync, commandListen]);

  const stopAutoRead = useCallback(() => {
    autoReadCancel.current = true;
    resumeSignal.current?.();
    resumeSignal.current = null;
    stopAll();
    setState("idle");
    setText("");
    setAutoReading(false);
  }, [stopAll]);

  const pauseAutoRead = useCallback(() => {
    autoReadPause.current = true;
    // Cancel current speech so pause takes effect immediately
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const resumeAutoRead = useCallback(() => {
    autoReadPause.current = false;
    if (resumeSignal.current) {
      resumeSignal.current();
      resumeSignal.current = null;
    }
  }, []);

  // ── Public: immediate TTS ─────────────────────────────────────
  const speakText = useCallback((text: string, label = "▶ Read") => {
    stopAll();
    doSpeak(text, label);
  }, [stopAll, doSpeak]);

  // ── Public: instant answer (no mic) ──────────────────────────
  const ask = useCallback((question: string) => {
    stopAll();
    setState("processing");
    setText(question);
    const t = setTimeout(() => {
      const response = smartResponse(question, screenRef.current, recipeCtxRef.current);
      doSpeak(response, question);
    }, 300);
    timers.current.push(t);
  }, [stopAll, doSpeak]);

  // ── Mic trigger (free-form question) ─────────────────────────
  const trigger = useCallback(() => {
    if (stateRef.current !== "idle") {
      if (autoReading) { stopAutoRead(); return; }
      stopAll();
      setState("idle");
      setText("");
      return;
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
      const t2 = setTimeout(() => doSpeak(line.ai, line.user), 3300);
      timers.current = [t1, t2];
      return;
    }

    setState("listening"); setText("");
    const recog = new SR();
    recogRef.current = recog;
    recog.lang = "en-IN";
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    recog.onresult = (e: any) => {
      const partial = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setText(partial);
      if (e.results[e.results.length - 1].isFinal) {
        recog.stop();
        setState("processing");
        const t = setTimeout(() => {
          const response = smartResponse(partial, screenRef.current, recipeCtxRef.current);
          doSpeak(response, partial);
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
      const t = setTimeout(() => doSpeak(line.ai, line.user), 600);
      timers.current.push(t);
    };
    recog.onend = () => { setState(s => s === "listening" ? "idle" : s); };
    try { recog.start(); } catch { setState("idle"); }
  }, [stopAll, stopAutoRead, autoReading, doSpeak]);

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
        const wr = new SR();
        wakeRef.current = wr;
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
        wr.onerror = (e: any) => { if (e.error === "not-allowed" || e.error === "service-not-allowed") cancelled = true; };
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
      if (e.code === "Space" && tag !== "INPUT" && tag !== "TEXTAREA") { e.preventDefault(); trigger(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [trigger]);

  useEffect(() => () => stopAll(), [stopAll]);

  return (
    <Ctx.Provider value={{ state, autoReading, text, history, trigger, speakText, ask, startAutoRead, stopAutoRead, pauseAutoRead, resumeAutoRead, screen, setScreen, recipeContext, setRecipeContext, supported }}>
      {children}
    </Ctx.Provider>
  );
}

export const useVoice = () => useContext(Ctx);
