"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ElevenLabsWidget from "@/components/ui/ElevenLabsWidget";

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
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
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
        <Header onMenuClick={() => setSidebarOpen(o => !o)} isMobile={isMobile} />
        <div className="page-content" style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {children}
        </div>
      </div>

      <ElevenLabsWidget />
    </div>
  );
}
