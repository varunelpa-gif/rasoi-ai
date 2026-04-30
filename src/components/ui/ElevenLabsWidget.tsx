"use client";
import { useEffect, useRef } from "react";

const AGENT_ID   = "agent_8001kqa0w3yhf98bxhtrsqxs09g5";
const IIFE_SRC   = "https://unpkg.com/@elevenlabs/client@1.3.1/dist/lib.iife.js";

declare global {
  interface Window {
    ElevenLabsClient?: {
      VoiceConversation: {
        startSession(opts: Record<string, unknown>): Promise<{
          endSession(): Promise<void>;
        }>;
      };
    };
  }
}

export default function ElevenLabsWidget() {
  const sessionRef  = useRef<{ endSession(): Promise<void> } | null>(null);
  const startingRef = useRef(false);

  useEffect(() => {
    // Load the self-contained IIFE bundle so Next.js bundling doesn't interfere
    // with AudioWorklet code paths.
    if (!document.querySelector(`script[src="${IIFE_SRC}"]`)) {
      const s = document.createElement("script");
      s.src = IIFE_SRC;
      s.async = false; // synchronous so it's ready before first trigger
      document.head.appendChild(s);
    }

    const getSDK = () => window.ElevenLabsClient?.VoiceConversation;

    const startCall = async () => {
      if (sessionRef.current || startingRef.current) return;
      const sdk = getSDK();
      if (!sdk) {
        // SDK not loaded yet — retry after 200 ms
        setTimeout(() => window.dispatchEvent(new Event("rasoi-voice-trigger")), 200);
        return;
      }
      startingRef.current = true;
      try {
        const session = await sdk.startSession({
          agentId: AGENT_ID,
          connectionType: "websocket",
          onStatusChange: ({ status }: { status: string }) => {
            if (status === "connecting") {
              window.dispatchEvent(new Event("rasoi-call-started"));
            } else if (status === "disconnected") {
              sessionRef.current  = null;
              startingRef.current = false;
              window.dispatchEvent(new Event("rasoi-call-ended"));
            }
          },
        });
        sessionRef.current  = session;
        startingRef.current = false;
      } catch (err) {
        console.error("[Rasoi] Voice session error:", err);
        sessionRef.current  = null;
        startingRef.current = false;
        window.dispatchEvent(new Event("rasoi-call-ended"));
      }
    };

    const endCall = async () => {
      startingRef.current = false;
      if (sessionRef.current) {
        await sessionRef.current.endSession().catch(() => {});
        sessionRef.current = null;
      }
      window.dispatchEvent(new Event("rasoi-call-ended"));
    };

    window.addEventListener("rasoi-voice-trigger", startCall);
    window.addEventListener("rasoi-end-call",      endCall);
    return () => {
      window.removeEventListener("rasoi-voice-trigger", startCall);
      window.removeEventListener("rasoi-end-call",      endCall);
      sessionRef.current?.endSession().catch(() => {});
    };
  }, []);

  return null;
}
