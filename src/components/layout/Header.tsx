"use client";
import { usePathname } from "next/navigation";
import { useVoice } from "@/context/VoiceContext";
import Icon from "@/components/ui/Icon";

const TITLES: Record<string, string> = {
  "/app/dashboard":  "Dashboard",
  "/app/recipe":     "Recipe Studio",
  "/app/techniques": "Technique Library",
  "/app/timers":     "Kitchen Timers",
  "/app/inventory":  "Inventory",
  "/app/menu":       "Menu Planning",
  "/app/staff":      "Staff Schedule",
  "/app/suppliers":  "Suppliers",
};

export default function Header() {
  const pathname  = usePathname();
  const { state, text, trigger } = useVoice();
  const isActive  = state !== "idle";
  const title     = TITLES[pathname] || "Rasoi AI";

  return (
    <div style={{
      height: 62, flexShrink: 0,
      background: "oklch(16% 0.035 55)",
      borderBottom: "1px solid oklch(26% 0.04 55)",
      display: "flex", alignItems: "center",
      padding: "0 24px", gap: 16,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--ff-head)", fontSize: 20, fontWeight: 600, lineHeight: 1 }}>{title}</div>
      </div>

      {isActive && text && (
        <div className="voice-panel">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div className={`voice-dot ${state === "listening" ? "dot-pulse" : ""}`} />
            <span style={{ fontSize: 11, color: "oklch(78% 0.18 80)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
              {state === "listening" ? "Listening…" : state === "processing" ? "Processing…" : "Rasoi AI"}
            </span>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: state === "speaking" ? "oklch(92% 0.02 80)" : "oklch(70% 0.02 70)" }}>
            {text}
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12, color: isActive ? "oklch(78% 0.18 80)" : "oklch(42% 0.03 70)", transition: "color 0.3s" }}>
          {state === "idle" ? "Hey Rasoi…" : state === "listening" ? "Listening…" : state === "processing" ? "Processing…" : "Speaking…"}
        </span>

        <div onClick={trigger} style={{ position: "relative", width: 44, height: 44, cursor: "pointer", flexShrink: 0 }}>
          {isActive && (
            <>
              <div className="orb-ring orb-ring-1" />
              <div className="orb-ring orb-ring-2" />
            </>
          )}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: isActive ? "oklch(78% 0.18 80)" : "oklch(78% 0.18 80 / 0.12)",
            border: `1.5px solid ${isActive ? "oklch(78% 0.18 80)" : "oklch(78% 0.18 80 / 0.45)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.35s ease",
            boxShadow: isActive ? "0 0 20px oklch(78% 0.18 80 / 0.4)" : "none",
          }}>
            <Icon name="mic" size={18} color={isActive ? "oklch(14% 0.03 55)" : "oklch(78% 0.18 80)"} />
          </div>
        </div>
      </div>

      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "oklch(62% 0.16 40)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>
        CK
      </div>
    </div>
  );
}
