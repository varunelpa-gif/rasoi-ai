"use client";
import { useState, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// ── Spice Art SVG ─────────────────────────────────────────────
function SpiceArt() {
  return (
    <svg viewBox="0 0 340 480" style={{ width: "100%", maxWidth: 320, opacity: 0.92 }}>
      <radialGradient id="glow" cx="50%" cy="55%" r="45%">
        <stop offset="0%" stopColor="oklch(78% 0.18 80)" stopOpacity="0.18"/>
        <stop offset="100%" stopColor="oklch(13% 0.03 55)" stopOpacity="0"/>
      </radialGradient>
      <ellipse cx="170" cy="270" rx="160" ry="150" fill="url(#glow)"/>
      <path d="M70 260 Q68 340 170 345 Q272 340 270 260 Z" fill="oklch(22% 0.05 45)"/>
      <ellipse cx="170" cy="260" rx="100" ry="16" fill="oklch(30% 0.06 50)"/>
      <ellipse cx="170" cy="260" rx="95" ry="14" fill="oklch(38% 0.13 28)"/>
      <path d="M170 254 Q190 248 198 258 Q204 268 190 272 Q170 276 152 268 Q140 260 152 252 Q162 246 170 254Z" fill="oklch(92% 0.02 80 / 0.8)"/>
      <circle cx="148" cy="264" r="4" fill="oklch(62% 0.22 148)"/>
      <circle cx="155" cy="270" r="3" fill="oklch(62% 0.22 148)"/>
      <circle cx="195" cy="256" r="3.5" fill="oklch(62% 0.22 148)"/>
      <ellipse cx="140" cy="254" rx="9" ry="4" fill="oklch(85% 0.16 85 / 0.75)" transform="rotate(-15,140,254)"/>
      <path d="M130 242 Q133 228 130 215" stroke="oklch(85% 0.01 80 / 0.25)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M170 238 Q173 222 170 208" stroke="oklch(85% 0.01 80 / 0.2)"  strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M210 240 Q207 226 210 213" stroke="oklch(85% 0.01 80 / 0.18)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Star anise */}
      <g transform="translate(62,148) rotate(25)" style={{ animation: "float 4s ease-in-out infinite" }}>
        {[0,1,2,3,4,5,6,7].map(i => <path key={i} d="M0 0 L0 -18" stroke="oklch(55% 0.15 45)" strokeWidth="2" fill="none" transform={`rotate(${i*45})`}/>)}
        <circle cx="0" cy="0" r="5" fill="oklch(45% 0.12 42)"/>
        {[0,45,90,135,180,225,270,315].map((a,i) => <ellipse key={i} cx="0" cy="-14" rx="3.5" ry="2" fill="oklch(50% 0.14 44)" transform={`rotate(${a})`}/>)}
      </g>
      {/* Cardamom */}
      <g transform="translate(268,160) rotate(-20)" style={{ animation: "float 5s ease-in-out infinite", animationDelay: "1s" }}>
        <ellipse cx="0" cy="0" rx="8" ry="14" fill="oklch(52% 0.18 148)"/>
        <line x1="0" y1="-14" x2="0" y2="-22" stroke="oklch(45% 0.14 148)" strokeWidth="1.5"/>
        <line x1="-5" y1="-4" x2="5" y2="-4" stroke="oklch(44% 0.15 148)" strokeWidth="1"/>
        <line x1="-5" y1="0"  x2="5" y2="0"  stroke="oklch(44% 0.15 148)" strokeWidth="1"/>
        <line x1="-5" y1="4"  x2="5" y2="4"  stroke="oklch(44% 0.15 148)" strokeWidth="1"/>
      </g>
      {/* Turmeric */}
      <g transform="translate(55,340) rotate(15)" style={{ animation: "float 6s ease-in-out infinite", animationDelay: "0.5s" }}>
        <path d="M0 0 Q-8 -12 -4 -22 Q0 -30 4 -22 Q8 -12 0 0Z" fill="oklch(70% 0.2 72)"/>
        <path d="M0 0 Q12 -5 18 2 Q22 10 12 14 Q4 16 0 0Z"       fill="oklch(68% 0.2 72)"/>
        <path d="M0 0 Q-10 8 -14 16 Q-16 22 -8 22 Q-2 20 0 0Z"   fill="oklch(66% 0.2 72)"/>
      </g>
      {/* Chilli */}
      <g transform="translate(272,338) rotate(-35)" style={{ animation: "float 4.5s ease-in-out infinite", animationDelay: "1.5s" }}>
        <path d="M0 0 Q-6 -8 -4 -20 Q-2 -30 0 -28 Q4 -20 2 -10 Q2 -4 0 0Z" fill="oklch(58% 0.22 22)"/>
        <path d="M0 -28 Q2 -36 6 -34" stroke="oklch(52% 0.18 148)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </g>
      {[[100,195,-20],[240,200,30],[88,390,10],[255,395,-15],[160,400,5]].map(([x,y,r],i) => (
        <ellipse key={i} cx={x} cy={y} rx="5" ry="2" fill="oklch(42% 0.1 55)" transform={`rotate(${r},${x},${y})`} opacity="0.7"/>
      ))}
      <path d="M195 178 Q210 168 220 175 Q215 185 205 182Z" fill="oklch(72% 0.2 55)" opacity="0.8"/>
      <path d="M200 182 L218 198" stroke="oklch(75% 0.2 60)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M205 180 L225 192" stroke="oklch(72% 0.2 55)" strokeWidth="1"   fill="none" strokeLinecap="round" opacity="0.6"/>
      <ellipse cx="170" cy="260" rx="118" ry="20" fill="none" stroke="oklch(78% 0.18 80 / 0.08)" strokeWidth="1" strokeDasharray="6 4"/>
    </svg>
  );
}

