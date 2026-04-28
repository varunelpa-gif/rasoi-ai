"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useVoice } from "@/context/VoiceContext";
import { Card, Badge, Btn, SectionTitle } from "@/components/ui/primitives";
import DishSVG from "@/components/illustrations/DishSVG";
import { RECIPES, Recipe } from "@/lib/data";

function RecipeDetail({ r, onBack }: { r: Recipe; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const { state, trigger, speakText, speakQueue, setRecipeContext } = useVoice();
  const stopQueueRef = useRef<(() => void) | null>(null);
  const isPlaying = state === "speaking" && stopQueueRef.current !== null;

  // Keep VoiceContext in sync with current step
  useEffect(() => {
    setRecipeContext({
      name: r.name,
      step,
      stepText: r.steps[step].text,
      totalSteps: r.steps.length,
    });
    return () => setRecipeContext(null);
  }, [step, r, setRecipeContext]);

  // Clean up queue on unmount
  useEffect(() => {
    return () => { stopQueueRef.current?.(); stopQueueRef.current = null; };
  }, []);

  function readStep(idx: number) {
    stopQueueRef.current?.();
    stopQueueRef.current = null;
    speakText(`Step ${idx + 1}. ${r.steps[idx].text}`, `Step ${idx + 1}`);
  }

  const readAllFromStep = useCallback((startStep: number) => {
    const items = r.steps.slice(startStep).map((s, i) => ({
      text: `Step ${startStep + i + 1}. ${s.text}`,
      label: `Step ${startStep + i + 1}`,
    }));
    const stop = speakQueue(items, (queueIndex) => {
      setStep(startStep + queueIndex);
    });
    stopQueueRef.current = stop;
  }, [r, speakQueue]);

  function stopPlayback() {
    stopQueueRef.current?.();
    stopQueueRef.current = null;
  }

  function goNext() {
    stopPlayback();
    setStep(s => Math.min(r.steps.length - 1, s + 1));
  }
  function goPrev() {
    stopPlayback();
    setStep(s => Math.max(0, s - 1));
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <Btn onClick={() => { stopPlayback(); onBack(); }} variant="ghost" style={{ padding: "7px 14px" }}>← Back</Btn>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--ff-head)", fontSize: 22 }}>{r.name}</div>
          <div style={{ fontSize: 13, color: "oklch(52% 0.03 70)" }}>{r.hindi} · {r.time} · Serves {r.serves} · <span style={{ color: "oklch(72% 0.14 155)" }}>Margin {r.margin}</span></div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {r.allergens.map(a => <Badge key={a} color="ruby">{a}</Badge>)}
          {r.active && <Badge color="saffron">Active</Badge>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 20 }}>
        <Card>
          <SectionTitle sub={`${r.serves} servings`}>
            Ingredients <span style={{ fontFamily: "var(--ff-body)", fontWeight: 400, fontSize: 13, color: "oklch(52% 0.03 70)" }}>/ सामग्री</span>
          </SectionTitle>
          {r.ingredients.map((ing, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < r.ingredients.length - 1 ? "1px solid oklch(27% 0.04 55)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 14 }}>{ing.name}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "oklch(78% 0.18 80)" }}>{ing.qty}</span>
              </div>
              {ing.sub && <div style={{ fontSize: 11, color: "oklch(52% 0.03 70)", marginTop: 2 }}>Sub: {ing.sub}</div>}
            </div>
          ))}
          <button onClick={trigger} style={{ marginTop: 16, width: "100%", padding: "9px", background: "oklch(78% 0.18 80 / 0.1)", border: "1px solid oklch(78% 0.18 80 / 0.35)", borderRadius: 10, color: "oklch(78% 0.18 80)", cursor: "pointer", fontSize: 12 }}>
            🎙️ Ask about substitutes
          </button>
        </Card>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <SectionTitle sub="Tap any step or use buttons below">Steps / विधि</SectionTitle>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {isPlaying && (
                <span style={{ fontSize: 11, color: "oklch(78% 0.18 80)", animation: "dot-pulse 1s infinite" }}>● Auto-reading</span>
              )}
              <Badge color="saffron">Step {step + 1} / {r.steps.length}</Badge>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {r.steps.map((s, i) => {
              const isCur = i === step, isDone = i < step;
              return (
                <div key={i} onClick={() => { stopPlayback(); setStep(i); }} style={{
                  display: "flex", gap: 14, padding: "14px 16px",
                  borderRadius: 12, cursor: "pointer",
                  background: isCur ? "oklch(78% 0.18 80 / 0.08)" : "oklch(19% 0.04 55)",
                  border: `1px solid ${isCur ? "oklch(78% 0.18 80 / 0.4)" : "oklch(27% 0.04 55)"}`,
                  opacity: isDone ? 0.45 : 1, transition: "all 0.2s",
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isCur ? "oklch(78% 0.18 80)" : isDone ? "oklch(72% 0.14 155 / 0.3)" : "oklch(27% 0.04 55)",
                    color: isCur ? "oklch(14% 0.03 55)" : isDone ? "oklch(72% 0.14 155)" : "oklch(52% 0.03 70)",
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {isDone ? "✓" : s.n}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.65, color: isCur ? "oklch(92% 0.02 80)" : "oklch(65% 0.02 70)" }}>{s.text}</div>
                </div>
              );
            })}
          </div>

          {/* Main controls */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Btn onClick={goPrev} variant="ghost" style={{ flex: 1 }}>← Prev</Btn>
            {isPlaying ? (
              <Btn onClick={stopPlayback} style={{ flex: 1, background: "oklch(55% 0.18 20)", border: "none" }}>⏹ Stop</Btn>
            ) : (
              <Btn onClick={() => readAllFromStep(step)} variant="voice" style={{ flex: 1 }}>▶ Read all steps</Btn>
            )}
            <Btn onClick={goNext} variant="primary" style={{ flex: 1 }}>Next →</Btn>
          </div>

          {/* Secondary controls */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Btn onClick={() => readStep(step)} variant="ghost" style={{ flex: 1, fontSize: 12 }}>🎙️ Read this step</Btn>
            <Btn onClick={trigger} variant="ghost" style={{ flex: 1, fontSize: 12 }}>🎙️ Ask Rasoi…</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecipePage() {
  const [sel, setSel] = useState<number | null>(null);

  if (sel !== null) {
    return <RecipeDetail r={RECIPES[sel]} onBack={() => setSel(null)} />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div style={{ fontSize: 13, color: "oklch(52% 0.03 70)" }}>{RECIPES.length} recipes in your kitchen</div>
        <Btn variant="primary">+ New Recipe</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {RECIPES.map((r, i) => (
          <Card key={r.id} onClick={() => setSel(i)} style={{ position: "relative", cursor: "pointer" }}>
            {r.active && <div style={{ position: "absolute", top: 12, right: 12 }}><Badge color="saffron">Active</Badge></div>}
            <div style={{ marginBottom: 14, borderRadius: 8, overflow: "hidden" }}>
              <DishSVG name={r.name} height={100} />
            </div>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 17, marginBottom: 2 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: "oklch(52% 0.03 70)", marginBottom: 10 }}>{r.hindi} · {r.cat} · {r.time}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {r.allergens.map(a => <Badge key={a} color="ruby">{a}</Badge>)}
              </div>
              <span style={{ fontSize: 14, color: "oklch(72% 0.14 155)", fontWeight: 700 }}>{r.margin}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
