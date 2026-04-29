"use client";
import { useEffect, useRef } from "react";

const WIDGET_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed@0.11.6/dist/index.js";
const AGENT_ID   = "agent_8001kqa0w3yhf98bxhtrsqxs09g5";

export default function ElevenLabsWidget() {
  const inCallRef    = useRef(false);
  const seenEndRef   = useRef(false);   // tracks whether "End" btn appeared this call

  useEffect(() => {
    if (!document.querySelector(`script[src="${WIDGET_SRC}"]`)) {
      const s = document.createElement("script");
      s.src   = WIDGET_SRC;
      s.async = true;
      s.type  = "text/javascript";
      document.head.appendChild(s);
    }

    const getEl = () => document.querySelector("elevenlabs-convai") as any;
    const getSr = () => getEl()?.shadowRoot as ShadowRoot | null;

    const startCall = () => {
      if (inCallRef.current) return;
      const sr = getSr();
      if (!sr) return;

      seenEndRef.current = false;

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
      };
      tryStart();
    };

    const endCall = () => {
      const endBtn = getSr()?.querySelector('[aria-label="End"]') as HTMLElement | null;
      if (endBtn) endBtn.click();
      inCallRef.current = false;
      seenEndRef.current = false;
      window.dispatchEvent(new Event("rasoi-call-ended"));
    };

    // Only fire "call ended" after we've actually seen the "End" button appear,
    // preventing false positives during the brief connecting phase.
    const poll = setInterval(() => {
      if (!inCallRef.current) return;
      const hasEnd = !!getSr()?.querySelector('[aria-label="End"]');
      if (hasEnd) {
        seenEndRef.current = true;
      } else if (seenEndRef.current) {
        inCallRef.current  = false;
        seenEndRef.current = false;
        window.dispatchEvent(new Event("rasoi-call-ended"));
      }
    }, 1000);

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
      {/* opacity:0 keeps element rendered so .click() fires; pointer-events:none hides from users */}
      <style>{`elevenlabs-convai { opacity: 0 !important; pointer-events: none !important; }`}</style>
      <Widget agent-id={AGENT_ID} />
    </>
  );
}