// ── UI primitives (local) ─────────────────────────────────────
function Input({ label, type = "text", value, onChange, placeholder, error, icon }: {
  label?: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; icon?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 12, color: "oklch(58% 0.03 70)", marginBottom: 6, fontWeight: 500 }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.5 }}>{icon}</span>}
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: icon ? "12px 14px 12px 42px" : "12px 14px",
            background: "oklch(22% 0.04 55)",
            border: `1.5px solid ${error ? "oklch(65% 0.18 20)" : focused ? "oklch(78% 0.18 80)" : "oklch(32% 0.04 55)"}`,
            borderRadius: 10, color: "oklch(93% 0.015 80)", fontSize: 14,
            fontFamily: "var(--ff-body)", transition: "border-color 0.2s",
          }}
        />
      </div>
      {error && <div style={{ fontSize: 11, color: "oklch(65% 0.18 20)", marginTop: 5 }}>{error}</div>}
    </div>
  );
}

function PrimaryBtn({ children, onClick, loading }: { children: React.ReactNode; onClick: () => void; loading?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 11, border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 600, fontFamily: "var(--ff-body)", background: "oklch(78% 0.18 80)", color: "oklch(13% 0.03 55)", opacity: loading ? 0.7 : 1 }}>
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ width: 16, height: 16, border: "2px solid oklch(13% 0.03 55 / 0.3)", borderTopColor: "oklch(13% 0.03 55)", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}/>
          Signing in…
        </span>
      ) : children}
    </button>
  );
}

