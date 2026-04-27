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

export default function Header({ onMenuClick, isMobile }: { onMenuClick?: () => void; isMobile?: boolean }) {
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
      padding: isMobile ? "0 14px" : "0 24px", gap: isMobile ? 10 : 16,
    }}>

      {/* Hamburger — mobile only */}
      {isMobile && (
        <button onClick={onMenuClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", alignItems: "center", color: "oklch(70% 0.03 70)", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect y="3"  width="20" height="2" rx="1"/>
            <rect y="9"  width="20" height="2" rx="1"/>
            <rect y="15" width="20" height="2" rx="1"/>
          </svg>
        </button>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--ff-head)", fontSize: isMobile ? 17 : 20, fontWeight: 600, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
      </div>

      {isActive && text && (
        <div className="voice-panel hide-mobile">
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

      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 10 }}>
        {!isMobile && (
          <span style={{ fontSize: 12, color: isActive ? "oklch(78% 0.18 80)" : "oklch(42% 0.03 70)", transition: "color 0.3s" }}>
            {state === "idle" ? "Hey Rasoi…" : state === "listening" ? "Listening…" : state === "processing" ? "Processing…" : "Speaking…"}
          </span>
        )}

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

      {/* Mobile: show voice text below mic if active */}
      {isMobile && isActive && text && (
        <div style={{ position: "absolute", top: 62, left: 0, right: 0, background: "oklch(19% 0.04 55)", borderBottom: "1px solid oklch(78% 0.18 80 / 0.25)", padding: "10px 16px", zIndex: 30, animation: "fadeIn 0.2s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div className={`voice-dot ${state === "listening" ? "dot-pulse" : ""}`} />
            <span style={{ fontSize: 11, color: "oklch(78% 0.18 80)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
              {state === "listening" ? "Listening…" : state === "processing" ? "Processing…" : "Rasoi AI"}
            </span>
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: state === "speaking" ? "oklch(92% 0.02 80)" : "oklch(70% 0.02 70)" }}>{text}</div>
        </div>
      )}
    </div>
  );
}
