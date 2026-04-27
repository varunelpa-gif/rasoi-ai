"use client";
import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";
import { VOICE_LINES } from "@/lib/data";

export interface VoiceEntry {
  user: string;
  ai: string;
  time: string;
}

interface VoiceCtx {
  state: "idle" | "listening" | "processing" | "speaking";
  text: string;
  history: VoiceEntry[];
  trigger: () => void;
  screen: string;
  setScreen: (s: string) => void;
  supported: boolean;
}

const Ctx = createContext<VoiceCtx>({
  state: "idle", text: "", history: [],
  trigger: () => {}, screen: "dashboard", setScreen: () => {}, supported: false,
});

function smartResponse(transcript: string, screen: string): string {
  const t = transcript.toLowerCase();

  // Read live data from localStorage for real responses
  const load = <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    try { return JSON.parse(localStorage.getItem(key) || "") ?? fallback; } catch { return fallback; }
  };

  switch (screen) {
    case "inventory": {
      const stock = load<typeof import("@/lib/data").STOCK>("rasoi_stock", []);
      const low = stock.filter((s: any) => s.stock <= s.reorder);
      if (t.includes("low") || t.includes("critical") || t.includes("running out")) {
        if (low.length === 0) return "All stock levels are healthy right now. No reorders needed.";
        return `${low.length} item${low.length > 1 ? "s" : ""} need reordering: ${low.map((i: any) => `${i.name} (${i.stock} ${i.unit})`).join(", ")}. Place orders today.`;
      }
      const item = stock.find((s: any) => t.includes(s.name.toLowerCase().split(" ")[0]));
      if (item) return `${item.name}: ${item.stock} ${item.unit} in stock. ${item.stock <= item.reorder ? "Below reorder level — order soon from " + item.supplier + "." : "Stock is healthy."}`;
      return `Tracking ${stock.length} items. ${low.length} need reordering. ${low.length > 0 ? "Critical: " + low[0].name + "." : "All levels healthy."}`;
    }
    case "recipe": {
      const recipes = load<typeof import("@/lib/data").RECIPES>("rasoi_recipes", []);
      const active = recipes.find((r: any) => r.active);
      if (t.includes("substitute") || t.includes("replace")) {
        const match = active?.ingredients.find((i: any) => i.sub && t.includes(i.name.toLowerCase().split(" ")[0]));
        return match?.sub ? `Substitute for ${match.name}: ${match.sub}.` : "For cream, use cashew paste soaked overnight. For ghee, clarified butter works well.";
      }
      if (t.includes("ingredient")) return active ? `${active.name} needs: ${active.ingredients.map((i: any) => i.name).join(", ")}.` : "Select a recipe to see its ingredients.";
      if (t.includes("step") || t.includes("next")) return active ? `Current recipe: ${active.name}. ${active.steps[0].text}` : "Select a recipe from the list to get started.";
      return `You have ${recipes.length} recipes. ${active ? `Currently active: ${active.name}.` : "Tap a recipe card to activate it."} Say the recipe name for details.`;
    }
    case "menu": {
      const items = load<typeof import("@/lib/data").MENU_ITEMS>("rasoi_menu", []);
      const byMargin = [...items].sort((a: any, b: any) => b.margin - a.margin);
      const bySales = [...items].sort((a: any, b: any) => b.sales - a.sales);
      if (t.includes("margin") || t.includes("profit")) return `Top margin: ${byMargin.slice(0, 3).map((i: any) => `${i.name} at ${i.margin}%`).join(", ")}.`;
      if (t.includes("popular") || t.includes("selling")) return `Best sellers: ${bySales.slice(0, 3).map((i: any) => `${i.name} — ${i.sales} orders`).join(", ")}.`;
      const revenue = items.reduce((s: number, i: any) => s + i.price * i.sales, 0);
      return `${items.length} dishes on menu. Estimated revenue: ₹${revenue.toLocaleString("en-IN")}. Top earner: ${byMargin[0]?.name}.`;
    }
    case "staff": {
      const staff = load<typeof import("@/lib/data").STAFF>("rasoi_staff", []);
      const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
      const today = staff.filter((s: any) => s.shifts.includes(day));
      if (t.includes("today") || t.includes("who") || t.includes("working")) return today.length > 0 ? `${today.length} on duty today: ${today.map((s: any) => `${s.name} on ${s.station}`).join(", ")}.` : "No staff scheduled today.";
      return `${staff.length} team members. ${today.length} working today (${day}).`;
    }
    case "suppliers": {
      const suppliers = load<typeof import("@/lib/data").SUPPLIERS>("rasoi_suppliers", []);
      const pending = suppliers.filter((s: any) => s.status === "order-placed");
      if (t.includes("deliver")) return `Daily deliveries from: ${suppliers.filter((s: any) => s.delivery === "Daily").map((s: any) => s.name).join(", ")}. ${pending.length} orders in transit.`;
      const top = [...suppliers].sort((a: any, b: any) => b.rating - a.rating)[0];
      return `${suppliers.length} suppliers. ${pending.length} pending orders. Highest rated: ${top?.name} at ${top?.rating}★.`;
    }
    case "dashboard": {
      const stock = load<typeof import("@/lib/data").STOCK>("rasoi_stock", []);
      const menu = load<typeof import("@/lib/data").MENU_ITEMS>("rasoi_menu", []);
      const staff = load<typeof import("@/lib/data").STAFF>("rasoi_staff", []);
      const low = stock.filter((s: any) => s.stock <= s.reorder).length;
      const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
      const onDuty = staff.filter((s: any) => s.shifts.includes(day)).length;
      const top = [...menu].sort((a: any, b: any) => b.margin - a.margin)[0];
      return `Kitchen status: ${onDuty} staff on duty, ${low} stock alert${low !== 1 ? "s" : ""}. Best margin tonight: ${top?.name} at ${top?.margin}%.`;
    }
    case "techniques": {
      if (t.includes("julienne")) return "Julienne: square off sides for stability, cut 2mm planks, stack and slice into 2mm matchsticks. Curl your knuckles as a blade guide.";
      if (t.includes("dum")) return "Dum cooking: seal your pot with atta dough, lowest flame, 30 to 45 minutes. Never open mid-cook — trapped steam is the whole technique.";
      if (t.includes("tadka") || t.includes("tarka")) return "Tarka: heat ghee until shimmering, add whole spices and let them splutter 20 seconds, pour immediately. The sizzle is the signal.";
      if (t.includes("brunoise")) return "Brunoise is a fine 3mm dice. First julienne at exactly 3mm, then cross-cut. Use a ruler to practice consistency — it makes the difference.";
      break;
    }
    case "timers": {
      if (t.includes("biryani")) return "For biryani dum, set 25 minutes. At 5 minutes remaining, prepare your garnish — the timing is critical for the steam release.";
      if (t.includes("dal")) return "Dal Makhani slow-cook needs at least 30 minutes on lowest flame after the base is ready. The longer the better — up to 2 hours for restaurant quality.";
      return "Use the plus button to add a new timer. You can track multiple dishes simultaneously. I'll highlight any timer under 2 minutes.";
    }
  }

  // Fallback to curated lines
  const lines = VOICE_LINES[screen] || VOICE_LINES["dashboard"];
  return lines[Math.floor(Math.random() * lines.length)].ai;
}

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [state, setState]   = useState<VoiceCtx["state"]>("idle");
  const [text, setText]     = useState("");
  const [history, setHist]  = useState<VoiceEntry[]>([]);
  const [screen, setScreen] = useState("dashboard");
  const [supported, setSupported] = useState(false);
  const recogRef = useRef<any>(null);
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([]);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  const speak = useCallback((response: string, userSaid: string) => {
    const ts = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setHist(prev => [{ user: userSaid, ai: response, time: ts }, ...prev.slice(0, 11)]);
    setState("speaking");
    setText(response);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(response);
      utt.lang = "en-IN";
      utt.rate = 0.92;
      utt.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang === "en-IN") || voices.find(v => v.lang.startsWith("en"));
      if (preferred) utt.voice = preferred;
      synthRef.current = utt;
      utt.onend = () => { setState("idle"); setText(""); };
      utt.onerror = () => {
        const t = setTimeout(() => { setState("idle"); setText(""); }, 8000);
        timers.current.push(t);
      };
      window.speechSynthesis.speak(utt);
      // Chrome bug: synthesis sometimes stalls — nudge it
      const nudge = setTimeout(() => window.speechSynthesis.resume?.(), 100);
      timers.current.push(nudge);
    } else {
      const t = setTimeout(() => { setState("idle"); setText(""); }, 6000);
      timers.current.push(t);
    }
  }, []);

  const simulateFallback = useCallback((currentScreen: string) => {
    const lines = VOICE_LINES[currentScreen] || VOICE_LINES["dashboard"];
    const line  = lines[Math.floor(Math.random() * lines.length)];
    setState("listening");
    setText("");
    const t1 = setTimeout(() => { setState("processing"); setText(line.user); }, 1800);
    const t2 = setTimeout(() => speak(line.ai, line.user), 3300);
    timers.current = [t1, t2];
  }, [speak]);

  const trigger = useCallback(() => {
    if (state !== "idle") { stopAll(); setState("idle"); setText(""); return; }
    timers.current.forEach(clearTimeout);

    const SR = typeof window !== "undefined"
      ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
      : null;

    if (!SR) { simulateFallback(screen); return; }

    setState("listening");
    setText("");

    const recog = new SR();
    recogRef.current = recog;
    recog.lang = "en-IN";
    recog.interimResults = true;
    recog.maxAlternatives = 1;
    recog.continuous = false;

    recog.onresult = (e: any) => {
      const partial = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setText(partial);
      if (e.results[e.results.length - 1].isFinal) {
        recog.stop();
        setState("processing");
        const t = setTimeout(() => {
          const response = smartResponse(partial, screen);
          speak(response, partial);
        }, 500);
        timers.current.push(t);
      }
    };

    recog.onspeechend = () => recog.stop();
    recog.onerror = (e: any) => {
      if (e.error === "no-speech") { setState("idle"); setText(""); return; }
      simulateFallback(screen);
    };
    recog.onend = () => {
      setState(s => s === "listening" ? "idle" : s);
      setText(t => t === "" ? "" : t);
    };

    try { recog.start(); } catch { simulateFallback(screen); }
  }, [state, screen, stopAll, speak, simulateFallback]);

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
    <Ctx.Provider value={{ state, text, history, trigger, screen, setScreen, supported }}>
      {children}
    </Ctx.Provider>
  );
}

export const useVoice = () => useContext(Ctx);