// ── Auth Panel ────────────────────────────────────────────────
function AuthPanel({ onSuccess }: { onSuccess: (user: { name: string; email: string; restaurant: string }) => void }) {
  const [tab, setTab]           = useState<"signin"|"signup">("signin");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Record<string,string>>({});

  const validate = () => {
    const e: Record<string,string> = {};
    if (!email.includes("@"))    e.email    = "Enter a valid email address";
    if (password.length < 6)     e.password = "Password must be at least 6 characters";
    if (tab === "signup" && !name.trim()) e.name = "Your name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email, password, name: name || email.split("@")[0],
        redirect: false,
      });
      if (result?.error) {
        setErrors({ email: "Invalid email or password" });
        setLoading(false);
      } else {
        onSuccess({ name: name || email.split("@")[0], email, restaurant });
      }
    } catch {
      setLoading(false);
      setErrors({ email: "Something went wrong. Try again." });
    }
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({ name: "Chef Kumar", email: "chef@gmail.com", restaurant: "" });
    }, 1200);
  };

  return (
    <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.5s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "oklch(78% 0.18 80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍲</div>
        <div>
          <div style={{ fontFamily: "var(--ff-head)", fontSize: 24, fontWeight: 700, color: "oklch(78% 0.18 80)", lineHeight: 1 }}>Rasoi AI</div>
          <div style={{ fontSize: 10, color: "oklch(48% 0.03 70)", letterSpacing: "0.12em", marginTop: 2 }}>KITCHEN INTELLIGENCE</div>
        </div>
      </div>

      <div style={{ fontFamily: "var(--ff-head)", fontSize: 28, fontWeight: 600, marginBottom: 6 }}>
        {tab === "signin" ? "Welcome back, Chef" : "Join Rasoi AI"}
      </div>
      <div style={{ fontSize: 14, color: "oklch(55% 0.03 70)", marginBottom: 28 }}>
        {tab === "signin" ? "Sign in to your kitchen dashboard" : "Create your restaurant account"}
      </div>

      <div style={{ display: "flex", background: "oklch(20% 0.04 55)", borderRadius: 10, padding: 3, marginBottom: 24, border: "1px solid oklch(28% 0.04 55)" }}>
        {(["signin","signup"] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setErrors({}); }} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: tab === t ? 600 : 400, fontFamily: "var(--ff-body)", background: tab === t ? "oklch(78% 0.18 80)" : "transparent", color: tab === t ? "oklch(13% 0.03 55)" : "oklch(58% 0.03 70)", transition: "all 0.2s" }}>
            {t === "signin" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      {/* Google button */}
      <button onClick={handleGoogle} style={{ width: "100%", padding: "12px", borderRadius: 11, border: "1.5px solid oklch(32% 0.04 55)", background: "oklch(20% 0.04 55)", cursor: "pointer", color: "oklch(85% 0.02 80)", fontSize: 14, fontWeight: 500, fontFamily: "var(--ff-body)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
        <div style={{ flex: 1, height: 1, background: "oklch(28% 0.04 55)" }}/>
        <span style={{ fontSize: 12, color: "oklch(48% 0.03 70)" }}>or continue with email</span>
        <div style={{ flex: 1, height: 1, background: "oklch(28% 0.04 55)" }}/>
      </div>

      {tab === "signup" && <Input label="Your Name" value={name} onChange={setName} placeholder="Chef Ramesh Kumar" icon="👤" error={errors.name}/>}
      <Input label="Email Address" type="email" value={email} onChange={setEmail} placeholder="chef@yourrestaurant.com" icon="✉️" error={errors.email}/>
      <Input label="Password" type="password" value={password} onChange={setPassword} placeholder={tab === "signin" ? "Enter your password" : "Min. 6 characters"} icon="🔒" error={errors.password}/>
      {tab === "signup" && <Input label="Restaurant Name (optional)" value={restaurant} onChange={setRestaurant} placeholder="e.g. Spice Garden, Mumbai" icon="🏮"/>}

      {tab === "signin" && (
        <div style={{ textAlign: "right", marginBottom: 20, marginTop: -8 }}>
          <span style={{ fontSize: 12, color: "oklch(78% 0.18 80)", cursor: "pointer" }}>Forgot password?</span>
        </div>
      )}

      <PrimaryBtn onClick={handleSubmit} loading={loading}>
        {tab === "signin" ? "Sign In →" : "Create Account →"}
      </PrimaryBtn>

      <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "oklch(50% 0.03 70)" }}>
        {tab === "signin" ? "New to Rasoi? " : "Already have an account? "}
        <span onClick={() => { setTab(tab === "signin" ? "signup" : "signin"); setErrors({}); }} style={{ color: "oklch(78% 0.18 80)", cursor: "pointer", fontWeight: 500 }}>
          {tab === "signin" ? "Create account" : "Sign in"}
        </span>
      </div>

      <div style={{ marginTop: 28, fontSize: 11, color: "oklch(40% 0.03 70)", textAlign: "center", lineHeight: 1.7 }}>
        By continuing you agree to Rasoi&apos;s{" "}
        <span style={{ color: "oklch(55% 0.03 70)", cursor: "pointer" }}>Terms of Service</span> and{" "}
        <span style={{ color: "oklch(55% 0.03 70)", cursor: "pointer" }}>Privacy Policy</span>
      </div>
    </div>
  );
}

