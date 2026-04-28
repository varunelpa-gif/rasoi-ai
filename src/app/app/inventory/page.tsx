"use client";
import { useState } from "react";
import { useVoice } from "@/context/VoiceContext";
import { Card, Badge, Btn } from "@/components/ui/primitives";
import { useStock, type StockItem } from "@/lib/useLocalData";

const levelOf = (item: StockItem) => {
  const p = (item.stock / item.max) * 100;
  if (p <= 20) return { label: "Critical", color: "ruby" };
  if (p <= 45) return { label: "Low",      color: "terracotta" };
  return           { label: "OK",          color: "mint" };
};

const CATS = ["All","Grains","Spices","Dairy","Pulses","Fresh Produce","Protein"];

const BLANK: Omit<StockItem, "id"> = { name: "", hindi: "", cat: "Grains", stock: 0, unit: "kg", max: 10, reorder: 2, supplier: "" };

function Modal({ item, onSave, onClose }: {
  item: Partial<StockItem>;
  onSave: (data: Omit<StockItem,"id">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<StockItem,"id">>({
    name: item.name ?? "", hindi: item.hindi ?? "", cat: item.cat ?? "Grains",
    stock: item.stock ?? 0, unit: item.unit ?? "kg",
    max: item.max ?? 10, reorder: item.reorder ?? 2, supplier: item.supplier ?? "",
  });
  const set = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));
  const inp = (style?: object) => ({ background: "oklch(22% 0.04 55)", border: "1px solid oklch(32% 0.04 55)", borderRadius: 8, color: "oklch(93% 0.015 80)", fontSize: 13, padding: "8px 12px", width: "100%", ...style });

  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.65)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "oklch(19% 0.04 55)", border: "1px solid oklch(30% 0.04 55)", borderRadius: 16, padding: 24, width: "100%", maxWidth: 480, animation: "fadeUp 0.2s ease" }}>
        <div style={{ fontFamily: "var(--ff-head)", fontSize: 18, marginBottom: 20 }}>
          {item.name ? `Edit — ${item.name}` : "Add Stock Item"}
        </div>
        <div className="grid-2" style={{ marginBottom: 12 }}>
          <div><label style={{ fontSize: 11, color: "oklch(55% 0.03 70)", display: "block", marginBottom: 5 }}>Item Name *</label><input style={inp()} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Basmati Rice"/></div>
          <div><label style={{ fontSize: 11, color: "oklch(55% 0.03 70)", display: "block", marginBottom: 5 }}>Hindi Name</label><input style={inp()} value={form.hindi} onChange={e => set("hindi", e.target.value)} placeholder="बासमती चावल"/></div>
        </div>
        <div className="grid-2" style={{ marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: "oklch(55% 0.03 70)", display: "block", marginBottom: 5 }}>Category</label>
            <select style={{ ...inp(), cursor: "pointer" }} value={form.cat} onChange={e => set("cat", e.target.value)}>
              {CATS.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "oklch(55% 0.03 70)", display: "block", marginBottom: 5 }}>Unit</label>
            <select style={{ ...inp(), cursor: "pointer" }} value={form.unit} onChange={e => set("unit", e.target.value)}>
              {["kg","g","ltr","ml","bunch","pcs","box"].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div><label style={{ fontSize: 11, color: "oklch(55% 0.03 70)", display: "block", marginBottom: 5 }}>In Stock</label><input style={inp()} type="number" min={0} step={0.1} value={form.stock} onChange={e => set("stock", parseFloat(e.target.value) || 0)}/></div>
          <div><label style={{ fontSize: 11, color: "oklch(55% 0.03 70)", display: "block", marginBottom: 5 }}>Max</label><input style={inp()} type="number" min={1} step={0.1} value={form.max} onChange={e => set("max", parseFloat(e.target.value) || 1)}/></div>
          <div><label style={{ fontSize: 11, color: "oklch(55% 0.03 70)", display: "block", marginBottom: 5 }}>Reorder At</label><input style={inp()} type="number" min={0} step={0.1} value={form.reorder} onChange={e => set("reorder", parseFloat(e.target.value) || 0)}/></div>
        </div>
        <div style={{ marginBottom: 20 }}><label style={{ fontSize: 11, color: "oklch(55% 0.03 70)", display: "block", marginBottom: 5 }}>Supplier</label><input style={inp()} value={form.supplier} onChange={e => set("supplier", e.target.value)} placeholder="Sharma Traders"/></div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={() => { if (!form.name.trim()) return; onSave(form); onClose(); }}>Save Item</Btn>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const { trigger, ask }         = useVoice();
  const { items, update, add, remove } = useStock();
  const [cat, setCat]            = useState("All");
  const [modal, setModal]        = useState<Partial<StockItem> | null>(null);
  const [editId, setEditId]      = useState<number | null>(null);
  const [confirm, setConfirm]    = useState<number | null>(null);

  const list     = cat === "All" ? items : items.filter(i => i.cat === cat);
  const lowCount = items.filter(i => (i.stock / i.max) * 100 <= 45).length;

  const openAdd  = () => { setEditId(null); setModal(BLANK); };
  const openEdit = (item: StockItem) => { setEditId(item.id); setModal(item); };
  const handleSave = (data: Omit<StockItem,"id">) => {
    if (editId !== null) update(editId, data);
    else add(data);
  };

  return (
    <div>
      {modal && (
        <Modal
          item={modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: "6px 13px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "1px solid", transition: "all 0.18s", background: cat === c ? "oklch(78% 0.18 80)" : "oklch(24% 0.04 55)", color: cat === c ? "oklch(14% 0.03 55)" : "oklch(62% 0.03 70)", borderColor: cat === c ? "oklch(78% 0.18 80)" : "oklch(32% 0.04 55)", fontWeight: cat === c ? 600 : 400 }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {lowCount > 0 && <Badge color="ruby">{lowCount} low stock</Badge>}
          <Btn onClick={() => ask("what items are low or need reordering")} variant="voice">🎙️ Stock status</Btn>
          <Btn onClick={trigger} variant="ghost" style={{ fontSize: 12 }}>🎙️ Ask…</Btn>
          <Btn variant="primary" onClick={openAdd}>+ Add Item</Btn>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hide-mobile" style={{ background: "oklch(19% 0.04 55)", border: "1px solid oklch(27% 0.04 55)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 90px 80px 1.5fr 80px", padding: "11px 20px", borderBottom: "1px solid oklch(27% 0.04 55)", fontSize: 11, color: "oklch(48% 0.03 70)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          <span>Item</span><span>Category</span><span>In Stock</span><span>Level</span><span>Status</span><span>Supplier</span><span/>
        </div>
        {list.map((item, i) => {
          const lv  = levelOf(item);
          const pct = Math.min(100, (item.stock / item.max) * 100);
          const barCol = lv.label === "Critical" ? "oklch(65% 0.18 20)" : lv.label === "Low" ? "oklch(62% 0.16 40)" : "oklch(72% 0.14 155)";
          return (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 90px 80px 1.5fr 80px", padding: "12px 20px", borderBottom: i < list.length - 1 ? "1px solid oklch(25% 0.04 55)" : "none", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)" }}>{item.hindi}</div>
              </div>
              <div style={{ fontSize: 12, color: "oklch(58% 0.03 70)" }}>{item.cat}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.stock} <span style={{ fontSize: 11, color: "oklch(50% 0.03 70)", fontWeight: 400 }}>{item.unit}</span></div>
                <div style={{ fontSize: 10, color: "oklch(45% 0.03 70)" }}>max {item.max}{item.unit}</div>
              </div>
              <div style={{ paddingRight: 12 }}>
                <div style={{ height: 5, background: "oklch(27% 0.04 55)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: barCol, borderRadius: 3 }} />
                </div>
              </div>
              <Badge color={lv.color}>{lv.label}</Badge>
              <div style={{ fontSize: 11, color: "oklch(52% 0.03 70)" }}>{item.supplier}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => openEdit(item)} style={{ background: "oklch(27% 0.04 55)", border: "none", borderRadius: 6, padding: "5px 10px", color: "oklch(70% 0.03 70)", cursor: "pointer", fontSize: 11 }}>Edit</button>
                {confirm === item.id ? (
                  <button onClick={() => { remove(item.id); setConfirm(null); }} style={{ background: "oklch(65% 0.18 20 / 0.2)", border: "1px solid oklch(65% 0.18 20 / 0.5)", borderRadius: 6, padding: "5px 10px", color: "oklch(65% 0.18 20)", cursor: "pointer", fontSize: 11 }}>Sure?</button>
                ) : (
                  <button onClick={() => setConfirm(item.id)} style={{ background: "none", border: "none", borderRadius: 6, padding: "5px 8px", color: "oklch(48% 0.03 70)", cursor: "pointer", fontSize: 11 }}>✕</button>
                )}
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div style={{ padding: "40px 0", textAlign: "center", color: "oklch(45% 0.03 70)", fontSize: 13 }}>
            No items in this category. <button onClick={openAdd} style={{ color: "oklch(78% 0.18 80)", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>Add one →</button>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div style={{ display: "none" }} className="mobile-inventory">
        {list.map(item => {
          const lv  = levelOf(item);
          const pct = Math.min(100, (item.stock / item.max) * 100);
          const barCol = lv.label === "Critical" ? "oklch(65% 0.18 20)" : lv.label === "Low" ? "oklch(62% 0.16 40)" : "oklch(72% 0.14 155)";
          return (
            <div key={item.id} style={{ background: "oklch(19% 0.04 55)", border: "1px solid oklch(27% 0.04 55)", borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)" }}>{item.hindi} · {item.cat}</div>
                </div>
                <Badge color={lv.color}>{lv.label}</Badge>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{item.stock}</span>
                <span style={{ fontSize: 12, color: "oklch(55% 0.03 70)" }}>{item.unit} / {item.max}{item.unit} max</span>
              </div>
              <div style={{ height: 5, background: "oklch(27% 0.04 55)", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: barCol, borderRadius: 3 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)" }}>{item.supplier}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEdit(item)} style={{ background: "oklch(27% 0.04 55)", border: "none", borderRadius: 6, padding: "5px 12px", color: "oklch(70% 0.03 70)", cursor: "pointer", fontSize: 12 }}>Edit</button>
                  <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", color: "oklch(48% 0.03 70)", cursor: "pointer", fontSize: 14 }}>✕</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
