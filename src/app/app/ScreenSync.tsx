"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useVoice } from "@/context/VoiceContext";

const SCREEN_MAP: Record<string, string> = {
  "/app/dashboard":  "dashboard",
  "/app/recipe":     "recipe",
  "/app/techniques": "techniques",
  "/app/timers":     "timers",
  "/app/inventory":  "inventory",
  "/app/menu":       "menu",
  "/app/staff":      "staff",
  "/app/suppliers":  "suppliers",
};

export default function ScreenSync() {
  const pathname = usePathname();
  const { setScreen } = useVoice();

  useEffect(() => {
    const screen = SCREEN_MAP[pathname] || "dashboard";
    setScreen(screen);
  }, [pathname, setScreen]);

  return null;
}
