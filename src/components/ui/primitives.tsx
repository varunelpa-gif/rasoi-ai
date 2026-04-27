"use client";
import { useState, CSSProperties, ReactNode } from "react";

const BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  saffron:    { bg: "oklch(78% 0.18 80 / 0.14)",  text: "oklch(78% 0.18 80)",  border: "oklch(78% 0.18 80 / 0.35)"  },
  terracotta: { bg: "oklch(62% 0.16 40 / 0.14)",  text: "oklch(68% 0.16 40)",  border: "oklch(62% 0.16 40 / 0.35)"  },
  mint:       { bg: "oklch(72% 0.14 155 / 0.14)", text: "oklch(72% 0.14 155)", border: "oklch(72% 0.14 155 / 0.35)" },
  ruby:       { bg: "oklch(60% 0.18 20 / 0.14)",  text: "oklch(65% 0.18 20)",  border: "oklch(60% 0.18 20 / 0.35)"  },
  muted:      { bg: "oklch(27% 0.04 55)",          text: "oklch(58% 0.03 70)",  border: "oklch(34% 0.04 55)"          },
};

export function Badge({ children, color = "saffron" }: { children: ReactNode; color?: string }) {
  const c = BADGE_COLORS[color] || BADGE_COLORS.saffron;
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

export function Card({
  children,
  style = {},
  onClick,
  highlight,
}: {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  highlight?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "oklch(19% 0.04 55)",
        border: `1px solid ${highlight ? "oklch(78% 0.18 80 / 0.45)" : hov ? "oklch(78% 0.18 80 / 0.3)" : "oklch(27% 0.04 55)"}`,
        borderRadius: 14, padding: 20,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.18s ease, transform 0.15s ease",
        transform: hov && onClick ? "translateY(-1px)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "ghost",
  style = {},
  disabled = false,
}: {
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "primary" | "ghost" | "voice" | "danger";
  style?: CSSProperties;
  disabled?: boolean;
}) {
  const variants: Record<string, CSSProperties> = {
    primary:    { background: "oklch(78% 0.18 80)", border: "none", color: "oklch(14% 0.03 55)", fontWeight: 700 },
    ghost:      { background: "oklch(24% 0.04 55)", border: "1px solid oklch(32% 0.04 55)", color: "oklch(70% 0.02 70)", fontWeight: 400 },
    voice:      { background: "oklch(78% 0.18 80 / 0.1)", border: "1px solid oklch(78% 0.18 80 / 0.35)", color: "oklch(78% 0.18 80)", fontWeight: 500 },
    danger:     { background: "oklch(60% 0.18 20 / 0.1)", border: "1px solid oklch(60% 0.18 20 / 0.35)", color: "oklch(65% 0.18 20)", fontWeight: 500 },
  };
  const v = variants[variant] || variants.ghost;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...v, borderRadius: 10, padding: "8px 18px", fontSize: 13, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1, transition: "opacity 0.15s", ...style }}
    >
      {children}
    </button>
  );
}

export function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  const colorMap: Record<string, string> = {
    saffron: "oklch(78% 0.18 80)", terracotta: "oklch(62% 0.16 40)",
    mint: "oklch(72% 0.14 155)", ruby: "oklch(65% 0.18 20)",
  };
  return (
    <Card>
      <div style={{ fontSize: 11, color: "oklch(50% 0.03 70)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "var(--ff-head)", fontSize: 34, fontWeight: 700, color: colorMap[color], lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "oklch(50% 0.03 70)", marginTop: 4 }}>{sub}</div>
    </Card>
  );
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: "var(--ff-head)", fontSize: 18, fontWeight: 600 }}>{children}</div>
      {sub && <div style={{ fontSize: 12, color: "oklch(52% 0.03 70)", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}
