"use client";
import { useVoice } from "@/context/VoiceContext";
import { Card, Badge, StatCard } from "@/components/ui/primitives";
import Icon from "@/components/ui/Icon";

const specials = [
  { name: "Dal Makhani",         hindi: "दाल मखनी",      cat: "Main Course",  margin: "75%", allergens: ["dairy"],    status: "prepping" },
  { name: "Palak Paneer",        hindi: "पालक पनीर",     cat: "Vegetarian",   margin: "69%", allergens: ["dairy"],    status: "ready"    },
  { name: "Malabar Prawn Curry", hindi: "मालाबार झींगा", cat: "Seafood",      margin: "65%", allergens: ["shellfish"],status: "prepping" },
  { name: "Rogan Josh",          hindi: "रोगन जोश",      cat: "Main Course",  margin: "71%", allergens: [],           status: "ready"    },
];

const alerts = [
  { type: "ruby",       icon: "alert",    text: "Kashmiri chilli critically low — 200g remaining" },
  { type: "terracotta", icon: "timer",    text: "Dal Makhani dum: 8 min remaining" },
  { type: "saffron",    icon: "supplier", text: "Sharma Spice Co. delivery scheduled for Tuesday" },
];

const BADGE_TEXT: Record<string, string> = {
  ruby:       "oklch(65% 0.18 20)",
  terracotta: "oklch(68% 0.16 40)",
  saffron:    "oklch(78% 0.18 80)",
};

export default function DashboardPage() {
  const { history, trigger } = useVoice();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        <StatCard label="Active Recipes"  value="3"  sub="in prep tonight"  color="saffron"    />
        <StatCard label="Timers Running"  value="4"  sub="2 need attention" color="terracotta" />
        <StatCard label="Low Stock"        value="3"  sub="items critical"   color="ruby"       />
        <StatCard label="Staff on Shift"  value="12" sub="2 on leave"       color="mint"       />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 18 }}>
        <Card>
          <div style={{ fontFamily: "var(--ff-head)", fontSize: 16, marginBottom: 14 }}>
            Aaj Ka Menu <span style={{ fontSize: 12, color: "oklch(52% 0.03 70)", fontFamily: "var(--ff-body)", fontWeight: 400 }}>— Tonight&apos;s Specials</span>
          </div>
          {specials.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < specials.length - 1 ? "1px solid oklch(27% 0.04 55)" : "none" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{d.name}</div>
                <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)", marginTop: 1 }}>{d.hindi} · {d.cat}</div>
                <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap" }}>
                  {d.allergens.map(a => <Badge key={a} color="ruby">{a}</Badge>)}
                </div>
              </div>
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
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
              Rasoi AI <span style={{ fontFamily: "var(--ff-body)", fontSize: 11, color: "oklch(50% 0.03 70)", fontWeight: 400 }}>— Voice log</span>
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🎙️</div>
                <div style={{ fontSize: 13, color: "oklch(50% 0.03 70)" }}>Say &quot;Hey Rasoi&quot; to begin</div>
                <button onClick={trigger} style={{ marginTop: 12, padding: "7px 18px", background: "oklch(78% 0.18 80 / 0.12)", border: "1px solid oklch(78% 0.18 80 / 0.4)", borderRadius: 20, color: "oklch(78% 0.18 80)", cursor: "pointer", fontSize: 12 }}>
                  Try it now
                </button>
              </div>
            ) : history.slice(0, 3).map((h, i) => (
              <div key={i} style={{ padding: "10px 12px", background: "oklch(23% 0.04 55)", borderRadius: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: "oklch(78% 0.18 80)", marginBottom: 3 }}>You · {h.time}</div>
                <div style={{ fontSize: 12, color: "oklch(70% 0.02 70)", marginBottom: 5 }}>{h.user}</div>
                <div style={{ fontSize: 11, color: "oklch(58% 0.03 70)", lineHeight: 1.5, fontStyle: "italic" }}>🤖 {h.ai}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
