"use client";
import { useEffect, useRef } from "react";
import { VoiceConversation } from "@elevenlabs/client";

const AGENT_ID = "agent_8001kqa0w3yhf98bxhtrsqxs09g5";

export default function ElevenLabsWidget() {
  const sessionRef  = useRef<VoiceConversation | null>(null);
  const startingRef = useRef(false);

  useEffect(() => {
    const startCall = async () => {
      if (sessionRef.current || startingRef.current) return;
      startingRef.current = true;
      try {
        const session = await VoiceConversation.startSession({
          agentId: AGENT_ID,
          onStatusChange: ({ status }) => {
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
