import { useState } from "react";
import { BookOpen, Sparkles, HelpCircle } from "lucide-react";

const CATEGORIES = [
  {
    title: "Air Mutlak",
    status: "Suci & Menyucikan",
    desc: "Air suci dari sifat asal kejadiannya yang belum digunakan untuk mengangkat hadas atau bercampur najis. Boleh digunakan untuk berwuduk, mandi wajib, dan menghilangkan najis.",
    examples: "Air hujan, air paip, air laut, air perigi, air salji, air embun, air mata air.",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]",
  },
  {
    title: "Air Musta'mal",
    status: "Suci tetapi Tidak Menyucikan",
    desc: "Air yang telah digunakan untuk membasuh anggota fardhu wuduk atau mandi wajib, dan kuantitinya kurang dari dua qullah (sekitar 270 liter). Ia suci tetapi tidak sah digunakan untuk bersuci semula.",
    examples: "Titisan air wuduk bekas basuhan wajah yang tertadah dalam besen kecil.",
    badgeColor: "bg-blue-500/10 text-[#3b82f6] border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.1)]",
  },
  {
    title: "Air Mutaghayyir",
    status: "Suci tetapi Tidak Menyucikan (Bercampur)",
    desc: "Air mutlak yang telah bercampur dengan benda suci yang lain (seperti sirap, kopi, gula, sabun) hingga mengubah salah satu tiga sifat utamanya (warna, bau, atau rasa) secara ketara.",
    examples: "Air teh, kopi, sirap mawar, jus oren, air sabun mandi.",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    title: "Air Mutanajjis",
    status: "Tidak Suci & Tidak Menyucikan",
    desc: "Air yang kurang dua qullah yang dimasuki najis walaupun tidak berubah sifat, ATAU air melebihi dua qullah yang dimasuki najis dan berubah warna, bau, atau rasanya.",
    examples: "Air dalam baldi kecil yang terkena titisan air kencing atau tahi binatang.",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.1)]",
  },
  {
    title: "Alat Tayammum (Debu)",
    status: "Alat Pengganti Wuduk/Mandi",
    desc: "Debu tanah yang suci daripada sebarang najis, kering, dan tidak bercampur dengan tepung atau pasir kasar. Digunakan untuk menyapu muka dan kedua belah tangan bagi menggantikan wuduk apabila ketiadaan air.",
    examples: "Debu tanah bukit kering, debu bersih pada dinding bata atau perabot.",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
];

export default function GuideWidget() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  return (
    <div className="bg-[#0c0c0e] text-[#d1d1d1] h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/[0.02] border-b border-white/5 px-5 py-4 flex items-center gap-2.5">
        <BookOpen className="w-5 h-5 text-[#3b82f6]" />
        <div>
          <h3 className="font-extrabold text-xs tracking-widest text-white uppercase">RUJUKAN SILIBUS TAHARAH</h3>
          <p className="text-[9px] text-white/40 font-mono uppercase tracking-wider">Silibus Pendidikan Islam Fiqh KPM / IPG</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
        {/* Navigation Dots/Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-white/5 scrollbar-thin">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition whitespace-nowrap shrink-0 border uppercase tracking-wider ${
                selectedIdx === idx
                  ? "bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                  : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Selected Category Details */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-extrabold text-sm text-white uppercase tracking-wide">
                {CATEGORIES[selectedIdx].title}
              </h4>
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider ${CATEGORIES[selectedIdx].badgeColor}`}>
                {CATEGORIES[selectedIdx].status}
              </span>
            </div>

            <p className="text-xs text-white/80 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
              {CATEGORIES[selectedIdx].desc}
            </p>

            <div className="space-y-1">
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3b82f6] animate-pulse" /> Contoh Lazim / Terkemuka
              </span>
              <p className="text-xs text-white font-semibold bg-white/5 p-2.5 rounded-lg border border-white/10 leading-relaxed">
                {CATEGORIES[selectedIdx].examples}
              </p>
            </div>
          </div>

          {/* Quick Learning Note */}
          <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex gap-2.5">
            <HelpCircle className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                Nota Fiqh Ringkas
              </p>
              <p className="text-[9px] text-white/50 leading-relaxed uppercase tracking-wide">
                Hukum bersuci dikategorikan mengikut keadaan mutlak air atau kesucian alat pengganti debu/tanah. Sentiasa pastikan kesahihan wuduk sebelum menunaikan solat fardhu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

