"use client";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { VoiceProvider } from "@/context/VoiceContext";
import ScreenSync from "./ScreenSync";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <VoiceProvider>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <ScreenSync />
          <Header />
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {children}
          </div>
        </div>
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 900 }}>
          <div style={{ background: "oklch(19% 0.04 55)", border: "1px solid oklch(30% 0.05 55)", borderRadius: 20, padding: "7px 16px", fontSize: 11, color: "oklch(45% 0.03 70)" }}>
            Press <kbd style={{ background: "oklch(27% 0.04 55)", border: "1px solid oklch(35% 0.04 55)", borderRadius: 4, padding: "1px 5px", fontSize: 10, fontFamily: "var(--ff-body)" }}>Space</kbd> or click mic to talk
          </div>
        </div>
      </div>
    </VoiceProvider>
  );
}
