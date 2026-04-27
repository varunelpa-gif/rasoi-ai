"use client";

export default function DishSVG({ name, height = 100 }: { name: string; height?: number }) {
  const style = { width: "100%", height, display: "block" as const, borderRadius: 8 };

  if (name === "Dal Makhani") return (
    <svg viewBox="0 0 220 120" style={style}>
      <rect width="220" height="120" fill="oklch(16% 0.04 30)" rx="8"/>
      <ellipse cx="110" cy="105" rx="90" ry="12" fill="oklch(20% 0.04 40)"/>
      <ellipse cx="110" cy="108" rx="60" ry="7" fill="oklch(10% 0.03 30 / 0.6)"/>
      <path d="M50 70 Q50 110 110 110 Q170 110 170 70 Z" fill="oklch(22% 0.05 45)"/>
      <ellipse cx="110" cy="70" rx="60" ry="10" fill="oklch(28% 0.05 45)"/>
      <ellipse cx="110" cy="70" rx="56" ry="9" fill="oklch(32% 0.1 25)"/>
      <ellipse cx="110" cy="70" rx="56" ry="9" fill="oklch(38% 0.12 28)"/>
      <path d="M110 66 Q120 63 125 68 Q130 73 120 75 Q110 77 100 73 Q92 69 100 65 Q106 62 110 66Z" fill="oklch(92% 0.02 80 / 0.85)"/>
      <circle cx="95"  cy="72" r="2.5" fill="oklch(65% 0.2 145)"/>
      <circle cx="100" cy="75" r="1.8" fill="oklch(65% 0.2 145)"/>
      <circle cx="126" cy="69" r="2"   fill="oklch(65% 0.2 145)"/>
      <ellipse cx="90" cy="67" rx="6" ry="3" fill="oklch(85% 0.16 85 / 0.8)" transform="rotate(-15,90,67)"/>
      <path d="M85 58 Q87 52 85 46" stroke="oklch(85% 0.01 80 / 0.3)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M110 55 Q112 48 110 41" stroke="oklch(85% 0.01 80 / 0.25)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M135 57 Q133 50 135 44" stroke="oklch(85% 0.01 80 / 0.2)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <text x="110" y="18" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fill="oklch(78% 0.18 80 / 0.8)">Dal Makhani</text>
    </svg>
  );

  if (name === "Butter Chicken") return (
    <svg viewBox="0 0 220 120" style={style}>
      <rect width="220" height="120" fill="oklch(16% 0.04 40)" rx="8"/>
      <ellipse cx="110" cy="108" rx="60" ry="7" fill="oklch(10% 0.03 30 / 0.6)"/>
      <path d="M50 70 Q50 110 110 110 Q170 110 170 70 Z" fill="oklch(22% 0.05 45)"/>
      <ellipse cx="110" cy="70" rx="60" ry="10" fill="oklch(28% 0.05 45)"/>
      <ellipse cx="110" cy="70" rx="56" ry="9" fill="oklch(55% 0.18 42)"/>
      <ellipse cx="95"  cy="68" rx="9" ry="6" fill="oklch(60% 0.15 55)" transform="rotate(-20,95,68)"/>
      <ellipse cx="120" cy="71" rx="8" ry="5" fill="oklch(58% 0.14 50)" transform="rotate(10,120,71)"/>
      <ellipse cx="108" cy="65" rx="7" ry="5" fill="oklch(62% 0.15 58)" transform="rotate(-5,108,65)"/>
      <path d="M80 68 Q95 64 110 68 Q125 72 140 68" stroke="oklch(92% 0.02 80 / 0.7)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="88"  cy="72" r="1.5" fill="oklch(55% 0.18 130)"/>
      <circle cx="130" cy="66" r="1.5" fill="oklch(55% 0.18 130)"/>
      <circle cx="115" cy="73" r="1.2" fill="oklch(55% 0.18 130)"/>
      <path d="M90 56 Q92 49 90 43" stroke="oklch(85% 0.01 80 / 0.3)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M130 55 Q128 48 130 42" stroke="oklch(85% 0.01 80 / 0.2)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <text x="110" y="18" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fill="oklch(78% 0.18 80 / 0.8)">Butter Chicken</text>
    </svg>
  );

  if (name === "Palak Paneer") return (
    <svg viewBox="0 0 220 120" style={style}>
      <rect width="220" height="120" fill="oklch(15% 0.04 150)" rx="8"/>
      <ellipse cx="110" cy="108" rx="60" ry="7" fill="oklch(10% 0.03 30 / 0.6)"/>
      <path d="M50 70 Q50 110 110 110 Q170 110 170 70 Z" fill="oklch(20% 0.05 45)"/>
      <ellipse cx="110" cy="70" rx="60" ry="10" fill="oklch(26% 0.05 45)"/>
      <ellipse cx="110" cy="70" rx="56" ry="9" fill="oklch(48% 0.2 145)"/>
      <path d="M75 69 Q95 66 115 70 Q135 73 155 69" stroke="oklch(55% 0.22 148)" strokeWidth="3" fill="none" opacity="0.5"/>
      <rect x="88"  y="63" width="12" height="10" rx="2" fill="oklch(94% 0.01 80)" opacity="0.92"/>
      <rect x="108" y="66" width="11" height="9"  rx="2" fill="oklch(94% 0.01 80)" opacity="0.88"/>
      <rect x="127" y="64" width="10" height="10" rx="2" fill="oklch(94% 0.01 80)" opacity="0.9"/>
      <circle cx="110" cy="70" r="4" fill="oklch(92% 0.01 80 / 0.5)"/>
      <path d="M110 64 Q105 67 110 70 Q115 73 110 76" stroke="oklch(65% 0.18 28 / 0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M82 56 Q84 50 82 44" stroke="oklch(85% 0.01 80 / 0.25)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <text x="110" y="18" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fill="oklch(78% 0.18 80 / 0.8)">Palak Paneer</text>
    </svg>
  );

  return (
    <svg viewBox="0 0 220 120" style={style}>
      <rect width="220" height="120" fill="oklch(19% 0.04 55)" rx="8"/>
      <ellipse cx="110" cy="108" rx="55" ry="7" fill="oklch(14% 0.03 55)"/>
      <path d="M55 72 Q55 108 110 108 Q165 108 165 72 Z" fill="oklch(24% 0.04 55)"/>
      <ellipse cx="110" cy="72" rx="55" ry="9" fill="oklch(28% 0.05 55)"/>
      <ellipse cx="110" cy="72" rx="51" ry="8" fill="oklch(45% 0.12 40)"/>
      <path d="M88 58 Q90 51 88 45" stroke="white" strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round"/>
      <path d="M110 55 Q112 48 110 42" stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" strokeLinecap="round"/>
      <text x="110" y="20" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" fill="oklch(65% 0.03 70)">{name}</text>
    </svg>
  );
}
