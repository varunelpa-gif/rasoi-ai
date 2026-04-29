"use client";
import { useEffect, useRef } from "react";

export default function ElevenLabsWidget() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!document.querySelector('script[src*="elevenlabs"]')) {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      s.async = true;
      s.type = "text/javascript";
      document.head.appendChild(s);
    }

    // Inject CSS into shadow DOM to hide launcher button once it's ready
    const hideLauncher = (el: any, attempts = 0) => {
      const sr = el.shadowRoot;
      if (sr) {
        if (!sr.querySelector("#rasoi-hide-launcher")) {
          const style = document.createElement("style");
          style.id = "rasoi-hide-launcher";
          // Hide the floating launcher bubble — all possible button/launcher elements
          style.textContent = `
            button[class*="launcher"], div[class*="launcher"],
            [class*="call-button"], [class*="start-call"],
            [class*="need-help"], [class*="fab"],
            button:first-child { display: none !important; }
          `;
          sr.appendChild(style);
        }
      } else if (attempts < 20) {
        setTimeout(() => hideLauncher(el, attempts + 1), 300);
      }
    };

    const trigger = () => {
      const el = ref.current as any;
      if (!el) return;

      // Dispatch the internal call event — bypasses the launcher entirely
      el.dispatchEvent(new CustomEvent("elevenlabs-convai:call", {
        bubbles: true,
        composed: true,
        detail: { config: {} },
      }));
    };

    window.addEventListener("rasoi-voice-trigger", trigger);

    // Start hiding the launcher once the element is available
    const checkEl = (n = 0) => {
      if (ref.current) { hideLauncher(ref.current); return; }
      if (n < 20) setTimeout(() => checkEl(n + 1), 300);
    };
    checkEl();

    return () => window.removeEventListener("rasoi-voice-trigger", trigger);
  }, []);

  const Widget = "elevenlabs-convai" as any;
  return (
    <>
      {/* Host element positioned off-screen — conversation panel uses position:fixed internally so it renders on-screen */}
      <style>{`
        elevenlabs-convai {
          position: fixed !important;
          bottom: -9999px !important;
          right: -9999px !important;
        }
      `}</style>
      <Widget ref={ref} agent-id="agent_8001kqa0w3yhf98bxhtrsqxs09g5" />
    </>
  );
}
