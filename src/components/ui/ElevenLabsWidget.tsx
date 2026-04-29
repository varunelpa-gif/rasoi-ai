"use client";
import { useEffect } from "react";

const WIDGET_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed@0.11.6/dist/index.js";
const AGENT_ID   = "agent_8001kqa0w3yhf98bxhtrsqxs09g5";

export default function ElevenLabsWidget() {
  useEffect(() => {
    if (!document.querySelector(`script[src="${WIDGET_SRC}"]`)) {
      const s = document.createElement("script");
      s.src   = WIDGET_SRC;
      s.async = true;
      s.type  = "text/javascript";
      document.head.appendChild(s);
    }

    const getEl = () => document.querySelector("elevenlabs-convai") as any;

    // Inject CSS to hide launcher bubble (visibility:hidden keeps .click() working)
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
        // Watch shadow DOM for call start/end (End button appearing = call active)
        watchCallState(el);
        return;
      }
      if (n < 40) setTimeout(() => injectStyle(el, n + 1), 250);
    };

    // MutationObserver: detect when "End" button appears/disappears
    let observer: MutationObserver | null = null;
    const watchCallState = (el: any) => {
      const sr = el.shadowRoot;
      if (!sr || observer) return;
      let wasInCall = false;
      observer = new MutationObserver(() => {
        const endBtn = sr.querySelector('[aria-label="End"]');
        const nowInCall = !!endBtn;
        if (nowInCall !== wasInCall) {
          wasInCall = nowInCall;
          window.dispatchEvent(new Event(nowInCall ? "rasoi-call-started" : "rasoi-call-ended"));
        }
      });
      observer.observe(sr, { childList: true, subtree: true, attributes: true });
    };

    // Wait for element then hide launcher + watch state
    const waitAndInit = (n = 0) => {
      const el = getEl();
      if (el) { injectStyle(el); return; }
      if (n < 40) setTimeout(() => waitAndInit(n + 1), 250);
    };
    waitAndInit();

    // Start call: expand panel then click "Start a call"
    const startCall = () => {
      const el = getEl();
      if (!el) return;
      const sr = el.shadowRoot;
      if (!sr) return;

      const launcher = sr.querySelector(".shadow-md.pointer-events-auto") as HTMLElement | null;
      if (launcher) launcher.click();

      document.dispatchEvent(new CustomEvent("elevenlabs-agent:expand", {
        detail: { action: "expand" },
        bubbles: true,
      }));

      const tryStart = (attempts = 0) => {
        const byLabel = sr.querySelector('[aria-label="Start a call"]') as HTMLElement | null;
        let byText: HTMLElement | null = null;
        for (const b of sr.querySelectorAll("button")) {
          if ((b as HTMLElement).textContent?.trim().toLowerCase().includes("start")) {
            byText = b as HTMLElement; break;
          }
        }
        const btn = byLabel ?? byText;
        if (btn) { btn.click(); return; }
        if (attempts < 30) setTimeout(() => tryStart(attempts + 1), 200);
      };
      setTimeout(() => tryStart(), 300);
    };

    // End call: click the "End" button in shadow DOM
    const endCall = () => {
      const el = getEl();
      const sr = el?.shadowRoot;
      if (!sr) return;
      const btn = sr.querySelector('[aria-label="End"]') as HTMLElement | null;
      if (btn) {
        btn.click();
        window.dispatchEvent(new Event("rasoi-call-ended"));
      }
    };

    window.addEventListener("rasoi-voice-trigger", startCall);
    window.addEventListener("rasoi-end-call",     endCall);
    return () => {
      window.removeEventListener("rasoi-voice-trigger", startCall);
      window.removeEventListener("rasoi-end-call",     endCall);
      observer?.disconnect();
    };
  }, []);

  const Widget = "elevenlabs-convai" as any;
  return <Widget agent-id={AGENT_ID} />;
}
