"use client";
import { useState, useEffect } from "react";
import { useVoice } from "@/context/VoiceContext";

export default function VoiceOrb() {
  const { state, text, orbOpen, closeOrb } = useVoice();
  const [apiKey,       setApiKey]       = useState<string | null>(null);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput,     setKeyInput]     = useState("");

  useEffect(() => {
    if (orbOpen) setApiKey(localStorage.getItem("rasoi_api_key"));
  }, [orbOpen]);

  function saveKey() {
    const k = keyInput.trim();
    if (k) { localStorage.setItem("rasoi_api_key", k); setApiKey(k); }
    setShowKeyInput(false); setKeyInput("");
  }

  if (!orbOpen) return null;

  const isListening  = state === "listening";
  const isSpeaking   = state === "speaking";
  const isProcessing = state === "processing";

  return (
    <>
      <style>{`
        @keyframes vo-ripple {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2.8); opacity: 0;   }
        }
        @keyframes vo-breathe {
          0%, 100% { transform: scale(1);    }
          50%       { transform: scale(1.08); }
        }
        @keyframes vo-spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        @keyframes vo-glow {
          0%, 100% { opacity: 0.55; transform: scale(1);    }
          50%       { opacity: 1;   transform: scale(1.025); }
        }
        @keyframes vo-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes vo-textup {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>

      {/* Full-screen overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        animation: "vo-fadein 0.25s ease",
      }}>

        {/* Status label — top center */}
        <div style={{
          position: "absolute", top: 48,
          fontSize: 11, color: "oklch(38% 0 0)",
          letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500,
        }}>
          {isListening  ? "Listening"  :
           isSpeaking   ? "Speaking"   :
           isProcessing ? "Thinking…"  :
           "Rasoi AI"}
        </div>

        {/* Orb area */}
        <div style={{ position: "relative", width: 320, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>

          {/* Ripple rings — listening */}
          {isListening && (
            <>
              {[0, 0.7, 1.4].map((delay, i) => (
                <div key={i} style={{
                  position: "absolute",
                  width: 200, height: 200, borderRadius: "50%",
                  border: `1px solid oklch(80% 0 0 / ${0.25 - i * 0.06})`,
                  animation: `vo-ripple 2.1s ease-out infinite ${delay}s`,
                }} />
              ))}
            </>
          )}

          {/* Breathing glow rings — speaking */}
          {isSpeaking && (
            <>
              <div style={{
                position: "absolute", width: 240, height: 240, borderRadius: "50%",
                background: "radial-gradient(circle, oklch(22% 0 0 / 0.6), transparent 70%)",
                animation: "vo-breathe 1.6s ease-in-out infinite",
              }} />
              <div style={{
                position: "absolute", width: 190, height: 190, borderRadius: "50%",
                background: "radial-gradient(circle, oklch(25% 0 0 / 0.5), transparent 65%)",
                animation: "vo-breathe 1.6s ease-in-out infinite 0.4s",
              }} />
            </>
          )}

          {/* Spinning arc — processing */}
          {isProcessing && (
            <div style={{
              position: "absolute", width: 220, height: 220, borderRadius: "50%",
              border: "1px solid transparent",
              borderTopColor: "oklch(60% 0 0 / 0.55)",
              animation: "vo-spin 1.1s linear infinite",
            }} />
          )}

          {/* Main orb */}
          <div style={{
            width: 180, height: 180, borderRadius: "50%",
            background: isListening
              ? "radial-gradient(circle at 38% 38%, oklch(24% 0 0), oklch(7% 0 0) 80%)"
              : isSpeaking
              ? "radial-gradient(circle at 38% 38%, oklch(28% 0 0), oklch(10% 0 0) 80%)"
              : "radial-gradient(circle at 38% 38%, oklch(18% 0 0), oklch(5% 0 0) 80%)",
            boxShadow: isListening
              ? "0 0 80px oklch(80% 0 0 / 0.07), 0 0 160px oklch(80% 0 0 / 0.03), inset 0 1px 0 oklch(40% 0 0 / 0.15)"
              : isSpeaking
              ? "0 0 60px oklch(80% 0 0 / 0.06), inset 0 1px 0 oklch(40% 0 0 / 0.12)"
              : "0 0 30px oklch(80% 0 0 / 0.03), inset 0 1px 0 oklch(30% 0 0 / 0.1)",
            animation: isSpeaking
              ? "vo-breathe 1.6s ease-in-out infinite"
              : isListening
              ? "vo-glow 2.2s ease-in-out infinite"
              : "none",
            transition: "background 0.5s ease, box-shadow 0.5s ease",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }} onClick={closeOrb}>

            {/* Mic icon — shown when not speaking */}
            {!isSpeaking && (
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
                stroke={isListening ? "oklch(55% 0 0)" : "oklch(35% 0 0)"}
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: "stroke 0.4s" }}>
                <rect x="9" y="3" width="6" height="11" rx="3"/>
                <path d="M5 10a7 7 0 0 0 14 0"/>
                <line x1="12" y1="20" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            )}

            {/* Sound bars — speaking */}
            {isSpeaking && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, height: 28 }}>
                {[0.8, 1.2, 0.5, 1.0, 0.6].map((delay, i) => (
                  <div key={i} style={{
                    width: 3, borderRadius: 2,
                    background: "oklch(50% 0 0)",
                    animation: `vo-breathe ${delay}s ease-in-out infinite ${i * 0.12}s`,
                    height: [14, 22, 10, 18, 12][i],
                  }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Spoken / heard text */}
        <div style={{
          marginTop: 40, maxWidth: 380, width: "100%",
          textAlign: "center", minHeight: 64, padding: "0 40px",
        }}>
          {text ? (
            <div key={text.slice(0, 12)} style={{
              fontSize: isSpeaking ? 17 : 14,
              lineHeight: 1.65,
              color: isSpeaking ? "oklch(82% 0 0)" : "oklch(48% 0 0)",
              fontWeight: isSpeaking ? 400 : 300,
              letterSpacing: "0.005em",
              animation: "vo-textup 0.3s ease",
            }}>
              {text}
            </div>
          ) : isListening ? (
            <div style={{ fontSize: 13, color: "oklch(30% 0 0)", fontStyle: "italic" }}>
              Ask me anything about your kitchen…
            </div>
          ) : null}
        </div>

        {/* API key setup — shown at bottom when no key set */}
        {!apiKey && !showKeyInput && (
          <div onClick={() => setShowKeyInput(true)} style={{
            position: "absolute", bottom: 118,
            fontSize: 11, color: "oklch(32% 0 0)", cursor: "pointer",
            borderBottom: "1px solid oklch(25% 0 0)", paddingBottom: 1,
            letterSpacing: "0.04em",
          }}>
            ✦ Add Anthropic API key for real AI answers
          </div>
        )}

        {showKeyInput && (
          <div style={{
            position: "absolute", bottom: 110,
            display: "flex", flexDirection: "column", gap: 8, alignItems: "center", width: 300,
          }}>
            <div style={{ fontSize: 11, color: "oklch(38% 0 0)", marginBottom: 2 }}>
              Paste your Anthropic API key (stored in browser only)
            </div>
            <input
              autoFocus
              type="password"
              placeholder="sk-ant-api03-..."
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") saveKey(); if (e.key === "Escape") { setShowKeyInput(false); setKeyInput(""); } }}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 8,
                background: "oklch(10% 0 0)", border: "1px solid oklch(28% 0 0)",
                color: "oklch(75% 0 0)", fontSize: 12, outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveKey} style={{ padding: "6px 18px", borderRadius: 6, background: "oklch(22% 0 0)", border: "1px solid oklch(35% 0 0)", color: "oklch(70% 0 0)", fontSize: 12, cursor: "pointer" }}>
                Save
              </button>
              <button onClick={() => { setShowKeyInput(false); setKeyInput(""); }} style={{ padding: "6px 14px", borderRadius: 6, background: "none", border: "1px solid oklch(22% 0 0)", color: "oklch(40% 0 0)", fontSize: 12, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {apiKey && (
          <div style={{
            position: "absolute", bottom: 118,
            fontSize: 10, color: "oklch(26% 0 0)", letterSpacing: "0.04em",
            cursor: "pointer",
          }} onClick={() => { localStorage.removeItem("rasoi_api_key"); setApiKey(null); }}>
            ✦ AI connected — tap to remove key
          </div>
        )}

        {/* Close button */}
        <button onClick={closeOrb} style={{
          position: "absolute", bottom: 52,
          width: 48, height: 48, borderRadius: "50%",
          background: "oklch(12% 0 0)",
          border: "1px solid oklch(22% 0 0)",
          color: "oklch(42% 0 0)", cursor: "pointer",
          fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(18% 0 0)"; (e.currentTarget as HTMLButtonElement).style.color = "oklch(60% 0 0)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(12% 0 0)"; (e.currentTarget as HTMLButtonElement).style.color = "oklch(42% 0 0)"; }}
        >
          ✕
        </button>
      </div>
    </>
  );
}
