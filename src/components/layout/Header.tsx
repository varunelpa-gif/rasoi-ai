"use client";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const title    = TITLES[pathname] || "Rasoi AI";

  return (
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
    </div>
  );
}
