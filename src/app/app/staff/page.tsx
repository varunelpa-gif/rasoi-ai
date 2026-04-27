"use client";
import { useState } from "react";
import { useVoice } from "@/context/VoiceContext";
import { Card, Badge, Btn } from "@/components/ui/primitives";
import { useStaff } from "@/lib/useLocalData";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const STATION_COLOR: Record<string, string> = {
  "Grill": "terracotta", "Cold Section": "mint", "Tandoor": "saffron",
  "Pastry": "muted", "Prep": "muted", "Veg Section": "mint",
};

export default function StaffPage() {
  const { trigger } = useVoice();
  const { members: STAFF } = useStaff();
  const [day, setDay] = useState("Mon");
  const today = STAFF.filter(s => s.shifts.includes(day));

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {DAYS.map(d => (
          <button key={d} onClick={() => setDay(d)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, cursor: "pointer", border: "1px solid", transition: "all 0.18s", background: day === d ? "oklch(78% 0.18 80)" : "oklch(24% 0.04 55)", color: day === d ? "oklch(14% 0.03 55)" : "oklch(62% 0.03 70)", borderColor: day === d ? "oklch(78% 0.18 80)" : "oklch(32% 0.04 55)", fontWeight: day === d ? 700 : 400 }}>{d}</button>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 18 }}>{day}&apos;s Kitchen Team</div>
            <Badge color="saffron">{today.length} on shift</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {today.map(s => (
              <Card key={s.name} style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>{s.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "oklch(52% 0.03 70)" }}>{s.role}</div>
                  </div>
                  <Badge color={STATION_COLOR[s.station] || "muted"}>{s.station}</Badge>
                </div>
              </Card>
            ))}
            {today.length === 0 && (
              <Card style={{ padding: 30, textAlign: "center" }}>
                <div style={{ color: "oklch(45% 0.03 70)", fontSize: 13 }}>No staff scheduled for {day}</div>
              </Card>
            )}
          </div>
          <div style={{ marginTop: 14 }}>
            <Btn onClick={trigger} variant="voice" style={{ width: "100%" }}>🎙️ Who&apos;s on each station?</Btn>
          </div>
        </div>

        <Card>
          <div style={{ fontFamily: "var(--ff-head)", fontSize: 16, marginBottom: 18 }}>Weekly Overview</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {STAFF.map(s => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: s.color + "88", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0 }}>{s.avatar}</div>
                <div style={{ width: 80, fontSize: 12, color: "oklch(65% 0.03 70)", flexShrink: 0 }}>{s.name.split(" ")[0]}</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {DAYS.map(d => (
                    <div key={d} style={{ width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, background: s.shifts.includes(d) ? (d === day ? "oklch(78% 0.18 80)" : s.color + "44") : "oklch(24% 0.04 55)", color: s.shifts.includes(d) ? (d === day ? "oklch(14% 0.03 55)" : s.color) : "oklch(35% 0.03 55)", border: `1px solid ${d === day && s.shifts.includes(d) ? "oklch(78% 0.18 80)" : "transparent"}` }}>
                      {d[0]}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
