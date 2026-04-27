"use client";
import { useState } from "react";
import { useVoice } from "@/context/VoiceContext";
import { Card, Badge, Btn } from "@/components/ui/primitives";
import { STOCK } from "@/lib/data";

const levelOf = (item: typeof STOCK[0]) => {
  const p = (item.stock / item.max) * 100;
  if (p <= 20) return { label: "Critical", color: "ruby" };
  if (p <= 45) return { label: "Low",      color: "terracotta" };
  return           { label: "OK",          color: "mint" };
};

export default function InventoryPage() {
  const { trigger } = useVoice();
  const [cat, setCat] = useState("All");
  const cats = ["All","Grains","Spices","Dairy","Pulses","Fresh Produce","Protein"];
  const list = cat === "All" ? STOCK : STOCK.filter(i => i.cat === cat);
  const lowCount = STOCK.filter(i => (i.stock / i.max) * 100 <= 45).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "1px solid", transition: "all 0.18s", background: cat === c ? "oklch(78% 0.18 80)" : "oklch(24% 0.04 55)", color: cat === c ? "oklch(14% 0.03 55)" : "oklch(62% 0.03 70)", borderColor: cat === c ? "oklch(78% 0.18 80)" : "oklch(32% 0.04 55)", fontWeight: cat === c ? 600 : 400 }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {lowCount > 0 && <Badge color="ruby">{lowCount} low stock</Badge>}
          <Btn onClick={trigger} variant="voice">🎙️ Ask about stock</Btn>
          <Btn variant="primary">+ Add Item</Btn>
        </div>
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 90px 80px 1.5fr", padding: "11px 22px", borderBottom: "1px solid oklch(27% 0.04 55)", fontSize: 11, color: "oklch(48% 0.03 70)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          <span>Item</span><span>Category</span><span>In Stock</span><span>Level</span><span>Status</span><span>Supplier</span>
        </div>
        {list.map((item, i) => {
          const lv = levelOf(item);
          const pct = Math.min(100, (item.stock / item.max) * 100);
          const barCol = lv.label === "Critical" ? "oklch(65% 0.18 20)" : lv.label === "Low" ? "oklch(62% 0.16 40)" : "oklch(72% 0.14 155)";
          return (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 90px 80px 1.5fr", padding: "13px 22px", borderBottom: i < list.length - 1 ? "1px solid oklch(25% 0.04 55)" : "none", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)" }}>{item.hindi}</div>
              </div>
              <div style={{ fontSize: 12, color: "oklch(58% 0.03 70)" }}>{item.cat}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{item.stock} <span style={{ fontSize: 11, color: "oklch(50% 0.03 70)", fontWeight: 400 }}>{item.unit}</span></div>
              <div style={{ paddingRight: 12 }}>
                <div style={{ height: 5, background: "oklch(27% 0.04 55)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: barCol, borderRadius: 3 }} />
                </div>
              </div>
              <Badge color={lv.color}>{lv.label}</Badge>
              <div style={{ fontSize: 11, color: "oklch(52% 0.03 70)" }}>{item.supplier}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
