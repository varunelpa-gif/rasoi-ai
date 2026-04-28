"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { VoiceProvider } from "@/context/VoiceContext";
import ScreenSync from "./ScreenSync";
import VoiceOrb from "@/components/ui/VoiceOrb";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <VoiceProvider>
      <VoiceOrb />
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* Mobile backdrop */}
        {isMobile && sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar — always on desktop, drawer on mobile */}
        {isMobile ? (
          sidebarOpen && (
            <div className="sidebar-drawer">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          )
        ) : (
          <Sidebar />
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <ScreenSync />
          <Header onMenuClick={() => setSidebarOpen(o => !o)} isMobile={isMobile} />
          <div className="page-content" style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {children}
          </div>
        </div>

        {!isMobile && (
          <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 900 }}>
            <div style={{ background: "oklch(19% 0.04 55)", border: "1px solid oklch(30% 0.05 55)", borderRadius: 20, padding: "7px 16px", fontSize: 11, color: "oklch(45% 0.03 70)" }}>
              Press <kbd style={{ background: "oklch(27% 0.04 55)", border: "1px solid oklch(35% 0.04 55)", borderRadius: 4, padding: "1px 5px", fontSize: 10, fontFamily: "var(--ff-body)" }}>Space</kbd> or click mic to talk
            </div>
          </div>
        )}
      </div>
    </VoiceProvider>
  );
}
