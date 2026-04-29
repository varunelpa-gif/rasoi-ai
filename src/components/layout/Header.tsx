"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
  const pathname   = usePathname();
  const title      = TITLES[pathname] || "Rasoi AI";
  const [inCall, setInCall]   = useState(false);
  const [ringing, setRinging] = useState(false);

  useEffect(() => {
    const onStart = () => { setInCall(true);  setRinging(false); };
    const onEnd   = () => { setInCall(false); setRinging(false); };
    window.addEventListener("rasoi-call-started", onStart);
    window.addEventListener("rasoi-call-ended",   onEnd);
    return () => {
      window.removeEventListener("rasoi-call-started", onStart);
      window.removeEventListener("rasoi-call-ended",   onEnd);
    };
  }, []);

  function handleMic() {
    if (inCall) {
      window.dispatchEvent(new Event("rasoi-end-call"));
      return;
    }
    setRinging(true);
    window.dispatchEvent(new Event("rasoi-voice-trigger"));
  }

  const isActive = inCall || ringing;

  // colours
  const bgColor     = inCall  ? "oklch(55% 0.18 20)"        : isActive ? "oklch(78% 0.18 80)"        : "oklch(78% 0.18 80 / 0.12)";
  const borderColor = inCall  ? "oklch(55% 0.18 20)"        : isActive ? "oklch(78% 0.18 80)"        : "oklch(78% 0.18 80 / 0.45)";
  const iconColor   = isActive ? "oklch(14% 0.03 55)"       : "oklch(78% 0.18 80)";
  const pulseColor  = inCall  ? "oklch(55% 0.18 20 / 0.5)"  : "oklch(78% 0.18 80 / 0.5)";

  return (
    <>
      <style>{`
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${pulseColor}; }
          50%       { box-shadow: 0 0 0 10px oklch(0% 0 0 / 0); }
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

        {!isMobile && (
          <span style={{ fontSize: 12, color: "oklch(40% 0.03 70)" }}>
            {inCall ? "Tap to end call" : "Hey Rasoi…"}
          </span>
        )}

        <div
          onClick={handleMic}
          title={inCall ? "End call" : "Talk to Rasoi AI"}
          style={{
            width: 44, height: 44, borderRadius: "50%", cursor: "pointer", flexShrink: 0,
            background: bgColor,
            border: `1.5px solid ${borderColor}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s ease",
            animation: isActive ? "mic-pulse 1.2s ease-in-out infinite" : "none",
          }}
        >
          {inCall ? (
            /* Phone hang-up icon when in call */
            <svg width="18" height="18" viewBox="0 0 24 24" fill={iconColor}>
              <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c1.12.45 2.3.77 3.53.93a2 2 0 0 1 1.75 2v3a2 2 0 0 1-2.18 2C9.31 21.49 2.51 14.69 2 5.18A2 2 0 0 1 4 3h3a2 2 0 0 1 2 1.72c.16 1.23.47 2.42.93 3.54a2 2 0 0 1-.45 2.11z" transform="rotate(135 12 12)"/>
            </svg>
          ) : (
            /* Mic icon when idle */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={iconColor}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="3" width="6" height="11" rx="3"/>
              <path d="M5 10a7 7 0 0 0 14 0"/>
              <line x1="12" y1="20" x2="12" y2="23"/>
              <line x1="8"  y1="23" x2="16" y2="23"/>
            </svg>
          )}
        </div>
      </div>
    </>
  );
}
