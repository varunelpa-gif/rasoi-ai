"use client";
import { useState } from "react";
import { Card, Badge, Btn } from "@/components/ui/primitives";
import { SUPPLIERS } from "@/lib/data";

const STATUS_LABEL: Record<string, string> = { active: "Active", "order-placed": "Order Placed", inactive: "Inactive" };
const STATUS_COLOR: Record<string, string> = { active: "mint",  "order-placed": "saffron",       inactive: "muted" };

export default function SuppliersPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div style={{ fontSize: 13, color: "oklch(52% 0.03 70)" }}>{SUPPLIERS.length} suppliers</div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="primary">+ Add Supplier</Btn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {SUPPLIERS.map(s => {
          const open = expanded === s.id;
          return (
            <Card key={s.id} onClick={() => setExpanded(open ? null : s.id)} highlight={open}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "var(--ff-head)", fontSize: 16, marginBottom: 3 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "oklch(52% 0.03 70)" }}>{s.cat}</div>
                </div>
                <Badge color={STATUS_COLOR[s.status]}>{STATUS_LABEL[s.status]}</Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: "oklch(52% 0.03 70)" }}>Rating: <span style={{ color: "oklch(78% 0.18 80)", fontWeight: 600 }}>⭐ {s.rating}</span></div>
                <div style={{ fontSize: 12, color: "oklch(52% 0.03 70)" }}>Last: {s.lastOrder}</div>
                <div style={{ fontSize: 12, color: "oklch(52% 0.03 70)" }}>Next: <span style={{ color: "oklch(72% 0.14 155)" }}>{s.delivery}</span></div>
                <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)" }}>{s.contact}</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: open ? 16 : 0 }}>
                {s.items.map(item => <Badge key={item} color="muted">{item}</Badge>)}
              </div>
              {open && (
                <div style={{ paddingTop: 16, borderTop: "1px solid oklch(27% 0.04 55)", display: "flex", gap: 9 }}>
                  <Btn variant="primary" style={{ flex: 1, textAlign: "center" }}>Place Order</Btn>
                  <Btn variant="ghost"   style={{ flex: 1, textAlign: "center" }}>View History</Btn>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
