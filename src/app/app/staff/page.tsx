"use client";
import { useState } from "react";
import { Card, Badge, Btn } from "@/components/ui/primitives";
import { useStaff, type StaffMember } from "@/lib/useLocalData";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const STATIONS = ["Grill","Cold Section","Tandoor","Pastry","Prep","Veg Section","Dessert","Beverages"];
const ROLES = ["Head Chef","Sous Chef","Line Cook","Tandoor Chef","Pastry Chef","Prep Cook","Commis Chef","Dishwasher"];
const COLORS = [
  "oklch(62% 0.16 40)","oklch(72% 0.14 155)","oklch(78% 0.18 80)",
  "oklch(68% 0.15 290)","oklch(65% 0.18 20)","oklch(70% 0.14 200)",
  "oklch(75% 0.16 60)","oklch(60% 0.14 320)",
];
const STATION_COLOR: Record<string, string> = {
  "Grill": "terracotta", "Cold Section": "mint", "Tandoor": "saffron",
  "Pastry": "muted", "Prep": "muted", "Veg Section": "mint",
};

type ModalMode = "add" | "edit" | null;

const EMPTY: Omit<StaffMember, "avatar"> = {
  name: "", role: ROLES[2], station: STATIONS[0],
  shifts: [], color: COLORS[0],
};

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "??";
}

