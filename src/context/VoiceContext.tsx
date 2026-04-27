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
}

const Ctx = createContext<VoiceCtx>({
  state: "idle", text: "", history: [],
  trigger: () => {}, screen: "dashboard", setScreen: () => {},
});

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [state, setState]   = useState<VoiceCtx["state"]>("idle");
  const [text, setText]     = useState("");
  const [history, setHist]  = useState<VoiceEntry[]>([]);
  const [screen, setScreen] = useState("dashboard");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const trigger = useCallback(() => {
    if (state !== "idle") return;
    timers.current.forEach(clearTimeout);

    const lines = VOICE_LINES[screen] || [];
    const line  = lines[Math.floor(Math.random() * lines.length)];
    if (!line) return;

    setState("listening");
    setText("");

    const t1 = setTimeout(() => { setState("processing"); setText(line.user); }, 1800);
    const t2 = setTimeout(() => {
      setState("speaking");
      setText(line.ai);
      setHist(prev => [
        { ...line, time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) },
        ...prev.slice(0, 11),
      ]);
    }, 3300);
    const t3 = setTimeout(() => { setState("idle"); setText(""); }, 8500);
    timers.current = [t1, t2, t3];
  }, [state, screen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.code === "Space" && t.tagName !== "INPUT" && t.tagName !== "TEXTAREA") {
        e.preventDefault();
        trigger();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [trigger]);

  return (
    <Ctx.Provider value={{ state, text, history, trigger, screen, setScreen }}>
      {children}
    </Ctx.Provider>
  );
}

export const useVoice = () => useContext(Ctx);
