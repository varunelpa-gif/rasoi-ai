"use client";
import { useEffect } from "react";


export default function ElevenLabsWidget() {
  useEffect(() => {
    if (document.querySelector('script[src*="elevenlabs"]')) return;
    const s = document.createElement("script");
    s.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    s.async = true;
    s.type = "text/javascript";
    document.head.appendChild(s);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Widget = "elevenlabs-convai" as any;
  return <Widget agent-id="agent_8001kqa0w3yhf98bxhtrsqxs09g5" />;
}
