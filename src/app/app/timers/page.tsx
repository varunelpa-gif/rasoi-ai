"use client";
import { useState, useEffect } from "react";
import { useVoice } from "@/context/VoiceContext";
import { Card, Badge, Btn } from "@/components/ui/primitives";

interface Timer {
  id: number;
  name: string;
  total: number;
  rem: number;
  running: boolean;
  color: string;
}

const COL: Record<string, string> = {
  saffron: "oklch(78% 0.18 80)", terracotta: "oklch(62% 0.16 40)",
  mint: "oklch(72% 0.14 155)", ruby: "oklch(65% 0.18 20)", muted: "oklch(50% 0.03 70)",
};

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function TimersPage() {
  const { trigger } = useVoice();
  const [timers, setTimers] = useState<Timer[]>([
    { id: 1, name: "Dal Makhani",      total: 1800, rem: 1240, running: true,  color: "saffron"    },
    { id: 2, name: "Biryani Dum",      total: 1500, rem: 368,  running: true,  color: "terracotta" },
    { id: 3, name: "Bread Dough Rest", total: 3600, rem: 2890, running: true,  color: "mint"       },
    { id: 4, name: "Tadka Tempering",  total: 300,  rem: 300,  running: false, color: "muted"      },
  ]);

  useEffect(() => {
    const t = setInterval(() =>
      setTimers(prev => prev.map(t => t.running && t.rem > 0 ? { ...t, rem: t.rem - 1 } : t)),
    1000);
    return () => clearInterval(t);
  }, []);

  const toggle = (id: number) => setTimers(p => p.map(t => t.id === id ? { ...t, running: !t.running } : t));
  const reset  = (id: number) => setTimers(p => p.map(t => t.id === id ? { ...t, rem: t.total, running: false } : t));
  const addTimer = () => setTimers(p => [...p, { id: Date.now(), name: "New Timer", total: 600, rem: 600, running: false, color: "saffron" }]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22 }}>
        <div style={{ fontSize: 13, color: "oklch(52% 0.03 70)" }}>{timers.filter(t => t.running).length} timers active</div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={trigger} variant="voice">🎙️ Voice timer</Btn>
          <Btn onClick={addTimer} variant="primary">+ Add Timer</Btn>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
        {timers.map(t => {
          const pct    = t.total > 0 ? (t.rem / t.total) * 100 : 0;
          const urgent = pct < 20 && t.rem > 0;
          const done   = t.rem === 0;
          const col    = urgent ? COL.ruby : COL[t.color];
          return (
            <Card key={t.id} style={{ border: `1px solid ${urgent ? "oklch(65% 0.18 20 / 0.45)" : "oklch(27% 0.04 55)"}`, transition: "border-color 0.3s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "var(--ff-head)", fontSize: 16, marginBottom: 5 }}>{t.name}</div>
                  {done && <Badge color="mint">Done!</Badge>}
                  {urgent && !done && <Badge color="ruby">Urgent</Badge>}
                  {t.running && !urgent && !done && <Badge color="saffron">Running</Badge>}
                </div>
                <div style={{ fontFamily: "var(--ff-head)", fontSize: 38, color: col, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {fmt(t.rem)}
                </div>
              </div>
              <div style={{ height: 5, background: "oklch(27% 0.04 55)", borderRadius: 3, marginBottom: 16, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 3, transition: "width 1s linear" }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toggle(t.id)} style={{ flex: 1, padding: "8px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 500, border: "1px solid", background: t.running ? "oklch(24% 0.04 55)" : `${col}22`, color: t.running ? "oklch(62% 0.03 70)" : col, borderColor: t.running ? "oklch(32% 0.04 55)" : `${col}55` }}>
                  {t.running ? "⏸ Pause" : done ? "↺ Reset" : "▶ Start"}
                </button>
                <button onClick={() => reset(t.id)} style={{ padding: "8px 14px", borderRadius: 9, cursor: "pointer", fontSize: 14, background: "oklch(24% 0.04 55)", border: "1px solid oklch(32% 0.04 55)", color: "oklch(55% 0.03 70)" }}>↺</button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
