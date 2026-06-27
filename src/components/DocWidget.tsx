import { useState } from "react";
import { Terminal, Copy, Check, FileCode, Server, ListCollapse } from "lucide-react";

export default function DocWidget() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"html" | "css" | "express">("html");

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const htmlCode = `<!-- 1. Pasang kontainer di mana-mana bahagian badan HTML -->
<div id="ai-taharah-module"></div>

<!-- 2. Muat turun pustaka ikon Lucide & Confetti menerusi CDN -->
<script src="https://unpkg.com/lucide@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

<!-- 3. Masukkan skrip integrasi utama (ai-taharah-module.js) -->
<script src="js/ai-taharah-module.js" defer></script>`;

  const cssCode = `/* CSS Tambahan mikro untuk kesan imbasan laser & panel kaca */
@keyframes scan {
  0% { top: 0%; opacity: 1; }
  50% { top: 100%; opacity: 1; }
  100% { top: 0%; opacity: 1; }
}
.scan-line {
  position: absolute;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0));
  animation: scan 2.5s infinite linear;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.8);
}
.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}`;

  const expressCode = `// Backend Proxy Express (Mengelakkan pendedahan API Key kepada pelayar)
const { GoogleGenAI, Type } = require("@google/genai");
const express = require("express");
const app = express();

app.use(express.json({ limit: "10mb" }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/taharah/analyze", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { inlineData: { mimeType: mimeType || "image/jpeg", data: imageBase64 } },
        { text: "Lakukan analisis visual & Fiqh Taharah..." }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: { /* Sila rujuk fail jenis_skema di server.ts */ }
      }
    });
    res.json(JSON.parse(response.text.trim()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});`;

  return (
    <div className="bg-[#0c0c0e] text-[#d1d1d1] h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/[0.02] border-b border-white/5 px-5 py-4 text-white flex items-center gap-2.5">
        <Terminal className="w-5 h-5 text-[#3b82f6]" />
        <div>
          <h3 className="font-extrabold text-xs tracking-widest text-white uppercase">PANDUAN INTEGRASI MODUL</h3>
          <p className="text-[9px] text-white/40 font-mono uppercase tracking-wider">Langkah-langkah Memasang ke Web Anda</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1 border-b border-white/10">
        <button
          onClick={() => setActiveTab("html")}
          className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-lg flex items-center justify-center gap-1 transition ${
            activeTab === "html" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/80"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" /> HTML Client
        </button>
        <button
          onClick={() => setActiveTab("css")}
          className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-lg flex items-center justify-center gap-1 transition ${
            activeTab === "css" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/80"
          }`}
        >
          <ListCollapse className="w-3.5 h-3.5" /> CSS Reusable
        </button>
        <button
          onClick={() => setActiveTab("express")}
          className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-lg flex items-center justify-center gap-1 transition ${
            activeTab === "express" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/80"
          }`}
        >
          <Server className="w-3.5 h-3.5" /> Backend Proxy
        </button>
      </div>

      {/* Code Container */}
      <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[9px] font-bold text-white/40 uppercase tracking-widest">
            <span>Rujukan Kod ({activeTab.toUpperCase()})</span>
            <button
              onClick={() => {
                const code = activeTab === "html" ? htmlCode : activeTab === "css" ? cssCode : expressCode;
                copyToClipboard(code, activeTab);
              }}
              className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white/80 px-2 py-1.5 rounded-md transition border border-white/10 active:scale-95 text-[9px] uppercase font-bold tracking-wider"
            >
              {copiedSection === activeTab ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Berjaya!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#3b82f6]" /> Salin Kod
                </>
              )}
            </button>
          </div>

          <pre className="p-3 bg-[#050505] text-emerald-400 rounded-xl overflow-x-auto font-mono text-[9px] leading-relaxed border border-white/10 max-h-[170px] shadow-inner scrollbar-thin">
            <code>{activeTab === "html" ? htmlCode : activeTab === "css" ? cssCode : expressCode}</code>
          </pre>
        </div>

        {/* Footnote */}
        <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl mt-3 text-[9px] text-white/50 leading-relaxed uppercase tracking-wider">
          <strong>Tip Integrasi:</strong> Pastikan pelayan web anda mempunyai pembolehubah persekitaran <code className="bg-white/5 px-1 py-0.5 rounded text-white/80 font-mono">GEMINI_API_KEY</code> yang dikonfigurasikan dengan betul. Modul ini menyokong interaksi tanpa had dan mesra peranti mudah alih (responsive).
        </div>
      </div>
    </div>
  );
}

