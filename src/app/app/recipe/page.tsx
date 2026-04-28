"use client";
import { useState, useEffect } from "react";
import { useVoice } from "@/context/VoiceContext";
import { Card, Badge, Btn, SectionTitle } from "@/components/ui/primitives";
import DishSVG from "@/components/illustrations/DishSVG";
import { RECIPES, Recipe } from "@/lib/data";

// Pulsing dot indicator
function Dot({ color = "oklch(78% 0.18 80)", pulse = false }: { color?: string; pulse?: boolean }) {
  return (
    <div style={{
      width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0,
      animation: pulse ? "dot-pulse 1.2s ease-in-out infinite" : "none",
    }} />
  );
}

function RecipeDetail({ r, onBack }: { r: Recipe; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const { state, autoReading, text, trigger, speakText, startAutoRead, stopAutoRead, setRecipeContext } = useVoice();

  // Sync step with VoiceContext
  useEffect(() => {
    setRecipeContext({ name: r.name, step, stepText: r.steps[step].text, totalSteps: r.steps.length });
    return () => setRecipeContext(null);
  }, [step, r, setRecipeContext]);

  function handleBack() { stopAutoRead(); onBack(); }

  function beginCooking() {
    const items = r.steps.map((s, i) => ({
      text: `Step ${i + 1}. ${s.text}`,
      stepLabel: `Step ${i + 1} of ${r.steps.length}`,
    }));
    startAutoRead(items, step, setStep);
  }

  // Voice state label
  const stateLabel =
    state === "paused"    ? { text: `Paused at step ${step + 1} — say "continue"`,       color: "oklch(72% 0.16 50)",  pulse: false } :
    state === "listening" ? { text: "Listening…",                                         color: "oklch(72% 0.14 155)", pulse: true  } :
    state === "processing"? { text: "Thinking…",                                          color: "oklch(65% 0.14 290)", pulse: true  } :
    state === "speaking"  ? { text: `Reading step ${step + 1} of ${r.steps.length}`,     color: "oklch(78% 0.18 80)",  pulse: true  } :
    null;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Btn onClick={handleBack} variant="ghost" style={{ padding: "7px 14px" }}>← Back</Btn>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--ff-head)", fontSize: 22 }}>{r.name}</div>
          <div style={{ fontSize: 13, color: "oklch(52% 0.03 70)" }}>
            {r.hindi} · {r.time} · Serves {r.serves} · <span style={{ color: "oklch(72% 0.14 155)" }}>Margin {r.margin}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {r.allergens.map(a => <Badge key={a} color="ruby">{a}</Badge>)}
          {r.active && <Badge color="saffron">Active</Badge>}
        </div>
      </div>

      {/* Voice status — no buttons, just state */}
      {(autoReading || state === "paused") && stateLabel && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          background: "oklch(19% 0.04 55)",
          border: `1px solid ${stateLabel.color}44`,
          borderRadius: 12, padding: "12px 16px", marginBottom: 18,
        }}>
          <div style={{ paddingTop: 3 }}>
            <Dot color={stateLabel.color} pulse={stateLabel.pulse} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: stateLabel.color, marginBottom: state === "speaking" && text ? 4 : 0 }}>
              {stateLabel.text}
            </div>
            {state === "speaking" && text && (
              <div style={{ fontSize: 13, color: "oklch(75% 0.02 70)", lineHeight: 1.55 }}>{text}</div>
            )}
            {state === "listening" && (
              <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)", fontStyle: "italic", marginTop: 2 }}>
                Say: pause · stop · repeat · or ask anything
              </div>
            )}
            {state === "paused" && (
              <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)", marginTop: 2 }}>
                Ask a question, or say "continue" to resume · "stop" to end
              </div>
            )}
          </div>
          {/* Subtle tap-to-stop — small, not a button */}
          <div onClick={stopAutoRead} style={{ fontSize: 11, color: "oklch(38% 0.03 70)", cursor: "pointer", padding: "2px 6px", borderRadius: 4, flexShrink: 0, marginTop: 1 }}>
            ✕ stop
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 20 }}>
        {/* Ingredients */}
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
          {!autoReading && state !== "paused" && (
            <button onClick={trigger} style={{ marginTop: 16, width: "100%", padding: "9px", background: "oklch(78% 0.18 80 / 0.1)", border: "1px solid oklch(78% 0.18 80 / 0.35)", borderRadius: 10, color: "oklch(78% 0.18 80)", cursor: "pointer", fontSize: 12 }}>
              🎙️ Ask about substitutes
            </button>
          )}
        </Card>

        {/* Steps */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <SectionTitle sub={autoReading ? "Chef is guiding you" : "Tap step or start voice"}>Steps / विधि</SectionTitle>
            <Badge color="saffron">Step {step + 1} / {r.steps.length}</Badge>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {r.steps.map((s, i) => {
              const isCur = i === step, isDone = i < step;
              return (
                <div key={i}
                  onClick={() => { if (!autoReading) setStep(i); }}
                  style={{
                    display: "flex", gap: 14, padding: "14px 16px", borderRadius: 12,
                    cursor: autoReading ? "default" : "pointer",
                    background: isCur ? "oklch(78% 0.18 80 / 0.08)" : "oklch(19% 0.04 55)",
                    border: `1px solid ${isCur ? "oklch(78% 0.18 80 / 0.4)" : "oklch(27% 0.04 55)"}`,
                    opacity: isDone ? 0.4 : 1, transition: "all 0.25s",
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
                  <div style={{ fontSize: 13, lineHeight: 1.65, color: isCur ? "oklch(92% 0.02 80)" : "oklch(62% 0.02 70)" }}>{s.text}</div>
                </div>
              );
            })}
          </div>

          {/* Controls — only shown when not in voice mode */}
          {!autoReading && state !== "paused" ? (
            <>
              <button onClick={beginCooking} style={{
                width: "100%", padding: "13px", borderRadius: 12, marginBottom: 8,
                background: "oklch(78% 0.18 80)", border: "none",
                color: "oklch(14% 0.03 55)", fontWeight: 700, fontSize: 15, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <span style={{ fontSize: 18 }}>🎙️</span>
                {step === 0 ? "Start guided cooking" : `Resume from step ${step + 1}`}
              </button>

              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={() => setStep(s => Math.max(0, s - 1))} variant="ghost" style={{ flex: 1 }}>← Prev</Btn>
                <button onClick={() => speakText(`Step ${step + 1}. ${r.steps[step].text}`, `Step ${step + 1}`)} style={{ flex: 1, padding: "9px", background: "none", border: "1px solid oklch(30% 0.04 55)", borderRadius: 10, color: "oklch(55% 0.03 70)", cursor: "pointer", fontSize: 12 }}>
                  🔊 Read step
                </button>
                <Btn onClick={() => setStep(s => Math.min(r.steps.length - 1, s + 1))} variant="primary" style={{ flex: 1 }}>Next →</Btn>
              </div>

              <div style={{ marginTop: 12, padding: "10px 14px", background: "oklch(18% 0.04 55)", borderRadius: 10, border: "1px solid oklch(26% 0.04 55)" }}>
                <div style={{ fontSize: 11, color: "oklch(42% 0.03 70)", lineHeight: 1.7, textAlign: "center" }}>
                  While the chef speaks, say · <span style={{ color: "oklch(58% 0.03 70)" }}>"pause"</span> · <span style={{ color: "oklch(58% 0.03 70)" }}>"stop"</span> · <span style={{ color: "oklch(58% 0.03 70)" }}>"repeat"</span> · <span style={{ color: "oklch(58% 0.03 70)" }}>"what's the substitute for cream?"</span>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function RecipePage() {
  const [sel, setSel] = useState<number | null>(null);
  if (sel !== null) return <RecipeDetail r={RECIPES[sel]} onBack={() => setSel(null)} />;

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
