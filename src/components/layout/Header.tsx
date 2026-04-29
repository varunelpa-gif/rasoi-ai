"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

function triggerVoice() {
  window.dispatchEvent(new Event("rasoi-voice-trigger"));
}

export default function Header({ onMenuClick, isMobile }: { onMenuClick?: () => void; isMobile?: boolean }) {
  const pathname  = usePathname();
  const title     = TITLES[pathname] || "Rasoi AI";
  const [active, setActive] = useState(false);

  function handleMic() {
    setActive(true);
    triggerVoice();
    // Reset visual after a moment (actual state is managed by ElevenLabs)
    setTimeout(() => setActive(false), 3000);
  }

  return (
    <>
      <style>{`
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 oklch(78% 0.18 80 / 0.5); }
          50%       { box-shadow: 0 0 0 10px oklch(78% 0.18 80 / 0); }
        }
      `}</style>

      <div style={{
        height: 62, flexShrink: 0,
        background: "oklch(16% 0.035 55)",
        borderBottom: "1px solid oklch(26% 0.04 55)",
        display: "flex", alignItems: "center",
        padding: isMobile ? "0 14px" : "0 24px", gap: isMobile ? 10 : 16,
      }}>

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

        {/* Mic button — triggers ElevenLabs ConvAI */}
        {!isMobile && (
          <span style={{ fontSize: 12, color: "oklch(40% 0.03 70)" }}>
            Hey Rasoi…
          </span>
        )}
        <div
          onClick={handleMic}
          title="Talk to Rasoi AI"
          style={{
            width: 44, height: 44, borderRadius: "50%", cursor: "pointer", flexShrink: 0,
            background: active ? "oklch(78% 0.18 80)" : "oklch(78% 0.18 80 / 0.12)",
            border: `1.5px solid ${active ? "oklch(78% 0.18 80)" : "oklch(78% 0.18 80 / 0.45)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s ease",
            animation: active ? "mic-pulse 1.2s ease-in-out infinite" : "none",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={active ? "oklch(14% 0.03 55)" : "oklch(78% 0.18 80)"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="3" width="6" height="11" rx="3"/>
            <path d="M5 10a7 7 0 0 0 14 0"/>
            <line x1="12" y1="20" x2="12" y2="23"/>
            <line x1="8"  y1="23" x2="16" y2="23"/>
          </svg>
        </div>
      </div>
    </>
  );
}
