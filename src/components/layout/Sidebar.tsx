"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

const NAV = [
  { id: "dashboard",  label: "Dashboard",     hindi: "मुख्य पृष्ठ",      icon: "dashboard", href: "/app/dashboard"  },
  { id: "recipe",     label: "Recipe Studio", hindi: "रेसिपी स्टूडियो",  icon: "recipe",    href: "/app/recipe"     },
  { id: "techniques", label: "Techniques",    hindi: "तकनीक पुस्तकालय",  icon: "knife",     href: "/app/techniques" },
  { id: "timers",     label: "Timers",        hindi: "रसोई टाइमर",       icon: "timer",     href: "/app/timers"     },
  { id: "inventory",  label: "Inventory",     hindi: "भंडार",             icon: "inventory", href: "/app/inventory"  },
  { id: "menu",       label: "Menu Planning", hindi: "मेनू नियोजन",      icon: "menu",      href: "/app/menu"       },
  { id: "staff",      label: "Staff",         hindi: "कर्मचारी",          icon: "staff",     href: "/app/staff"      },
  { id: "suppliers",  label: "Suppliers",     hindi: "आपूर्तिकर्ता",      icon: "supplier",  href: "/app/suppliers"  },
];

export default function Sidebar({ showHindi = true }: { showHindi?: boolean }) {
  const pathname = usePathname();

  return (
    <div style={{
      width: 230, height: "100vh", flexShrink: 0,
      background: "oklch(16% 0.035 55)",
      borderRight: "1px solid oklch(26% 0.04 55)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid oklch(26% 0.04 55)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "oklch(78% 0.18 80)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18 }}>🍲</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 22, fontWeight: 700, color: "oklch(78% 0.18 80)", lineHeight: 1 }}>Rasoi</div>
            <div style={{ fontSize: 10, color: "oklch(50% 0.03 70)", letterSpacing: "0.12em", marginTop: 2 }}>AI KITCHEN</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {NAV.map(n => {
          const on = pathname === n.href || pathname.startsWith(n.href + "/");
          return (
            <Link key={n.id} href={n.href} style={{ textDecoration: "none", display: "block" }}>
              <div className="nav-item" style={{
                display: "flex", alignItems: "center", gap: 11,
                padding: "10px 12px", borderRadius: 10, marginBottom: 2,
                background: on ? "oklch(78% 0.18 80 / 0.13)" : "transparent",
                border: `1px solid ${on ? "oklch(78% 0.18 80 / 0.35)" : "transparent"}`,
                color: on ? "oklch(78% 0.18 80)" : "oklch(60% 0.03 70)",
                transition: "all 0.18s ease",
              }}>
                <Icon name={n.icon} size={16} color="currentColor" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: on ? 600 : 400, lineHeight: 1.2 }}>{n.label}</div>
                  {showHindi && <div style={{ fontSize: 10, opacity: 0.55, marginTop: 1 }}>{n.hindi}</div>}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "12px 20px 20px", borderTop: "1px solid oklch(26% 0.04 55)" }}>
        <div style={{ fontSize: 11, color: "oklch(40% 0.03 70)", textAlign: "center", lineHeight: 1.5 }}>
          Say <span style={{ color: "oklch(78% 0.18 80)" }}>"Hey Rasoi"</span> anytime
        </div>
        <Link href="/signin" style={{ display: "block", marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, color: "oklch(45% 0.03 70)", fontSize: 12, cursor: "pointer" }}>
            <Icon name="logout" size={14} color="currentColor" />
            Sign out
          </div>
        </Link>
      </div>
    </div>
  );
}
