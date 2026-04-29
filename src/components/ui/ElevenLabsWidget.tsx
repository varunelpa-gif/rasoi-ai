"use client";
import { useEffect, useRef } from "react";

const WIDGET_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed@0.11.6/dist/index.js";
const AGENT_ID   = "agent_8001kqa0w3yhf98bxhtrsqxs09g5";

export default function ElevenLabsWidget() {
  const inCallRef = useRef(false);

  useEffect(() => {
    if (!document.querySelector(`script[src="${WIDGET_SRC}"]`)) {
      const s = document.createElement("script");
      s.src   = WIDGET_SRC;
      s.async = true;
      s.type  = "text/javascript";
      document.head.appendChild(s);
    }

    const getEl = () => document.querySelector("elevenlabs-convai") as any;

    // Hide launcher bubble (visibility:hidden keeps programmatic .click() working)
    const injectStyle = (el: any, n = 0) => {
      const sr = el.shadowRoot;
      if (sr) {
        if (!sr.querySelector("#rasoi-style")) {
          const style = document.createElement("style");
          style.id = "rasoi-style";
          style.textContent = `
            .shadow-md.pointer-events-auto {
              visibility: hidden !important;
              pointer-events: none !important;
            }
          `;
          sr.appendChild(style);
        }
        return;
      }
      if (n < 40) setTimeout(() => injectStyle(el, n + 1), 250);
    };

    const waitAndInit = (n = 0) => {
      const el = getEl();
      if (el) { injectStyle(el); return; }
      if (n < 40) setTimeout(() => waitAndInit(n + 1), 250);
    };
    waitAndInit();

    // Poll every 1.5 s to detect when ElevenLabs ends the call naturally
    const poll = setInterval(() => {
      if (!inCallRef.current) return;
      const sr = getEl()?.shadowRoot;
      if (sr && !sr.querySelector('[aria-label="End"]')) {
        inCallRef.current = false;
        window.dispatchEvent(new Event("rasoi-call-ended"));
      }
    }, 1500);

    const startCall = () => {
      if (inCallRef.current) return; // already in a call

      const el = getEl();
      const sr = el?.shadowRoot;
      if (!sr) return;

      // Expand the panel
      const launcher = sr.querySelector(".shadow-md.pointer-events-auto") as HTMLElement | null;
      if (launcher) launcher.click();
      document.dispatchEvent(new CustomEvent("elevenlabs-agent:expand", {
        detail: { action: "expand" },
        bubbles: true,
      }));

      // Click "Start a call" — stop retrying once clicked
      let clicked = false;
      const tryStart = (attempts = 0) => {
        if (clicked) return;
        const btn = sr.querySelector('[aria-label="Start a call"]') as HTMLElement | null;
        if (btn) {
          clicked = true;
          inCallRef.current = true;
          btn.click();
          window.dispatchEvent(new Event("rasoi-call-started"));
          return;
        }
        if (attempts < 25) setTimeout(() => tryStart(attempts + 1), 200);
      };
      setTimeout(() => tryStart(), 300);
    };

    const endCall = () => {
      const sr = getEl()?.shadowRoot;
      const btn = sr?.querySelector('[aria-label="End"]') as HTMLElement | null;
      if (btn) btn.click();
      inCallRef.current = false;
      window.dispatchEvent(new Event("rasoi-call-ended"));
    };

    window.addEventListener("rasoi-voice-trigger", startCall);
    window.addEventListener("rasoi-end-call",      endCall);
    return () => {
      window.removeEventListener("rasoi-voice-trigger", startCall);
      window.removeEventListener("rasoi-end-call",      endCall);
      clearInterval(poll);
    };
  }, []);

  const Widget = "elevenlabs-convai" as any;
  return <Widget agent-id={AGENT_ID} />;
}