// ── Onboarding Steps ──────────────────────────────────────────
const STEPS = [
  { id: "welcome",  emoji: "🍲", title: "Namaste, Chef!",         subtitle: "Your AI-powered kitchen is ready",     desc: "Rasoi AI learns your kitchen, knows your recipes, tracks your inventory — and listens when you call.", cta: "Let's get started" },
  { id: "voice",   emoji: "🎙️", title: "Meet your voice assistant", subtitle: `Say "Hey Rasoi" anytime`,            desc: "Ask for the next recipe step, set a timer, check stock levels, or find substitutes — all hands-free while you cook.", cta: "Got it, continue", demo: true },
  { id: "features",emoji: "⚡",  title: "Everything in one place", subtitle: "Built for the modern kitchen",       cta: "Almost there",
    features: [
      { icon: "📖", label: "Recipe Studio",    desc: "Voice-guided step-by-step" },
      { icon: "🔪", label: "Knife Techniques", desc: "Master every cut" },
      { icon: "📦", label: "Smart Inventory",  desc: "Never run out again" },
      { icon: "👥", label: "Staff & Shifts",   desc: "Schedule with ease" },
      { icon: "📋", label: "Menu Planning",    desc: "Optimise margins" },
      { icon: "🚚", label: "Suppliers",        desc: "Auto-reorder essentials" },
    ],
  },
  { id: "ready",   emoji: "🔥", title: "Your kitchen is set up!", subtitle: "Time to cook something amazing",     desc: "Your dashboard is ready. Recipes, timers, inventory and your full team are waiting for you inside.", cta: "Enter Kitchen →", final: true },
];

