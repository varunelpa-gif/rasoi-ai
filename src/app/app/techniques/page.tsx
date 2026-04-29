"use client";
import { useState } from "react";
import { Card, Badge, Btn } from "@/components/ui/primitives";
import TechSVG from "@/components/illustrations/TechSVG";
import { TECHS, Technique } from "@/lib/data";

const DIFF_COLOR: Record<string, string> = { Easy: "mint", Medium: "saffron", Hard: "terracotta" };

function TechDetail({ t, onBack }: { t: Technique; onBack: () => void }) {
  return (
    <div>
      <Btn onClick={onBack} variant="ghost" style={{ marginBottom: 22, padding: "7px 14px" }}>← Back</Btn>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 26, marginBottom: 4 }}>{t.name}</div>
            <div style={{ fontSize: 13, color: "oklch(52% 0.03 70)" }}>{t.hindi} · {t.cat}</div>
          </div>
          <Badge color={DIFF_COLOR[t.diff]}>{t.diff}</Badge>
        </div>
        <div style={{ borderRadius: 10, marginBottom: 18, overflow: "hidden" }}>
          <TechSVG name={t.name} height={170} />
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: "oklch(68% 0.02 70)", marginBottom: 22 }}>{t.desc}</p>
        <div style={{ fontFamily: "var(--ff-head)", fontSize: 16, marginBottom: 12 }}>Steps / विधि</div>
        {t.steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "11px 0", borderBottom: i < t.steps.length - 1 ? "1px solid oklch(27% 0.04 55)" : "none" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: "oklch(78% 0.18 80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "oklch(14% 0.03 55)" }}>{i + 1}</div>
            <div style={{ fontSize: 13, lineHeight: 1.65 }}>{s}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default function TechniquesPage() {
  const [cat, setCat] = useState("All");
  const [sel, setSel] = useState<Technique | null>(null);
  const cats = ["All", "Knife Skills", "Cooking Methods", "Plating"];
  const list = cat === "All" ? TECHS : TECHS.filter(t => t.cat === cat);

  if (sel) return <TechDetail t={sel} onBack={() => setSel(null)} />;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ padding: "7px 18px", borderRadius: 20, fontSize: 13, cursor: "pointer", border: "1px solid", transition: "all 0.18s", background: cat === c ? "oklch(78% 0.18 80)" : "oklch(24% 0.04 55)", color: cat === c ? "oklch(14% 0.03 55)" : "oklch(62% 0.03 70)", borderColor: cat === c ? "oklch(78% 0.18 80)" : "oklch(32% 0.04 55)", fontWeight: cat === c ? 600 : 400 }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {list.map(t => (
          <Card key={t.id} onClick={() => setSel(t)} style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 12, right: 12 }}><Badge color={DIFF_COLOR[t.diff]}>{t.diff}</Badge></div>
            <div style={{ borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
              <TechSVG name={t.name} height={80} />
            </div>
            <div style={{ fontSize: 10, color: "oklch(78% 0.18 80)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{t.cat}</div>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 16, marginBottom: 2 }}>{t.name}</div>
            <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)", marginBottom: 8 }}>{t.hindi}</div>
            <div style={{ fontSize: 12, color: "oklch(60% 0.02 70)", lineHeight: 1.55 }}>{t.desc.slice(0, 70)}…</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
