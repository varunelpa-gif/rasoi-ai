"use client";
import { useEffect } from "react";

export default function ElevenLabsWidget() {
  useEffect(() => {
    if (!document.querySelector('script[src*="elevenlabs"]')) {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      s.async = true;
      s.type = "text/javascript";
      document.head.appendChild(s);
    }

    // Once shadow DOM is ready, hide the floating launcher bubble
    const hideLauncher = (el: any, n = 0) => {
      const sr = el.shadowRoot;
      if (sr) {
        if (!sr.querySelector("#rasoi-style")) {
          const style = document.createElement("style");
          style.id = "rasoi-style";
          // Launcher uses shadow-md + pointer-events-auto; panel uses shadow-lg
          // Hide only the launcher, keep the conversation panel visible
          style.textContent = `
            .shadow-md.pointer-events-auto { display: none !important; }
          `;
          sr.appendChild(style);
        }
      } else if (n < 30) {
        setTimeout(() => hideLauncher(el, n + 1), 300);
      }
    };

    const trigger = () => {
      const el = document.querySelector("elevenlabs-convai") as any;
      if (!el) return;

      // Step 1: expand the panel
      document.dispatchEvent(new CustomEvent("elevenlabs-agent:expand", {
        detail: { action: "expand" },
        bubbles: true,
      }));

      // Step 2: click "Start a call" button inside shadow DOM
      const tryStart = (attempts = 0) => {
        const sr = el.shadowRoot;
        const btn = sr?.querySelector('[aria-label="Start a call"]') as HTMLElement | null;
        if (btn) {
          btn.click();
          return;
        }
        if (attempts < 25) setTimeout(() => tryStart(attempts + 1), 150);
      };
      // Give the panel a moment to expand before clicking
      setTimeout(() => tryStart(), 200);
    };

    // Watch for the widget to mount then hide its launcher
    const waitForEl = (n = 0) => {
      const el = document.querySelector("elevenlabs-convai") as any;
      if (el) { hideLauncher(el); return; }
      if (n < 30) setTimeout(() => waitForEl(n + 1), 500);
    };
    waitForEl();

    window.addEventListener("rasoi-voice-trigger", trigger);
    return () => window.removeEventListener("rasoi-voice-trigger", trigger);
  }, []);

  const Widget = "elevenlabs-convai" as any;
  return <Widget agent-id="agent_8001kqa0w3yhf98bxhtrsqxs09g5" />;
}
