"use client";
import { useEffect } from "react";

// Pinned to the version installed in node_modules
const WIDGET_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed@0.11.6/dist/index.js";
const AGENT_ID   = "agent_8001kqa0w3yhf98bxhtrsqxs09g5";

export default function ElevenLabsWidget() {
  useEffect(() => {
    // Load the widget script (pinned version)
    if (!document.querySelector(`script[src="${WIDGET_SRC}"]`)) {
      const s = document.createElement("script");
      s.src   = WIDGET_SRC;
      s.async = true;
      s.type  = "text/javascript";
      document.head.appendChild(s);
    }

    // Inject CSS into shadow DOM once it's available.
    // Use visibility:hidden (not display:none) so programmatic .click() still works.
    const injectStyle = (el: any, n = 0) => {
      const sr = el.shadowRoot;
      if (sr) {
        if (!sr.querySelector("#rasoi-style")) {
          const style = document.createElement("style");
          style.id = "rasoi-style";
          // Launcher = shadow-md; panel = shadow-lg — hide only launcher
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

    const getEl = () => document.querySelector("elevenlabs-convai") as any;

    // Wait for the custom element to appear, then hide its launcher
    const waitAndHide = (n = 0) => {
      const el = getEl();
      if (el) { injectStyle(el); return; }
      if (n < 40) setTimeout(() => waitAndHide(n + 1), 250);
    };
    waitAndHide();

    const trigger = () => {
      const el = getEl();
      if (!el) return;
      const sr = el.shadowRoot;
      if (!sr) return;

      // Step 1 — click the (hidden) launcher; its onClick handler toggles expanded state
      const launcher = sr.querySelector(".shadow-md.pointer-events-auto") as HTMLElement | null;
      if (launcher) launcher.click();

      // Step 1b — also fire the expand event as a belt-and-suspenders
      document.dispatchEvent(new CustomEvent("elevenlabs-agent:expand", {
        detail: { action: "expand" },
        bubbles: true,
      }));

      // Step 2 — once the panel renders, click "Start a call"
      const tryStart = (attempts = 0) => {
        const byLabel = sr.querySelector('[aria-label="Start a call"]') as HTMLElement | null;
        let byText: HTMLElement | null = null;
        for (const b of sr.querySelectorAll("button")) {
          if ((b as HTMLElement).textContent?.trim().toLowerCase().includes("start")) {
            byText = b as HTMLElement;
            break;
          }
        }
        const btn = byLabel ?? byText;

        if (btn) { btn.click(); return; }
        if (attempts < 30) setTimeout(() => tryStart(attempts + 1), 200);
      };
      setTimeout(() => tryStart(), 300);
    };

    window.addEventListener("rasoi-voice-trigger", trigger);
    return () => window.removeEventListener("rasoi-voice-trigger", trigger);
  }, []);

  const Widget = "elevenlabs-convai" as any;
  return <Widget agent-id={AGENT_ID} />;
}
