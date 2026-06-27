import DashboardCanvas from "./components/DashboardCanvas";
import { Sparkles, Compass, HelpCircle } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col font-sans antialiased text-[#d1d1d1]">
      
      {/* Dynamic Top Navigation Bar with Sophisticated Dark style */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0c0c0e] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-wider text-sm uppercase text-white">
                AI SMART TAHARAH ASSISTANT
              </span>
              <span className="text-[10px] text-white/30 font-mono">v1.1.0</span>
            </div>
            <p className="text-[9px] text-white/40 uppercase tracking-widest hidden sm:block">
              Inovasi PdP Fiqh • Ustaz Afdhal Irfan • IPG Kampus Pulau Pinang
            </p>
          </div>
        </div>

        {/* Global Action / Quick Info Badges matching the design specs */}
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest">
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 border border-white/10 rounded bg-white/5 text-white/60">
            <Compass className="w-3 h-3 text-[#3b82f6]" />
            <span>KPM & IPG SYARAK</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 border border-[#3b82f6]/30 rounded bg-[#3b82f6]/10 text-white font-semibold shadow-[0_0_8px_rgba(59,130,246,0.2)]">
            <Sparkles className="w-3 h-3 text-[#3b82f6] animate-pulse" />
            <span>GEMINI VISION ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Drag-and-Drop Workspace Canvas Area with dot matrix background */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }}></div>
        <DashboardCanvas />
      </main>

      {/* Institutional Footer */}
      <footer className="h-12 border-t border-white/10 bg-[#0c0c0e] px-6 text-[10px] uppercase tracking-wider text-white/40 flex items-center justify-between">
        <p className="hidden md:block">© 2026 AI Smart Taharah Assistant. Hak Cipta Terpelihara.</p>
        <div className="flex gap-4 items-center">
          <a href="#taharah" className="hover:text-white transition flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Bantuan
          </a>
          <span className="text-white/10">|</span>
          <span>IPG Kampus Pulau Pinang (IPGKPP)</span>
        </div>
      </footer>

    </div>
  );
}

