"use client";
import { useState } from "react";
import { useVoice } from "@/context/VoiceContext";
import { Card, Badge, Btn, SectionTitle } from "@/components/ui/primitives";
import DishSVG from "@/components/illustrations/DishSVG";
import { RECIPES, Recipe } from "@/lib/data";

function RecipeDetail({ r, onBack }: { r: Recipe; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const { trigger } = useVoice();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <Btn onClick={onBack} variant="ghost" style={{ padding: "7px 14px" }}>← Back</Btn>
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
            🎙️ Suggest substitutes
          </button>
        </Card>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <SectionTitle sub="Voice-guided steps">Steps / विधि</SectionTitle>
            <Badge color="saffron">Step {step + 1} / {r.steps.length}</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {r.steps.map((s, i) => {
              const isCur = i === step, isDone = i < step;
              return (
                <div key={i} onClick={() => setStep(i)} style={{
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
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Btn onClick={() => setStep(Math.max(0, step - 1))} variant="ghost" style={{ flex: 1 }}>← Prev</Btn>
            <Btn onClick={trigger} variant="voice" style={{ flex: 1 }}>🎙️ Voice guide</Btn>
            <Btn onClick={() => setStep(Math.min(r.steps.length - 1, step + 1))} variant="primary" style={{ flex: 1 }}>Next →</Btn>
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
          <Card key={r.id} onClick={() => setSel(i)} style={{ position: "relative" }}>
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
