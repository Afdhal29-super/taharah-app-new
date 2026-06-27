import React, { useState, useEffect } from "react";
import { Sparkles, Layout, Grid, RefreshCw, Layers, Plus, Minimize2, Maximize2, X, Info } from "lucide-react";
import { Widget, HistoryRecord } from "../types";
import TaharahWidget from "./TaharahWidget";
import GuideWidget from "./GuideWidget";
import HistoryWidget from "./HistoryWidget";
import DocWidget from "./DocWidget";

export default function DashboardCanvas() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "widget-taharah", title: "AI Smart Taharah", x: 0, y: 0, w: 2, h: 2, type: "taharah" },
    { id: "widget-guide", title: "Silibus Rujukan", x: 2, y: 0, w: 1, h: 1, type: "guide" },
    { id: "widget-history", title: "Aktiviti & Log", x: 2, y: 1, w: 1, h: 1, type: "history" },
    { id: "widget-docs", title: "Panduan Integrasi", x: 0, y: 2, w: 3, h: 1, type: "stats" }, // We map stats type to integration guide
  ]);

  const [removedWidgets, setRemovedWidgets] = useState<Widget[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  // Load initial history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("taharah_dashboard_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveHistory = (newHistory: HistoryRecord[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("taharah_dashboard_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error(e);
    }
  };

  const handleScanCompleted = (record: HistoryRecord) => {
    const updated = [record, ...history].slice(0, 30);
    saveHistory(updated);
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  // HTML5 Native Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    // Set a transparent ghost image to look premium
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      setDropTargetId(targetId);
    }
  };

  const handleDragEnd = () => {
    if (draggedId && dropTargetId) {
      // Swap widget positions in array
      const draggedIdx = widgets.findIndex((w) => w.id === draggedId);
      const targetIdx = widgets.findIndex((w) => w.id === dropTargetId);
      
      if (draggedIdx !== -1 && targetIdx !== -1) {
        const updated = [...widgets];
        const temp = updated[draggedIdx];
        updated[draggedIdx] = updated[targetIdx];
        updated[targetIdx] = temp;
        setWidgets(updated);
      }
    }
    setDraggedId(null);
    setDropTargetId(null);
  };

  const handleRemoveWidget = (id: string) => {
    const widgetToRemove = widgets.find((w) => w.id === id);
    if (widgetToRemove) {
      setWidgets(widgets.filter((w) => w.id !== id));
      setRemovedWidgets([...removedWidgets, widgetToRemove]);
    }
  };

  const handleRestoreWidget = (widget: Widget) => {
    setWidgets([...widgets, widget]);
    setRemovedWidgets(removedWidgets.filter((w) => w.id !== widget.id));
  };

  const handleResetLayout = () => {
    setWidgets([
      { id: "widget-taharah", title: "AI Smart Taharah", x: 0, y: 0, w: 2, h: 2, type: "taharah" },
      { id: "widget-guide", title: "Silibus Rujukan", x: 2, y: 0, w: 1, h: 1, type: "guide" },
      { id: "widget-history", title: "Aktiviti & Log", x: 2, y: 1, w: 1, h: 1, type: "history" },
      { id: "widget-docs", title: "Panduan Integrasi", x: 0, y: 2, w: 3, h: 1, type: "stats" },
    ]);
    setRemovedWidgets([]);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-6 bg-[#050505] min-h-0">
      
      {/* Sidebar Control Panel (Sophisticated Dark) */}
      <div className="w-full md:w-64 bg-[#0a0a0c] rounded-2xl border border-white/10 p-5 flex flex-col gap-5 shrink-0 shadow-2xl">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Layout className="w-3.5 h-3.5 text-[#3b82f6]" /> WORKSPACE CANVAS
          </span>
          <h2 className="text-sm font-extrabold tracking-widest text-white uppercase mt-1">KONTROL PANEL</h2>
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">Susun & konfigurasi widget secara drag-and-drop.</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Restore list of removed widgets */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#3b82f6]" /> Senarai Widget
          </h4>
          
          <div className="space-y-2">
            {widgets.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white/80"
              >
                <span>{w.title}</span>
                <span className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.8)]" title="Aktif di Canvas" />
              </div>
            ))}

            {removedWidgets.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 border-dashed rounded-xl text-xs font-semibold text-white/40"
              >
                <span>{w.title}</span>
                <button
                  onClick={() => handleRestoreWidget(w)}
                  className="p-1.5 hover:bg-white/10 text-[#3b82f6] hover:text-[#5094ff] rounded-lg transition"
                  title="Tambah ke Canvas"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Reset layout */}
        <div className="mt-auto space-y-3">
          <button
            onClick={handleResetLayout}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#3b82f6]/10 border border-[#3b82f6]/30 hover:bg-[#3b82f6]/20 text-white text-xs font-bold rounded-xl transition shadow-[0_0_12px_rgba(59,130,246,0.1)] active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Tetapkan Semula Layout
          </button>
          
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 flex gap-2">
            <Info className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
            <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-wide">
              <strong>Tip Pintar:</strong> Seret (drag) bar tajuk mana-mana widget untuk menyusun kedudukan mengikut keperluan PdP anda.
            </p>
          </div>
        </div>
      </div>

      {/* Main Canvas Grid */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        
        {/* Grid Container */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 items-start auto-rows-max">
          {widgets.map((widget) => {
            const isDraggingThis = draggedId === widget.id;
            const isTargetThis = dropTargetId === widget.id;

            return (
              <div
                key={widget.id}
                draggable
                onDragStart={(e) => handleDragStart(e, widget.id)}
                onDragOver={(e) => handleDragOver(e, widget.id)}
                onDragEnd={handleDragEnd}
                className={`group bg-[#0c0c0e] rounded-2xl border transition-all duration-300 flex flex-col shadow-2xl select-none ${
                  widget.type === "taharah" ? "md:col-span-2" : "md:col-span-1"
                } ${isDraggingThis ? "opacity-30 scale-[0.98] border-dashed border-[#3b82f6]" : "border-white/10"} ${
                  isTargetThis ? "ring-2 ring-[#3b82f6] scale-[1.01] shadow-[0_0_15px_rgba(59,130,246,0.3)]" : ""
                }`}
                style={{ cursor: "grab" }}
              >
                {/* Drag Handle Top Bar */}
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 rounded-t-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5 opacity-30 group-hover:opacity-100 transition">
                      <div className="flex gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-[#3b82f6]" />
                        <span className="w-1 h-1 rounded-full bg-[#3b82f6]" />
                      </div>
                      <div className="flex gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-[#3b82f6]" />
                        <span className="w-1 h-1 rounded-full bg-[#3b82f6]" />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                      {widget.title}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveWidget(widget.id)}
                    className="p-1 hover:bg-white/10 text-white/30 hover:text-white rounded transition"
                    title="Keluarkan"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Widget Component Body */}
                <div className="flex-1 min-h-[350px] md:min-h-[460px]">
                  {widget.type === "taharah" && (
                    <TaharahWidget onScanCompleted={handleScanCompleted} />
                  )}
                  {widget.type === "guide" && <GuideWidget />}
                  {widget.type === "history" && (
                    <HistoryWidget history={history} onClearHistory={handleClearHistory} />
                  )}
                  {widget.type === "stats" && <DocWidget />}
                </div>
              </div>
            );
          })}

          {widgets.length === 0 && (
            <div className="col-span-3 py-20 bg-[#0c0c0e] border border-dashed border-white/10 rounded-2xl text-center p-6 space-y-3">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/40 shadow-inner">
                <Grid className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-white uppercase tracking-widest text-sm">Canvas Kosong</h3>
              <p className="text-xs text-white/40 max-w-xs mx-auto">Sila tambah widget semula dari kontrol panel di bahagian kiri untuk mula menyusun.</p>
              <button
                onClick={handleResetLayout}
                className="inline-flex items-center gap-1.5 bg-[#3b82f6] hover:bg-[#5094ff] text-white font-bold text-xs py-2 px-4 rounded-xl shadow-lg transition"
              >
                Muat Layout Laluan
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