export default function StaffPage() {
  const { members, add, update, remove } = useStaff();
  const [day, setDay] = useState("Mon");
  const today = members.filter(s => s.shifts.includes(day));

  const [modal, setModal] = useState<ModalMode>(null);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState<Omit<StaffMember, "avatar">>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  function openAdd() {
    setForm(EMPTY);
    setEditing(null);
    setModal("add");
  }

  function openEdit(s: StaffMember) {
    setForm({ name: s.name, role: s.role, station: s.station, shifts: [...s.shifts], color: s.color });
    setEditing(s);
    setModal("edit");
  }

  function closeModal() { setModal(null); setEditing(null); }

  function toggleShift(d: string) {
    setForm(f => ({
      ...f,
      shifts: f.shifts.includes(d) ? f.shifts.filter(x => x !== d) : [...f.shifts, d],
    }));
  }

  function handleSave() {
    if (!form.name.trim()) return;
    const member: StaffMember = { ...form, avatar: initials(form.name) };
    if (modal === "add") {
      add(member);
    } else if (modal === "edit" && editing) {
      update(editing.name, member);
    }
    closeModal();
  }

  function handleDelete(name: string) {
    remove(name);
    setDeleteTarget(null);
  }

  return (
    <div>
      {/* Day selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 22, flexWrap: "wrap" }}>
        {DAYS.map(d => (
          <button key={d} onClick={() => setDay(d)} style={{ flex: 1, minWidth: 40, padding: "10px 0", borderRadius: 10, fontSize: 13, cursor: "pointer", border: "1px solid", transition: "all 0.18s", background: day === d ? "oklch(78% 0.18 80)" : "oklch(24% 0.04 55)", color: day === d ? "oklch(14% 0.03 55)" : "oklch(62% 0.03 70)", borderColor: day === d ? "oklch(78% 0.18 80)" : "oklch(32% 0.04 55)", fontWeight: day === d ? 700 : 400 }}>{d}</button>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 18 }}>{day}&apos;s Kitchen Team</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Badge color="saffron">{today.length} on shift</Badge>
              <Btn onClick={openAdd} style={{ padding: "6px 14px", fontSize: 12 }}>+ Add Staff</Btn>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {today.map(s => (
              <Card key={s.name} style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>{s.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "oklch(52% 0.03 70)" }}>{s.role}</div>
                  </div>
                  <Badge color={STATION_COLOR[s.station] || "muted"}>{s.station}</Badge>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => openEdit(s)} style={{ background: "oklch(78% 0.18 80 / 0.1)", border: "1px solid oklch(78% 0.18 80 / 0.3)", color: "oklch(78% 0.18 80)", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => setDeleteTarget(s.name)} style={{ background: "oklch(65% 0.18 20 / 0.1)", border: "1px solid oklch(65% 0.18 20 / 0.3)", color: "oklch(65% 0.18 20)", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              </Card>
            ))}
            {today.length === 0 && (
              <Card style={{ padding: 30, textAlign: "center" }}>
                <div style={{ color: "oklch(45% 0.03 70)", fontSize: 13, marginBottom: 12 }}>No staff scheduled for {day}</div>
                <Btn onClick={openAdd} style={{ fontSize: 12 }}>+ Add Staff Member</Btn>
              </Card>
            )}
          </div>
        </div>

        {/* Weekly overview */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 16 }}>Weekly Overview</div>
            <Btn onClick={openAdd} style={{ padding: "5px 12px", fontSize: 12 }}>+ Add</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {members.map(s => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: s.color + "88", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0 }}>{s.avatar}</div>
                <div style={{ width: 72, fontSize: 12, color: "oklch(65% 0.03 70)", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name.split(" ")[0]}</div>
                <div style={{ display: "flex", gap: 3, flex: 1 }}>
                  {DAYS.map(d => (
                    <div key={d} style={{ flex: 1, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, background: s.shifts.includes(d) ? (d === day ? "oklch(78% 0.18 80)" : s.color + "44") : "oklch(24% 0.04 55)", color: s.shifts.includes(d) ? (d === day ? "oklch(14% 0.03 55)" : s.color) : "oklch(35% 0.03 55)", border: `1px solid ${d === day && s.shifts.includes(d) ? "oklch(78% 0.18 80)" : "transparent"}` }}>
                      {d[0]}
                    </div>
                  ))}
                </div>
                <button onClick={() => openEdit(s)} style={{ background: "none", border: "none", color: "oklch(45% 0.03 70)", cursor: "pointer", fontSize: 14, padding: "0 2px", flexShrink: 0 }}>✎</button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div onClick={closeModal} style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "oklch(20% 0.04 55)", borderRadius: 16, border: "1px solid oklch(32% 0.04 55)", padding: 24, width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--ff-head)", fontSize: 18 }}>{modal === "add" ? "Add Staff Member" : "Edit Staff Member"}</div>
              <button onClick={closeModal} style={{ background: "none", border: "none", color: "oklch(50% 0.03 70)", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <label style={{ fontSize: 12, color: "oklch(55% 0.03 70)", display: "flex", flexDirection: "column", gap: 6 }}>
                Name
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Ramesh Kumar" style={{ background: "oklch(26% 0.04 55)", border: "1px solid oklch(36% 0.04 55)", borderRadius: 8, padding: "9px 12px", color: "white", fontSize: 14 }} />
              </label>

              <label style={{ fontSize: 12, color: "oklch(55% 0.03 70)", display: "flex", flexDirection: "column", gap: 6 }}>
                Role
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ background: "oklch(26% 0.04 55)", border: "1px solid oklch(36% 0.04 55)", borderRadius: 8, padding: "9px 12px", color: "white", fontSize: 14 }}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </label>

              <label style={{ fontSize: 12, color: "oklch(55% 0.03 70)", display: "flex", flexDirection: "column", gap: 6 }}>
                Station
                <select value={form.station} onChange={e => setForm(f => ({ ...f, station: e.target.value }))} style={{ background: "oklch(26% 0.04 55)", border: "1px solid oklch(36% 0.04 55)", borderRadius: 8, padding: "9px 12px", color: "white", fontSize: 14 }}>
                  {STATIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </label>

              <div>
                <div style={{ fontSize: 12, color: "oklch(55% 0.03 70)", marginBottom: 8 }}>Work Days</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {DAYS.map(d => (
                    <button key={d} type="button" onClick={() => toggleShift(d)} style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", border: "1px solid", background: form.shifts.includes(d) ? "oklch(78% 0.18 80)" : "oklch(26% 0.04 55)", color: form.shifts.includes(d) ? "oklch(14% 0.03 55)" : "oklch(55% 0.03 70)", borderColor: form.shifts.includes(d) ? "oklch(78% 0.18 80)" : "oklch(36% 0.04 55)", fontWeight: form.shifts.includes(d) ? 700 : 400 }}>{d}</button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, color: "oklch(55% 0.03 70)", marginBottom: 8 }}>Avatar Color</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: form.color === c ? "2px solid white" : "2px solid transparent", cursor: "pointer", outline: form.color === c ? "2px solid oklch(78% 0.18 80)" : "none", outlineOffset: 2 }} />
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <Btn onClick={closeModal} variant="ghost" style={{ flex: 1 }}>Cancel</Btn>
                <Btn onClick={handleSave} style={{ flex: 2 }}>{modal === "add" ? "Add Member" : "Save Changes"}</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div onClick={() => setDeleteTarget(null)} style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "oklch(20% 0.04 55)", borderRadius: 16, border: "1px solid oklch(32% 0.04 55)", padding: 28, maxWidth: 360, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Remove {deleteTarget}?</div>
            <div style={{ fontSize: 13, color: "oklch(50% 0.03 70)", marginBottom: 22 }}>This will remove them from all schedules.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setDeleteTarget(null)} variant="ghost" style={{ flex: 1 }}>Cancel</Btn>
              <button onClick={() => handleDelete(deleteTarget)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: "oklch(55% 0.18 20)", border: "none", color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
