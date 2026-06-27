import { HistoryRecord } from "../types";
import { History, Trash2, CheckCircle, AlertTriangle, BarChart3, Database } from "lucide-react";

interface HistoryWidgetProps {
  history: HistoryRecord[];
  onClearHistory: () => void;
}

export default function HistoryWidget({ history, onClearHistory }: HistoryWidgetProps) {
  // Compute Stats
  const totalScans = history.length;
  const suitableCount = history.filter((item) =>
    item.status.toLowerCase().includes("sesuai")
  ).length;
  const unsuitableCount = totalScans - suitableCount;
  const suitabilityRate = totalScans > 0 ? Math.round((suitableCount / totalScans) * 100) : 0;

  return (
    <div className="bg-[#0c0c0e] text-[#d1d1d1] h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/[0.02] border-b border-white/5 px-5 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <History className="w-5 h-5 text-[#3b82f6]" />
          <div>
            <h3 className="font-extrabold text-xs tracking-widest text-white uppercase">REKOD AKTIIVITI & STATISTIK</h3>
            <p className="text-[9px] text-white/40 font-mono uppercase tracking-wider">Log Analisis AI Taharah</p>
          </div>
        </div>
        {totalScans > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[9px] uppercase tracking-wider bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2.5 py-1.5 rounded-lg transition font-bold flex items-center gap-1 border border-red-500/20 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" /> Padam Log
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
        {/* Statistics Dashboard Section */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center flex flex-col justify-center">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Jumlah Imbas</span>
            <p className="text-xl font-extrabold text-white mt-1">{totalScans}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center flex flex-col justify-center">
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Sesuai (Suci)</span>
            <p className="text-xl font-extrabold text-emerald-200 mt-1">{suitableCount}</p>
          </div>
          <div className="p-3 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-xl text-center flex flex-col justify-center">
            <span className="text-[9px] font-bold text-[#3b82f6] uppercase tracking-widest">Kadar Suci</span>
            <p className="text-xl font-extrabold text-white mt-1">{suitabilityRate}%</p>
          </div>
        </div>

        {/* Suitability mini progress chart */}
        {totalScans > 0 && (
          <div className="space-y-1 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
            <div className="flex justify-between items-center text-[9px] font-bold text-white/40 uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-[#3b82f6]" /> Pengedaran Keputusan
              </span>
              <span className="font-mono">{suitableCount} Suci • {unsuitableCount} Tidak Sesuai</span>
            </div>
            <div className="w-full h-3 bg-rose-950/40 rounded-full overflow-hidden flex border border-rose-500/20">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                style={{ width: `${suitabilityRate}%` }}
              />
            </div>
          </div>
        )}

        {/* History Records Table/List */}
        <div className="flex-1 flex flex-col min-h-[160px]">
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#3b82f6]" /> Rekod Log Terkini
          </span>

          {totalScans === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] border border-dashed border-white/10 rounded-xl">
              <History className="w-8 h-8 text-white/20 mb-2" />
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Tiada Aktiviti Dikesan</p>
              <p className="text-[9px] text-white/40 max-w-xs mt-1 uppercase tracking-wide">Lakukan imbasan objek pada widget pengimbas untuk merekod data analisis.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto border border-white/10 rounded-xl max-h-[220px] scrollbar-thin">
              <table className="min-w-full divide-y divide-white/10 text-xs">
                <thead className="bg-white/5 text-white/40 sticky top-0 font-bold uppercase tracking-widest text-[9px]">
                  <tr>
                    <th className="px-3 py-2 text-left">Objek</th>
                    <th className="px-3 py-2 text-left">Kategori Fiqh</th>
                    <th className="px-3 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#0c0c0e]">
                  {history.map((record) => {
                    const isSuitable = record.status.toLowerCase().includes("sesuai");
                    return (
                      <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-3 py-2 font-bold text-white max-w-[100px] truncate" title={record.objek}>
                          {record.objek}
                        </td>
                        <td className="px-3 py-2 text-white/60 font-medium uppercase tracking-wide">
                          {record.kategori}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                            isSuitable 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            {isSuitable ? (
                              <CheckCircle className="w-2.5 h-2.5" />
                            ) : (
                              <AlertTriangle className="w-2.5 h-2.5" />
                            )}
                            {isSuitable ? "Suci" : "Semak"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

