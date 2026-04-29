"use client";
import { Card, Badge, StatCard } from "@/components/ui/primitives";
import Icon from "@/components/ui/Icon";
import { useStock, useMenu, useStaff } from "@/lib/useLocalData";

const specials = [
  { name: "Dal Makhani",         hindi: "दाल मखनी",      cat: "Main Course",  margin: "75%", allergens: ["dairy"],     status: "prepping" },
  { name: "Palak Paneer",        hindi: "पालक पनीर",     cat: "Vegetarian",   margin: "69%", allergens: ["dairy"],     status: "ready"    },
  { name: "Malabar Prawn Curry", hindi: "मालाबार झींगा", cat: "Seafood",      margin: "65%", allergens: ["shellfish"], status: "prepping" },
  { name: "Rogan Josh",          hindi: "रोगन जोश",      cat: "Main Course",  margin: "71%", allergens: [],            status: "ready"    },
];

const BADGE_TEXT: Record<string, string> = {
  ruby: "oklch(65% 0.18 20)", terracotta: "oklch(68% 0.16 40)", saffron: "oklch(78% 0.18 80)",
};

export default function DashboardPage() {
  const { items: stock }   = useStock();
  const { items: menu }    = useMenu();
  const { members: staff } = useStaff();

  const lowCount = stock.filter(i => (i.stock / i.max) * 100 <= 45).length;
  const day      = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
  const onDuty   = staff.filter(s => s.shifts.includes(day)).length;
  const topDish  = [...menu].sort((a, b) => b.margin - a.margin)[0];

  const alerts = [
    ...(lowCount > 0 ? [{ type: "ruby",    icon: "alert",    text: `${lowCount} stock item${lowCount > 1 ? "s" : ""} critically low — check inventory` }] : []),
    { type: "terracotta", icon: "timer",    text: "Dal Makhani dum: 8 min remaining" },
    { type: "saffron",    icon: "supplier", text: "Sharma Spice Co. delivery scheduled for Tuesday" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div className="grid-stats">
        <StatCard label="Total Recipes"   value="10" sub="in rotation"              color="saffron"    />
        <StatCard label="Low Stock"       value={String(lowCount)} sub="items need reorder" color="ruby" />
        <StatCard label="Staff on Shift"  value={String(onDuty)}  sub={`working today (${day})`} color="mint" />
        <StatCard label="Top Margin"      value={topDish ? `${topDish.margin}%` : "–"} sub={topDish?.name || "no data"} color="terracotta" />
      </div>

      <div className="grid-2col">
        <Card>
          <div style={{ fontFamily: "var(--ff-head)", fontSize: 16, marginBottom: 14 }}>
            Aaj Ka Menu <span style={{ fontSize: 12, color: "oklch(52% 0.03 70)", fontFamily: "var(--ff-body)", fontWeight: 400 }}>— Tonight&apos;s Specials</span>
          </div>
          {specials.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < specials.length - 1 ? "1px solid oklch(27% 0.04 55)" : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)", marginTop: 1 }}>{d.hindi} · {d.cat}</div>
                <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap" }}>
                  {d.allergens.map(a => <Badge key={a} color="ruby">{a}</Badge>)}
                </div>
              </div>
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "oklch(72% 0.14 155)" }}>{d.margin}</span>
                <Badge color={d.status === "ready" ? "mint" : "saffron"}>{d.status}</Badge>
              </div>
            </div>
          ))}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ padding: 16 }}>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 15, marginBottom: 12 }}>Alerts</div>
            {alerts.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: i < alerts.length - 1 ? "1px solid oklch(27% 0.04 55)" : "none" }}>
                <div style={{ marginTop: 1, flexShrink: 0 }}>
                  <Icon name={a.icon} size={14} color={BADGE_TEXT[a.type] || "oklch(78% 0.18 80)"} />
                </div>
                <div style={{ fontSize: 12, color: "oklch(68% 0.02 70)", lineHeight: 1.5 }}>{a.text}</div>
              </div>
            ))}
          </Card>

          <Card style={{ padding: 16, flex: 1 }}>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 15, marginBottom: 12 }}>
              Today&apos;s Kitchen <span style={{ fontFamily: "var(--ff-body)", fontSize: 11, color: "oklch(50% 0.03 70)", fontWeight: 400 }}>— quick summary</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Staff on duty", value: `${onDuty} members`, color: "oklch(72% 0.14 155)" },
                { label: "Stock alerts",  value: `${lowCount} items low`, color: lowCount > 0 ? "oklch(65% 0.18 20)" : "oklch(72% 0.14 155)" },
                { label: "Best margin",   value: topDish ? `${topDish.name} · ${topDish.margin}%` : "–", color: "oklch(78% 0.18 80)" },
                { label: "Menu size",     value: `${menu.length} dishes`, color: "oklch(62% 0.16 40)" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 3 ? "1px solid oklch(25% 0.04 55)" : "none" }}>
                  <span style={{ fontSize: 12, color: "oklch(55% 0.03 70)" }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