function OnboardingStep({ step, user, onNext }: { step: typeof STEPS[0]; user: { name: string; email: string; restaurant: string }; onNext: () => void }) {
  const [voiceDemo, setVoiceDemo] = useState<"idle"|"listening"|"speaking">("idle");
  const [demoText, setDemoText]   = useState("");

  const triggerDemo = () => {
    if (voiceDemo !== "idle") return;
    setVoiceDemo("listening");
    setTimeout(() => { setDemoText("Hey Rasoi, what's next?"); }, 1500);
    setTimeout(() => { setVoiceDemo("speaking"); setDemoText("Step 3: Add finely diced onions. Cook on low for 20 minutes until deep golden — this is your base flavour."); }, 3000);
    setTimeout(() => { setVoiceDemo("idle"); setDemoText(""); }, 7500);
  };

  return (
    <div style={{ width: "100%", maxWidth: 520, animation: "fadeUp 0.45s ease" }}>
      <div style={{ fontSize: 56, marginBottom: 16, textAlign: "center", animation: "pulse 2s ease-in-out infinite" }}>{step.emoji}</div>
      <div style={{ fontFamily: "var(--ff-head)", fontSize: 30, fontWeight: 700, textAlign: "center", marginBottom: 6 }}>{step.title}</div>
      <div style={{ fontSize: 15, color: "oklch(78% 0.18 80)", textAlign: "center", marginBottom: 12, fontWeight: 500 }}>{step.subtitle}</div>
      {"desc" in step && step.desc && (
        <div style={{ fontSize: 14, color: "oklch(62% 0.03 70)", textAlign: "center", lineHeight: 1.75, marginBottom: 28 }}>{step.desc}</div>
      )}

      {"demo" in step && step.demo && (
        <div style={{ background: "oklch(19% 0.04 55)", border: "1px solid oklch(27% 0.04 55)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div onClick={triggerDemo} style={{ position: "relative", width: 52, height: 52, cursor: "pointer", flexShrink: 0 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: voiceDemo !== "idle" ? "oklch(78% 0.18 80)" : "oklch(78% 0.18 80 / 0.12)", border: `1.5px solid ${voiceDemo !== "idle" ? "oklch(78% 0.18 80)" : "oklch(78% 0.18 80 / 0.4)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
                <span style={{ fontSize: 20 }}>🎙️</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
                {voiceDemo === "idle" ? "Tap to try it" : voiceDemo === "listening" ? "Listening…" : "Rasoi AI"}
              </div>
              <div style={{ fontSize: 12, color: "oklch(55% 0.03 70)" }}>
                {voiceDemo === "idle" ? 'Simulated "Hey Rasoi" demo' : "Voice active"}
              </div>
            </div>
          </div>
          <div style={{ background: "oklch(23% 0.04 55)", borderRadius: 10, padding: "12px 14px", fontSize: 13, lineHeight: 1.65, color: voiceDemo === "speaking" ? "oklch(92% 0.02 80)" : "oklch(68% 0.02 70)", borderLeft: "3px solid oklch(78% 0.18 80)" }}>
            {demoText || '"Hey Rasoi, what\'s the next step in dal makhani?"'}
          </div>
        </div>
      )}

      {"features" in step && step.features && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          {step.features.map((f, i) => (
            <div key={i} style={{ background: "oklch(19% 0.04 55)", border: "1px solid oklch(27% 0.04 55)", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{f.label}</div>
                <div style={{ fontSize: 11, color: "oklch(52% 0.03 70)" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {"final" in step && step.final && (
        <div style={{ background: "oklch(78% 0.18 80 / 0.08)", border: "1px solid oklch(78% 0.18 80 / 0.3)", borderRadius: 14, padding: "16px 20px", marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>👋</div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Welcome, {user.name}!</div>
          {user.restaurant && <div style={{ fontSize: 13, color: "oklch(55% 0.03 70)" }}>{user.restaurant}</div>}
          <div style={{ fontSize: 12, color: "oklch(50% 0.03 70)", marginTop: 4 }}>{user.email}</div>
        </div>
      )}

      <button onClick={onNext} style={{ width: "100%", padding: "14px", borderRadius: 11, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "var(--ff-body)", background: "oklch(78% 0.18 80)", color: "oklch(13% 0.03 55)" }}>
        {step.cta}
      </button>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function SignInPage() {
  const router = useRouter();
  const [view, setView]   = useState<"auth"|"onboard">("auth");
  const [stepIdx, setStep] = useState(0);
  const [user, setUser]   = useState({ name: "", email: "", restaurant: "" });

  const handleAuth = (userData: typeof user) => {
    setUser(userData);
    setView("onboard");
    setStep(0);
  };

  const handleNext = () => {
    if ((STEPS[stepIdx] as {final?: boolean}).final) {
      router.push("/app/dashboard");
      return;
    }
    setStep(s => s + 1);
  };

  if (view === "auth") return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ width: "45%", background: "oklch(15% 0.04 50)", borderRight: "1px solid oklch(24% 0.04 55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 20%, oklch(78% 0.18 80 / 0.05) 0%, transparent 60%), radial-gradient(circle at 70% 80%, oklch(62% 0.16 40 / 0.06) 0%, transparent 60%)" }}/>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: "oklch(78% 0.18 80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🍲</div>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 32, fontWeight: 700, color: "oklch(78% 0.18 80)" }}>Rasoi AI</div>
          </div>
          <div style={{ fontSize: 11, color: "oklch(45% 0.03 70)", letterSpacing: "0.18em", marginBottom: 32 }}>KITCHEN INTELLIGENCE</div>
          <div style={{ animation: "float 5s ease-in-out infinite" }}>
            <SpiceArt/>
          </div>
          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 20, color: "oklch(85% 0.02 80)", fontStyle: "italic", lineHeight: 1.5 }}>
              &quot;Your kitchen, your voice,<br/>your AI sous-chef.&quot;
            </div>
            <div style={{ fontSize: 12, color: "oklch(45% 0.03 70)", marginTop: 10 }}>
              Trusted by 500+ restaurant kitchens across India
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px", overflowY: "auto" }}>
        <AuthPanel onSuccess={handleAuth}/>
      </div>
    </div>
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", overflowY: "auto", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 40%, oklch(78% 0.18 80 / 0.04) 0%, transparent 65%)", pointerEvents: "none" }}/>
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 540, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {!(STEPS[stepIdx] as {final?: boolean}).final && (
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <span onClick={() => router.push("/app/dashboard")} style={{ fontSize: 13, color: "oklch(45% 0.03 70)", cursor: "pointer" }}>Skip →</span>
          </div>
        )}
        <div style={{ display: "flex", gap: 7, justifyContent: "center", marginBottom: 36 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ height: 5, borderRadius: 3, transition: "all 0.3s ease", background: i === stepIdx ? "oklch(78% 0.18 80)" : "oklch(30% 0.04 55)", width: i === stepIdx ? 24 : 5 }}/>
          ))}
        </div>
        <OnboardingStep step={STEPS[stepIdx]} user={user} onNext={handleNext}/>
      </div>
    </div>
  );
}
