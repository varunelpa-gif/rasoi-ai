"use client";
import { useEffect, useRef } from "react";

export default function ElevenLabsWidget() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Load the ElevenLabs embed script
    if (!document.querySelector('script[src*="elevenlabs"]')) {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      s.async = true;
      s.type = "text/javascript";
      document.head.appendChild(s);
    }

    // Listen for our custom mic button trigger
    const trigger = () => {
      const el = ref.current as any;
      if (!el) return;

      // Try official API methods first
      if (typeof el.open        === "function") { el.open();         return; }
      if (typeof el.startCall   === "function") { el.startCall();    return; }
      if (typeof el.startSession === "function") { el.startSession(); return; }

      // Fall back: click the widget's internal shadow DOM button
      const tryClick = (attempts = 0) => {
        const btn = el.shadowRoot?.querySelector("button");
        if (btn) { btn.click(); return; }
        if (attempts < 10) setTimeout(() => tryClick(attempts + 1), 300);
      };
      tryClick();
    };

    window.addEventListener("rasoi-voice-trigger", trigger);
    return () => window.removeEventListener("rasoi-voice-trigger", trigger);
  }, []);

  const Widget = "elevenlabs-convai" as any;
  return (
    <>
      {/* Hide the default floating launcher — we use our own mic button */}
      <style>{`
        elevenlabs-convai {
          position: fixed !important;
          bottom: 24px !important;
          right: 24px !important;
        }
        /* Try to hide launcher bubble via CSS parts (works if widget supports it) */
        elevenlabs-convai::part(launcher) { display: none !important; }
        elevenlabs-convai::part(button)   { display: none !important; }
      `}</style>
      <Widget ref={ref} agent-id="agent_8001kqa0w3yhf98bxhtrsqxs09g5" />
    </>
  );
}
