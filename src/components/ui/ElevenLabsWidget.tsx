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

    const getEl  = () => document.querySelector("elevenlabs-convai") as any;
    const getSr  = () => getEl()?.shadowRoot as ShadowRoot | null;
    const showEl = () => { const e = getEl(); if (e) e.style.visibility = "visible"; };
    const hideEl = () => { const e = getEl(); if (e) e.style.visibility = "hidden";  };

    // With always-expanded the "Start a call" button is always in the DOM.
    // Retry in case the widget script hasn't fully initialised yet.
    const startCall = () => {
      if (inCallRef.current) return;
      const sr = getSr();
      if (!sr) return;

      showEl();

      const tryStart = (n = 0) => {
        if (inCallRef.current) return;
        const btn = sr.querySelector('[aria-label="Start a call"]') as HTMLElement | null;
        if (btn) {
          inCallRef.current = true;
          btn.click();
          window.dispatchEvent(new Event("rasoi-call-started"));
          return;
        }
        if (n < 30) setTimeout(() => tryStart(n + 1), 200);
        else hideEl(); // give up — hide if we couldn't start
      };
      tryStart();
    };

    const endCall = () => {
      const endBtn = getSr()?.querySelector('[aria-label="End"]') as HTMLElement | null;
      if (endBtn) endBtn.click();
      hideEl();
      inCallRef.current = false;
      window.dispatchEvent(new Event("rasoi-call-ended"));
    };

    // Detect when ElevenLabs ends the call naturally
    const poll = setInterval(() => {
      if (!inCallRef.current) return;
      if (!getSr()?.querySelector('[aria-label="End"]')) {
        hideEl();
        inCallRef.current = false;
        window.dispatchEvent(new Event("rasoi-call-ended"));
      }
    }, 1500);

    window.addEventListener("rasoi-voice-trigger", startCall);
    window.addEventListener("rasoi-end-call",      endCall);
    return () => {
      window.removeEventListener("rasoi-voice-trigger", startCall);
      window.removeEventListener("rasoi-end-call",      endCall);
      clearInterval(poll);
    };
  }, []);

  const Widget = "elevenlabs-convai" as any;
  return (
    <>
      {/* Hidden until mic is clicked; always-expanded keeps the panel rendered without a launcher */}
      <style>{`elevenlabs-convai { visibility: hidden; }`}</style>
      <Widget agent-id={AGENT_ID} always-expanded="true" />
    </>
  );
}
