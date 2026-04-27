"use client";
import { useState } from "react";
import { useVoice } from "@/context/VoiceContext";
import { Card, Btn } from "@/components/ui/primitives";
import { MENU_ITEMS } from "@/lib/data";

export default function MenuPage() {
  const { trigger } = useVoice();
  const [sortBy, setSortBy] = useState<"margin"|"sales"|"price"|"cost">("margin");
  const sorted = [...MENU_ITEMS].sort((a, b) => b[sortBy] - a[sortBy]);
  const revenue = MENU_ITEMS.reduce((s, d) => s + d.price * d.sales, 0);
  const avgMargin = (MENU_ITEMS.reduce((s, d) => s + d.margin, 0) / MENU_ITEMS.length).toFixed(1);
  const topDish = [...MENU_ITEMS].sort((a, b) => b.margin - a.margin)[0];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 22 }}>
        <Card>
          <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Monthly Revenue</div>
          <div style={{ fontFamily: "var(--ff-head)", fontSize: 30, color: "oklch(72% 0.14 155)", fontWeight: 700 }}>₹{revenue.toLocaleString("en-IN")}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Avg. Margin</div>
          <div style={{ fontFamily: "var(--ff-head)", fontSize: 30, color: "oklch(78% 0.18 80)", fontWeight: 700 }}>{avgMargin}%</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Star Dish</div>
          <div style={{ fontFamily: "var(--ff-head)", fontSize: 18, fontWeight: 700, marginTop: 4 }}>{topDish.name}</div>
          <div style={{ fontSize: 12, color: "oklch(72% 0.14 155)", marginTop: 2 }}>{topDish.margin}% margin</div>
        </Card>
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderBottom: "1px solid oklch(27% 0.04 55)" }}>
          <div style={{ fontFamily: "var(--ff-head)", fontSize: 16 }}>Dish Performance</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "oklch(50% 0.03 70)" }}>Sort:</span>
            {(["margin","sales","price","cost"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "1px solid", background: sortBy === s ? "oklch(78% 0.18 80)" : "oklch(24% 0.04 55)", color: sortBy === s ? "oklch(14% 0.03 55)" : "oklch(62% 0.03 70)", borderColor: sortBy === s ? "oklch(78% 0.18 80)" : "oklch(32% 0.04 55)", fontWeight: sortBy === s ? 600 : 400 }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <Btn onClick={trigger} variant="voice" style={{ padding: "4px 12px", fontSize: 12 }}>🎙️ Ask AI</Btn>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 80px 80px 80px 1.6fr", padding: "10px 22px", borderBottom: "1px solid oklch(27% 0.04 55)", fontSize: 11, color: "oklch(48% 0.03 70)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          <span>Dish</span><span>Category</span><span>Cost</span><span>Price</span><span>Margin</span><span>Sales</span>
        </div>
        {sorted.map((d, i) => (
          <div key={d.name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 80px 80px 80px 1.6fr", padding: "13px 22px", borderBottom: i < sorted.length - 1 ? "1px solid oklch(25% 0.04 55)" : "none", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{d.name}</span>
            <span style={{ fontSize: 12, color: "oklch(58% 0.03 70)" }}>{d.cat}</span>
            <span style={{ fontSize: 13 }}>₹{d.cost}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>₹{d.price}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: d.margin >= 75 ? "oklch(72% 0.14 155)" : d.margin >= 68 ? "oklch(78% 0.18 80)" : "oklch(60% 0.03 70)" }}>{d.margin}%</span>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 22 }}>
              {[0.5,0.7,0.6,0.85,0.9,0.8,d.sales/100].map((h,j) => (
                <div key={j} style={{ width: 7, height: `${Math.max(20, h*100)}%`, background: "oklch(78% 0.18 80 / 0.45)", borderRadius: 2 }} />
              ))}
              <span style={{ fontSize: 11, color: "oklch(50% 0.03 70)", marginLeft: 5, lineHeight: 1 }}>{d.sales} sold</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
