"use client";

export default function TechSVG({ name, height = 80 }: { name: string; height?: number }) {
  const style = { width: "100%", height, display: "block" as const, borderRadius: 8 };

  if (name === "Julienne") return (
    <svg viewBox="0 0 180 90" style={style}>
      <rect width="180" height="90" fill="oklch(17% 0.04 55)" rx="8"/>
      <rect x="20" y="55" width="140" height="22" rx="4" fill="oklch(45% 0.1 60)"/>
      <rect x="22" y="57" width="136" height="18" rx="3" fill="oklch(52% 0.12 65)"/>
      {[0,1,2,3,4,5,6].map(i => <rect key={i} x={35+i*16} y="40" width="6" height="28" rx="2" fill="oklch(70% 0.2 50)" opacity={0.6+i*0.05}/>)}
      <rect x="25" y="28" width="130" height="14" rx="3" fill="oklch(75% 0.03 70)"/>
      <rect x="25" y="38" width="130" height="4"  rx="1" fill="oklch(60% 0.03 70)"/>
      <rect x="145" y="22" width="18" height="26" rx="4" fill="oklch(38% 0.06 50)"/>
      <text x="90" y="12" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="oklch(78% 0.18 80 / 0.7)">Julienne</text>
    </svg>
  );

  if (name === "Chiffonade") return (
    <svg viewBox="0 0 180 90" style={style}>
      <rect width="180" height="90" fill="oklch(15% 0.04 145)" rx="8"/>
      {[0,1,2,3,4,5,6,7].map(i => <path key={i} d={`M30 ${50+i*4} Q90 ${44+i*4} 150 ${50+i*4}`} stroke="oklch(62% 0.22 148)" strokeWidth="3.5" fill="none" opacity={0.4+i*0.07} strokeLinecap="round"/>)}
      <rect x="138" y="18" width="8" height="50" rx="2" fill="oklch(72% 0.03 70)"/>
      <path d="M138 65 L130 68 L138 68 Z" fill="oklch(60% 0.03 70)"/>
      <path d="M40 35 Q90 15 140 35 Q120 55 90 58 Q60 55 40 35Z" fill="oklch(55% 0.22 148 / 0.4)"/>
      <text x="90" y="12" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="oklch(72% 0.14 155 / 0.8)">Chiffonade</text>
    </svg>
  );

  if (name === "Brunoise") return (
    <svg viewBox="0 0 180 90" style={style}>
      <rect width="180" height="90" fill="oklch(17% 0.04 55)" rx="8"/>
      {Array.from({length:6}, (_,row) => Array.from({length:8}, (_,col) => (
        <rect key={`${row}-${col}`} x={44+col*12} y={32+row*10} width="9" height="7" rx="1.5" fill={`oklch(${65+row*2}% 0.18 ${42+col*3})`} opacity="0.75"/>
      )))}
      {[0,1,2].map(i => <line key={`h${i}`} x1="40" y1={38+i*20} x2="140" y2={38+i*20} stroke="oklch(78% 0.18 80 / 0.3)" strokeWidth="0.8"/>)}
      {[0,1,2,3,4].map(i => <line key={`v${i}`} x1={50+i*22} y1="30" x2={50+i*22} y2="80" stroke="oklch(78% 0.18 80 / 0.3)" strokeWidth="0.8"/>)}
      <text x="90" y="12" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="oklch(78% 0.18 80 / 0.7)">Brunoise</text>
    </svg>
  );

  if (name === "Dum Cooking") return (
    <svg viewBox="0 0 180 90" style={style}>
      <rect width="180" height="90" fill="oklch(16% 0.04 50)" rx="8"/>
      <ellipse cx="90" cy="82" rx="55" ry="6" fill="oklch(25% 0.05 50)"/>
      <path d="M68 75 Q72 60 68 50 Q75 62 78 55 Q80 65 82 50 Q85 63 82 75Z" fill="oklch(65% 0.22 42)" opacity="0.9"/>
      <path d="M82 75 Q85 63 82 50 Q88 60 90 52 Q93 62 90 75Z" fill="oklch(75% 0.2 68)" opacity="0.8"/>
      <path d="M90 75 Q93 62 90 52 Q96 63 100 55 Q101 65 104 52 Q106 63 100 75Z" fill="oklch(65% 0.22 42)" opacity="0.9"/>
      <path d="M45 72 Q42 50 60 42 Q90 36 120 42 Q138 50 135 72 Z" fill="oklch(38% 0.08 50)"/>
      <ellipse cx="90" cy="72" rx="45" ry="7" fill="oklch(42% 0.08 50)"/>
      <ellipse cx="90" cy="45" rx="38" ry="7" fill="oklch(72% 0.08 75)"/>
      <path d="M52 45 Q90 38 128 45" stroke="oklch(65% 0.08 75)" strokeWidth="3" fill="none"/>
      <rect x="78" y="34" width="24" height="8" rx="4" fill="oklch(35% 0.06 50)"/>
      <path d="M55 40 Q50 32 55 25" stroke="oklch(85% 0.01 80 / 0.25)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M125 40 Q130 32 125 25" stroke="oklch(85% 0.01 80 / 0.2)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <text x="90" y="12" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="oklch(78% 0.18 80 / 0.7)">Dum Cooking</text>
    </svg>
  );

  if (name === "Tarka / Tadka") return (
    <svg viewBox="0 0 180 90" style={style}>
      <rect width="180" height="90" fill="oklch(16% 0.04 50)" rx="8"/>
      <path d="M35 65 Q35 80 90 80 Q145 80 145 65 Q145 55 90 52 Q35 55 35 65Z" fill="oklch(30% 0.05 50)"/>
      <ellipse cx="90" cy="65" rx="55" ry="8" fill="oklch(35% 0.06 50)"/>
      <ellipse cx="90" cy="65" rx="50" ry="7" fill="oklch(68% 0.16 72 / 0.7)"/>
      <rect x="145" y="62" width="30" height="7" rx="3" fill="oklch(38% 0.06 50)"/>
      {[[75,58],[90,54],[105,57],[80,62],[100,60]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={i%2===0 ? "oklch(28% 0.08 40)" : "oklch(60% 0.2 150)"} opacity="0.85"/>
      ))}
      <path d="M80 62 L72 50" stroke="oklch(68% 0.16 72 / 0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M100 60 L108 48" stroke="oklch(68% 0.16 72 / 0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M90 55 L88 44" stroke="oklch(68% 0.16 72 / 0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="88" cy="63" rx="3" ry="1.5" fill="oklch(38% 0.1 50)" transform="rotate(-20,88,63)"/>
      <ellipse cx="96" cy="66" rx="3" ry="1.5" fill="oklch(38% 0.1 50)" transform="rotate(15,96,66)"/>
      <text x="90" y="12" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="oklch(78% 0.18 80 / 0.7)">Tarka / Tadka</text>
    </svg>
  );

  if (name === "Sauce Quenelle") return (
    <svg viewBox="0 0 180 90" style={style}>
      <rect width="180" height="90" fill="oklch(16% 0.03 60)" rx="8"/>
      <ellipse cx="90" cy="72" rx="60" ry="10" fill="oklch(85% 0.01 80 / 0.08)"/>
      <ellipse cx="90" cy="70" rx="55" ry="9"  fill="oklch(88% 0.01 80 / 0.1)"/>
      <path d="M50 68 Q70 62 90 65 Q110 68 130 63" stroke="oklch(55% 0.16 40)" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.7"/>
      <ellipse cx="90" cy="60" rx="22" ry="10" fill="oklch(92% 0.02 80)" transform="rotate(-8,90,60)"/>
      <path d="M70 58 Q80 52 90 54" stroke="oklch(75% 0.01 80)" strokeWidth="1" fill="none" opacity="0.5"/>
      {[[60,65],[68,62],[115,64],[122,61]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="2.5" fill="oklch(62% 0.22 148)"/>)}
      {[[45,72],[48,70],[50,68]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r={2.5-i*0.5} fill="oklch(55% 0.16 40 / 0.6)"/>)}
      <text x="90" y="12" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="oklch(78% 0.18 80 / 0.7)">Sauce Quenelle</text>
    </svg>
  );

  if (name === "Herb Oil Dots") return (
    <svg viewBox="0 0 180 90" style={style}>
      <rect width="180" height="90" fill="oklch(15% 0.03 60)" rx="8"/>
      <ellipse cx="90" cy="72" rx="58" ry="9" fill="oklch(86% 0.01 80 / 0.09)"/>
      <path d="M48 65 Q55 75 90 76 Q125 75 132 65 Q120 58 90 57 Q60 58 48 65Z" fill="oklch(45% 0.1 42 / 0.5)"/>
      {[[62,62,6],[78,58,5],[95,60,7],[112,63,5],[126,61,6],[70,68,4],[100,67,5],[118,69,4]].map(([x,y,r],i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={`oklch(${58+i*2}% 0.22 ${148+i*2})`} opacity={0.75+i*0.02}/>
      ))}
      <rect x="140" y="20" width="10" height="35" rx="5" fill="oklch(35% 0.04 55)"/>
      <path d="M144 55 L141 65" stroke="oklch(72% 0.14 155)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <text x="90" y="12" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="oklch(72% 0.14 155 / 0.8)">Herb Oil Dots</text>
    </svg>
  );

  if (name === "Bhunoing") return (
    <svg viewBox="0 0 180 90" style={style}>
      <rect width="180" height="90" fill="oklch(15% 0.04 45)" rx="8"/>
      <ellipse cx="90" cy="82" rx="45" ry="8" fill="oklch(60% 0.2 42 / 0.15)"/>
      {[[72,75,50],[82,72,45],[90,70,42],[100,73,46],[108,75,50]].map(([x,yb,hue],i) => (
        <path key={i} d={`M${x-5} ${yb} Q${x} ${yb-22} ${x-2} ${yb-32} Q${x+3} ${yb-20} ${x+5} ${yb}Z`} fill={`oklch(65% 0.22 ${hue})`} opacity="0.85"/>
      ))}
      <path d="M38 72 Q36 52 60 44 Q90 38 120 44 Q144 52 142 72Z" fill="oklch(32% 0.04 55)"/>
      <ellipse cx="90" cy="72" rx="52" ry="9" fill="oklch(36% 0.05 55)"/>
      <ellipse cx="90" cy="71" rx="47" ry="8" fill="oklch(45% 0.18 38)"/>
      <path d="M60 69 Q75 65 90 68 Q105 71 120 67" stroke="oklch(55% 0.2 42)" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round"/>
      {[[68,66],[90,63],[112,66]].map(([x,y],i) => (
        <ellipse key={i} cx={x} cy={y} rx="5" ry="2.5" fill="oklch(68% 0.16 72 / 0.5)" transform={`rotate(${-20+i*20},${x},${y})`}/>
      ))}
      <rect x="126" y="28" width="5" height="45" rx="2" fill="oklch(55% 0.04 55)" transform="rotate(20,126,50)"/>
      <rect x="130" y="50" width="14" height="6" rx="1" fill="oklch(48% 0.04 55)" transform="rotate(20,130,53)"/>
      <text x="90" y="12" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="oklch(78% 0.18 80 / 0.7)">Bhunoing</text>
    </svg>
  );

  return (
    <svg viewBox="0 0 180 90" style={style}>
      <rect width="180" height="90" fill="oklch(19% 0.04 55)" rx="8"/>
      <text x="90" y="50" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fill="oklch(45% 0.03 70)">{name}</text>
    </svg>
  );
}
