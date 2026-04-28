"use client";
import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";
import { VOICE_LINES, STOCK, MENU_ITEMS, STAFF, SUPPLIERS, RECIPES } from "@/lib/data";

export interface VoiceEntry { user: string; ai: string; time: string; }

export interface RecipeCtx {
  name: string;
  step: number;       // 0-indexed
  stepText: string;
  totalSteps: number;
}

interface VoiceCtx {
  state: "idle" | "listening" | "processing" | "speaking";
  text: string;
  history: VoiceEntry[];
  trigger: () => void;
  speakText: (text: string, label?: string) => void;
  speakQueue: (items: { text: string; label: string }[], onStep?: (i: number) => void) => () => void;
  ask: (question: string) => void;
  screen: string;
  setScreen: (s: string) => void;
  recipeContext: RecipeCtx | null;
  setRecipeContext: (ctx: RecipeCtx | null) => void;
  supported: boolean;
}

const Ctx = createContext<VoiceCtx>({
  state: "idle", text: "", history: [],
  trigger: () => {}, speakText: () => {}, speakQueue: () => () => {}, ask: () => {},
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

  // ── Global: recipe name queries from any screen ───────────────
  const recipeNames = recipes.map((r: any) => ({ r, key: r.name.toLowerCase() }));
  const mentionedRecipe = recipeNames.find(({ key }: { key: string }) =>
    key.split(" ").some((w: string) => w.length > 3 && t.includes(w))
  )?.r;

  if (mentionedRecipe && (t.includes("recipe") || t.includes("how") || t.includes("make") || t.includes("cook") || t.includes("ingredient") || t.includes("step"))) {
    if (t.includes("ingredient") || t.includes("need")) {
      return `${mentionedRecipe.name} ingredients: ${mentionedRecipe.ingredients.map((i: any) => `${i.name} ${i.qty}`).join(", ")}.`;
    }
    if (t.includes("step") || t.includes("how") || t.includes("make") || t.includes("cook")) {
      return `${mentionedRecipe.name}: ${mentionedRecipe.steps.length} steps. Step 1 — ${mentionedRecipe.steps[0].text} Open Recipe Studio for the full guided walkthrough.`;
    }
    return `${mentionedRecipe.name}: ${mentionedRecipe.time}, serves ${mentionedRecipe.serves}, margin ${mentionedRecipe.margin}. ${mentionedRecipe.steps.length} steps. Tap it in Recipe Studio for a voice-guided walkthrough.`;
  }

  // ── Global: help ──────────────────────────────────────────────
  if (t.includes("help") || t.includes("what can you"))
    return `On ${screen}, you can ask about ${screen === "inventory" ? "stock levels, low items, and reorders" : screen === "recipe" ? "recipe steps, ingredients, and substitutes" : screen === "menu" ? "margins, best sellers, and revenue" : screen === "staff" ? "who is on shift and station assignments" : screen === "timers" ? "timer status and kitchen timing" : screen === "suppliers" ? "delivery schedules and order status" : "today's status, stock alerts, and team"}.`;

  // ── Global: revenue / profit ──────────────────────────────────
  if (t.includes("revenue") || t.includes("money") || t.includes("profit")) {
    const rev = menu.reduce((s: number, i: any) => s + i.price * i.sales, 0);
    const top = [...menu].sort((a: any, b: any) => b.margin - a.margin)[0];
    return `Monthly revenue is approximately ₹${rev.toLocaleString("en-IN")}. Best margin dish is ${top?.name} at ${top?.margin}%.`;
  }

  // ── Global: stock check from non-inventory screens ────────────
  if (t.includes("stock") && !["inventory", "timers"].includes(screen)) {
    const low = stock.filter((s: any) => s.stock <= s.reorder);
    return low.length > 0
      ? `${low.length} items need reordering: ${low.slice(0, 3).map((i: any) => i.name).join(", ")}. Head to inventory for details.`
      : "All stock levels are healthy right now.";
  }

  // ── Screen-specific ───────────────────────────────────────────
  switch (screen) {

    case "dashboard": {
      const low = stock.filter((s: any) => s.stock <= s.reorder);
      const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
      const onDuty = staff.filter((s: any) => s.shifts.includes(day));
      const top = [...menu].sort((a: any, b: any) => b.margin - a.margin)[0];
      if (t.includes("staff") || t.includes("team")) return `${onDuty.length} staff on duty today: ${onDuty.slice(0,3).map((s: any) => s.name.split(" ")[0]).join(", ")}.`;
      if (t.includes("alert") || t.includes("issue")) return low.length > 0 ? `${low.length} stock alerts: ${low.map((i: any) => i.name).join(", ")}.` : "No alerts. Kitchen is running smoothly.";
      if (t.includes("margin") || t.includes("best dish")) return top ? `Best margin tonight is ${top.name} at ${top.margin}%. Push it on your specials board.` : "Check menu planning for margin details.";
      return `Kitchen status: ${onDuty.length} staff on duty, ${low.length} stock alert${low.length !== 1 ? "s" : ""}. Best margin: ${top?.name} at ${top?.margin}%.`;
    }

    case "inventory": {
      const low = stock.filter((s: any) => s.stock <= s.reorder);
      const critical = stock.filter((s: any) => (s.stock / s.max) * 100 <= 20);
      if (t.includes("critical") || t.includes("urgent") || t.includes("empty")) {
        return critical.length > 0
          ? `Critical items: ${critical.map((i: any) => `${i.name} — only ${i.stock}${i.unit} left`).join(", ")}. Order immediately.`
          : "Nothing critical. All items have stock above 20%.";
      }
      if (t.includes("low") || t.includes("reorder") || t.includes("running out")) {
        return low.length > 0
          ? `${low.length} items below reorder level: ${low.map((i: any) => `${i.name} (${i.stock}${i.unit})`).join(", ")}.`
          : "All items above reorder levels. Stock is healthy.";
      }
      if (t.includes("dairy") || t.includes("milk") || t.includes("paneer") || t.includes("ghee") || t.includes("cream")) {
        const dairy = stock.filter((s: any) => s.cat === "Dairy");
        return dairy.length > 0 ? `Dairy items: ${dairy.map((i: any) => `${i.name} ${i.stock}${i.unit}`).join(", ")}.` : "No dairy items tracked.";
      }
      if (t.includes("spice") || t.includes("masala") || t.includes("chilli")) {
        const spices = stock.filter((s: any) => s.cat === "Spices");
        return spices.length > 0 ? `Spices: ${spices.map((i: any) => `${i.name} ${i.stock}${i.unit}`).join(", ")}.` : "No spices tracked.";
      }
      const item = stock.find((s: any) => s.name.toLowerCase().split(" ").some((w: string) => t.includes(w) && w.length > 3));
      if (item) return `${item.name}: ${item.stock} ${item.unit} in stock. ${item.stock <= item.reorder ? `Below reorder level — order from ${item.supplier}.` : "Stock is healthy."}`;
      return `Tracking ${stock.length} items. ${low.length} need reordering${low.length > 0 ? ": " + low.slice(0,2).map((i: any) => i.name).join(", ") : ""}.`;
    }

    case "recipe": {
      // Step navigation using current recipe context
      if (recipeCtx) {
        const { name, step, stepText, totalSteps } = recipeCtx;
        if (t.includes("repeat") || t.includes("again") || t.includes("re-read") || t.includes("current"))
          return `Step ${step + 1}: ${stepText}`;
        if (t.includes("next") || t.includes("after"))
          return step + 1 < totalSteps
            ? `Step ${step + 2}: ${recipeCtx.stepText}` // note: page hasn't advanced yet
            : `That was the final step of ${name}. Serve and garnish!`;
        if (t.includes("previous") || t.includes("back") || t.includes("before") || t.includes("last"))
          return step > 0
            ? `Going back. Step ${step}: ${recipeCtx.stepText}`
            : `You're already at step 1 of ${name}.`;
        if (t.includes("how many") || t.includes("total step")) return `${name} has ${totalSteps} steps. You're on step ${step + 1}.`;
        if (t.includes("time") || t.includes("long") || t.includes("minute")) {
          const rec = recipes.find((r: any) => r.name === name);
          return rec ? `${name} takes ${rec.time} total.` : `Check the recipe card for timing details.`;
        }
        if (t.includes("ingredient") || t.includes("need")) {
          const rec = recipes.find((r: any) => r.name === name);
          return rec ? `${name} needs: ${rec.ingredients.map((i: any) => `${i.name} ${i.qty}`).join(", ")}.` : stepText;
        }
        if (t.includes("substitute") || t.includes("replace") || t.includes("instead")) {
          const rec = recipes.find((r: any) => r.name === name);
          const match = rec?.ingredients?.find((i: any) => i.sub && t.split(" ").some((w: string) => i.name.toLowerCase().includes(w)));
          if (match?.sub) return `Substitute for ${match.name}: ${match.sub}.`;
          return "For cream, use cashew paste. For ghee, use butter. For paneer, firm tofu works.";
        }
        // Default: read current step
        return `You're on step ${step + 1} of ${totalSteps} for ${name}. ${stepText}`;
      }

      // No recipe open yet
      const active = recipes.find((r: any) => r.active) || recipes[0];
      if (t.includes("substitute") || t.includes("replace") || t.includes("instead")) {
        const match = active?.ingredients?.find((i: any) => i.sub && t.split(" ").some((w: string) => i.name.toLowerCase().includes(w)));
        if (match?.sub) return `Substitute for ${match.name}: ${match.sub}.`;
        return "For cream, use cashew paste soaked overnight. For ghee, use butter. For paneer, firm tofu works.";
      }
      if (t.includes("ingredient") || t.includes("need")) {
        return active ? `${active.name} needs: ${active.ingredients?.map((i: any) => `${i.name} ${i.qty}`).join(", ")}.` : "Select a recipe to see its ingredients.";
      }
      if (t.includes("step") || t.includes("how") || t.includes("start")) {
        return active ? `${active.name}, step 1: ${active.steps?.[0]?.text}` : "Tap a recipe card to begin.";
      }
      if (t.includes("time") || t.includes("long") || t.includes("minute")) {
        return active ? `${active.name} takes ${active.time} total, serving ${active.serves}.` : "Check the recipe card for timing.";
      }
      return active ? `Currently on ${active.name}. Tap it to start the voice-guided steps, or ask me for ingredients, timing, or substitutes.` : `You have ${recipes.length} recipes. Tap a recipe card to start.`;
    }

    case "techniques": {
      if (t.includes("julienne") || t.includes("matchstick")) return "Julienne: square off sides first. Cut into 5cm planks at 2mm thick, stack them, then slice into 2mm matchsticks. Keep knuckles curled as a blade guide.";
      if (t.includes("dum") || t.includes("sealed pot")) return "Dum: seal your pot with atta dough, lowest flame possible. 30–45 minutes — never lift the lid mid-cook. The trapped steam is doing all the work.";
      if (t.includes("tadka") || t.includes("tarka") || t.includes("tempering")) return "Tarka: heat ghee until shimmering, add whole spices, wait 20–30 seconds until they splutter, then pour immediately. The sizzle sound tells you it's ready.";
      if (t.includes("brunoise") || t.includes("fine dice")) return "Brunoise is a 3mm precision dice. First julienne at exactly 3mm, then cross-cut at 3mm. Consistency is everything.";
      if (t.includes("chiffonade") || t.includes("herb") || t.includes("ribbon")) return "Chiffonade: stack leaves face-down, roll into a tight cigar, slice into thin ribbons crosswise. Sharp knife only — dull blades bruise the herbs.";
      if (t.includes("bhuno") || t.includes("bhuning") || t.includes("saute") || t.includes("masala")) return "Bhunoing is dry-roasting masala on high heat with constant stirring. Cook until oil visibly separates from the sides — that's when the rawness is gone.";
      if (t.includes("quenelle") || t.includes("plating")) return "Quenelle: warm two spoons in hot water, scoop into one, transfer back and forth shaping into an oval. Minimal contact when placing on the plate.";
      return "Ask me about any technique: julienne, chiffonade, brunoise, dum cooking, tarka, bhunoing, or quenelle plating.";
    }

    case "timers": {
      if (t.includes("biryani") || t.includes("dum")) return "Biryani dum needs 25–30 minutes on lowest flame after sealing. Set a 5-minute warning to prepare your garnish plate.";
      if (t.includes("dal") || t.includes("makhani")) return "Dal Makhani slow-cook: minimum 30 minutes, up to 2 hours for restaurant quality. Stir every 5 minutes and add water if it thickens.";
      if (t.includes("bread") || t.includes("naan") || t.includes("roti")) return "Naan in tandoor: 90 seconds each side at high heat. Watch for char spots — that's the flavour. Butter immediately after pulling.";
      if (t.includes("how many") || t.includes("active") || t.includes("running")) return "Check the timer panel for active timers. Any timer under 2 minutes shows in red as urgent.";
      return "Tap the plus button to add a new timer. Ask me timing for any dish — biryani, dal, naan, and more.";
    }

    case "menu": {
      const byMargin = [...menu].sort((a: any, b: any) => b.margin - a.margin);
      const bySales  = [...menu].sort((a: any, b: any) => b.sales - a.sales);
      if (t.includes("margin") || t.includes("profit") || t.includes("best")) return `Top margin dishes: ${byMargin.slice(0,3).map((i: any) => `${i.name} at ${i.margin}%`).join(", ")}.`;
      if (t.includes("popular") || t.includes("selling") || t.includes("order")) return `Best sellers this month: ${bySales.slice(0,3).map((i: any) => `${i.name} — ${i.sales} orders`).join(", ")}.`;
      if (t.includes("low") || t.includes("worst") || t.includes("poor")) return `Lowest margin: ${byMargin.slice(-2).reverse().map((i: any) => `${i.name} at ${i.margin}%`).join(", ")}. Consider reviewing ingredient costs.`;
      if (t.includes("revenue") || t.includes("total")) {
        const rev = menu.reduce((s: number, i: any) => s + i.price * i.sales, 0);
        return `Estimated monthly revenue: ₹${rev.toLocaleString("en-IN")} across ${menu.length} dishes.`;
      }
      const menuItem = menu.find((i: any) => i.name.toLowerCase().split(" ").some((w: string) => t.includes(w) && w.length > 3));
      if (menuItem) return `${menuItem.name}: costs ₹${menuItem.cost}, priced at ₹${menuItem.price}, margin ${menuItem.margin}%, sold ${menuItem.sales} this month.`;
      return `${menu.length} dishes on menu. Best earner: ${byMargin[0]?.name} at ${byMargin[0]?.margin}% margin.`;
    }

    case "staff": {
      const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
      const today = staff.filter((s: any) => s.shifts.includes(day));
      if (t.includes("today") || t.includes("who") || t.includes("working") || t.includes("duty") || t.includes("shift")) {
        return today.length > 0
          ? `${today.length} on duty today (${day}): ${today.map((s: any) => `${s.name} on ${s.station}`).join(", ")}.`
          : `No staff scheduled for ${day}.`;
      }
      if (t.includes("station") || t.includes("grill") || t.includes("tandoor") || t.includes("section")) {
        return today.length > 0
          ? `Station assignments today: ${today.map((s: any) => `${s.name.split(" ")[0]} → ${s.station}`).join(", ")}.`
          : "No staff on shift today.";
      }
      if (t.includes("leave") || t.includes("off") || t.includes("absent")) {
        const off = staff.filter((s: any) => !s.shifts.includes(day));
        return off.length > 0 ? `${off.length} staff off today: ${off.map((s: any) => s.name.split(" ")[0]).join(", ")}.` : "All staff scheduled today.";
      }
      return `${staff.length} team members total. ${today.length} working today (${day}).`;
    }

    case "suppliers": {
      const pending = suppliers.filter((s: any) => s.status === "order-placed");
      const daily   = suppliers.filter((s: any) => s.delivery === "Daily");
      if (t.includes("deliver") || t.includes("today") || t.includes("coming")) {
        return daily.length > 0
          ? `Daily deliveries: ${daily.map((s: any) => s.name).join(", ")}. ${pending.length} orders currently in transit.`
          : "No daily deliveries. Check individual supplier schedules.";
      }
      if (t.includes("order") || t.includes("pending") || t.includes("transit")) {
        return pending.length > 0
          ? `${pending.length} pending order${pending.length > 1 ? "s" : ""}: ${pending.map((s: any) => s.name).join(", ")}.`
          : "No pending orders. All deliveries are up to date.";
      }
      if (t.includes("rating") || t.includes("best") || t.includes("reliable")) {
        const top = [...suppliers].sort((a: any, b: any) => b.rating - a.rating).slice(0, 2);
        return `Top rated suppliers: ${top.map((s: any) => `${s.name} at ${s.rating}★`).join(", ")}.`;
      }
      const sup = suppliers.find((s: any) => s.name.toLowerCase().split(" ").some((w: string) => t.includes(w) && w.length > 3));
      if (sup) return `${sup.name}: ${sup.cat}, delivers ${sup.delivery}, rated ${sup.rating}★. Last order: ${sup.lastOrder}.`;
      return `${suppliers.length} active suppliers. ${pending.length} pending orders. Next daily delivery: ${daily[0]?.name || "none scheduled"}.`;
    }
  }

  const lines = VOICE_LINES[screen] || VOICE_LINES["dashboard"];
  return lines[Math.floor(Math.random() * lines.length)].ai;
}

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [state, setState]           = useState<VoiceCtx["state"]>("idle");
  const [text, setText]             = useState("");
  const [history, setHist]          = useState<VoiceEntry[]>([]);
  const [screen, setScreen]         = useState("dashboard");
  const [recipeContext, setRecipeContext] = useState<RecipeCtx | null>(null);
  const [supported, setSupported]   = useState(false);
  const recogRef   = useRef<any>(null);
  const wakeRef    = useRef<any>(null);
  const timers     = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stateRef   = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);
  const screenRef  = useRef(screen);
  useEffect(() => { screenRef.current = screen; }, [screen]);
  const recipeCtxRef = useRef(recipeContext);
  useEffect(() => { recipeCtxRef.current = recipeContext; }, [recipeContext]);

  useEffect(() => {
    const SR = typeof window !== "undefined"
      ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
      : null;
    setSupported(!!SR);
  }, []);

  const stopAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    if (recogRef.current) { try { recogRef.current.stop(); } catch {} recogRef.current = null; }
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const doSpeak = useCallback((response: string, label: string, onDone?: () => void) => {
    const ts = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setHist(prev => [{ user: label, ai: response, time: ts }, ...prev.slice(0, 11)]);
    setState("speaking");
    setText(response);

    if (typeof window === "undefined" || !window.speechSynthesis) {
      const t = setTimeout(() => { setState("idle"); setText(""); onDone?.(); }, 7000);
      timers.current.push(t);
      return;
    }

    window.speechSynthesis.cancel();

    const speak = () => {
      const utt = new SpeechSynthesisUtterance(response);
      utt.lang = "en-IN";
      utt.rate = 0.9;
      utt.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang === "en-IN") || voices.find(v => v.lang.startsWith("en"));
      if (preferred) utt.voice = preferred;
      const nudge = setInterval(() => window.speechSynthesis.resume?.(), 10000);
      timers.current.push(nudge as unknown as ReturnType<typeof setTimeout>);
      utt.onend = () => {
        clearInterval(nudge);
        if (onDone) { onDone(); }
        else { setState("idle"); setText(""); }
      };
      utt.onerror = () => {
        clearInterval(nudge);
        if (onDone) { onDone(); }
        else { const t = setTimeout(() => { setState("idle"); setText(""); }, 7000); timers.current.push(t); }
      };
      window.speechSynthesis.speak(utt);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speak();
      };
      const t = setTimeout(speak, 500);
      timers.current.push(t);
    }
  }, []);

  // Public: read text immediately without listening
  const speakText = useCallback((text: string, label = "▶ Voice guide") => {
    stopAll();
    doSpeak(text, label);
  }, [stopAll, doSpeak]);

  // Public: read a queue of items sequentially, calling onStep(i) before each
  const speakQueue = useCallback((
    items: { text: string; label: string }[],
    onStep?: (i: number) => void
  ): () => void => {
    stopAll();
    let stopped = false;

    const playNext = (i: number) => {
      if (stopped || i >= items.length) { setState("idle"); setText(""); return; }
      onStep?.(i);
      doSpeak(items[i].text, items[i].label, () => {
        if (!stopped) {
          const t = setTimeout(() => playNext(i + 1), 700);
          timers.current.push(t);
        }
      });
    };

    playNext(0);
    return () => { stopped = true; stopAll(); setState("idle"); setText(""); };
  }, [stopAll, doSpeak]);

  // Public: ask a pre-built question (speaks answer immediately without mic)
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

  const simulateFallback = useCallback((scr: string) => {
    const lines = VOICE_LINES[scr] || VOICE_LINES["dashboard"];
    const line  = lines[Math.floor(Math.random() * lines.length)];
    setState("listening");
    setText("");
    const t1 = setTimeout(() => { setState("processing"); setText(line.user); }, 1800);
    const t2 = setTimeout(() => doSpeak(line.ai, line.user), 3300);
    timers.current = [t1, t2];
  }, [doSpeak]);

  const trigger = useCallback(() => {
    if (stateRef.current !== "idle") {
      stopAll();
      setState("idle");
      setText("");
      return;
    }
    timers.current.forEach(clearTimeout);
    if (wakeRef.current) { try { wakeRef.current.stop(); } catch {} wakeRef.current = null; }

    const SR = typeof window !== "undefined"
      ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
      : null;

    if (!SR) { simulateFallback(screenRef.current); return; }

    setState("listening");
    setText("");

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
      simulateFallback(screenRef.current);
    };
    recog.onend = () => { setState(s => s === "listening" ? "idle" : s); };

    try { recog.start(); } catch { simulateFallback(screenRef.current); }
  }, [stopAll, doSpeak, simulateFallback]);

  // ── Wake word listener ────────────────────────────────────────
  useEffect(() => {
    if (!supported || stateRef.current !== "idle") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    let cancelled = false;
    let restartTimer: ReturnType<typeof setTimeout> | null = null;

    const start = () => {
      if (cancelled || stateRef.current !== "idle") return;
      try {
        const wr = new SR();
        wakeRef.current = wr;
        wr.lang = "en-IN";
        wr.continuous = true;
        wr.interimResults = true;
        wr.maxAlternatives = 1;

        wr.onresult = (e: any) => {
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const t = e.results[i][0].transcript.toLowerCase();
            if (t.includes("rasoi") || t.includes("hey")) {
              cancelled = true;
              wakeRef.current = null;
              try { wr.stop(); } catch {}
              trigger();
              return;
            }
          }
        };
        wr.onerror = (e: any) => {
          if (e.error === "not-allowed" || e.error === "service-not-allowed") cancelled = true;
        };
        wr.onend = () => {
          wakeRef.current = null;
          if (!cancelled) restartTimer = setTimeout(start, 1500);
        };
        wr.start();
      } catch { cancelled = true; }
    };

    restartTimer = setTimeout(start, 2000);
    return () => {
      cancelled = true;
      if (restartTimer) clearTimeout(restartTimer);
      if (wakeRef.current) { try { wakeRef.current.stop(); } catch {} wakeRef.current = null; }
    };
  }, [supported, state, trigger]);

  // ── Space key shortcut ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.code === "Space" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        trigger();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [trigger]);

  useEffect(() => () => stopAll(), [stopAll]);

  return (
    <Ctx.Provider value={{ state, text, history, trigger, speakText, speakQueue, ask, screen, setScreen, recipeContext, setRecipeContext, supported }}>
      {children}
    </Ctx.Provider>
  );
}

export const useVoice = () => useContext(Ctx);
