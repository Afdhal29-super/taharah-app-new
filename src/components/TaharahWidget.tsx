import React, { useState, useRef, useEffect } from "react";
import { Camera, Image as ImageIcon, Disc, BrainCircuit, Volume2, VolumeX, ShieldAlert, Sparkles, AlertCircle, HelpCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { TaharahResult, HistoryRecord } from "../types";
import ConfettiCanvas from "./ConfettiCanvas";

interface TaharahWidgetProps {
  onScanCompleted: (record: HistoryRecord) => void;
}

// Beautiful high-quality royalty-free placeholder images for testing the model
const SAMPLES = [
  {
    name: "Air Jernih Paip",
    desc: "Sesuai untuk Wuduk",
    mime: "image/jpeg",
    url: "https://images.unsplash.com/photo-1548839130-3fd96cd5cb4f?q=80&w=600&auto=format&fit=crop",
    base64Placeholder: "" // We will handle fetching or we can convert sample click to an elegant local flow or pre-fill prompt
  },
  {
    name: "Minuman Teh Manis",
    desc: "Air Mutaghayyir",
    mime: "image/jpeg",
    url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Debu Tanah Bersih",
    desc: "Alat Tayammum",
    mime: "image/jpeg",
    url: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Air Mutanajjis",
    desc: "Kotor/Tercemar",
    mime: "image/jpeg",
    url: "https://images.unsplash.com/photo-1534951474654-87823058c487?q=80&w=600&auto=format&fit=crop"
  }
];

export default function TaharahWidget({ onScanCompleted }: TaharahWidgetProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMime, setSelectedMime] = useState<string>("image/jpeg");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState({ title: "", desc: "", progress: 0 });
  const [imageHint, setImageHint] = useState<string>("");
  
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedImageBase64, setCapturedImageBase64] = useState<string | null>(null);
  const [result, setResult] = useState<TaharahResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "error" | "info" } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const showToast = (message: string, type: "success" | "warning" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Convert image URL to base64 for sample testing
  const handleSelectSample = async (sample: typeof SAMPLES[0]) => {
    stopCamera();
    setResult(null);
    setIsScanning(true);
    setImageHint(sample.name);
    setLoadingStatus({ title: "Memuatkan Sampel...", desc: "Mengambil gambar daripada arkib awam.", progress: 30 });
    
    try {
      // Fetch via our server-side secure image proxy to bypass CORS
      const res = await fetch(`/api/taharah/sample-image?url=${encodeURIComponent(sample.url)}`);
      if (!res.ok) {
        throw new Error("Proxy fetch failed");
      }
      const data = await res.json();
      if (data.base64) {
        setSelectedImage(data.base64);
        setCapturedImageBase64(data.base64.split(",")[1]);
        setSelectedMime(sample.mime);
        setIsScanning(false);
        showToast(`Sampel "${sample.name}" dimuatkan! Sedia untuk diimbas.`, "success");
      } else {
        throw new Error("No base64 returned");
      }
    } catch (err) {
      console.warn("CORS limitation, downloading client-side failed. Injecting high-quality base64 mock...", err);
      // Fallback with visual representation, we can build a canvas-based representation to get real base64
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw colored placeholder
        const gradient = ctx.createLinearGradient(0, 0, 400, 400);
        if (sample.name.includes("Jernih")) {
          gradient.addColorStop(0, "#e0f2fe");
          gradient.addColorStop(1, "#38bdf8");
        } else if (sample.name.includes("Teh")) {
          gradient.addColorStop(0, "#fef3c7");
          gradient.addColorStop(1, "#d97706");
        } else if (sample.name.includes("Debu")) {
          gradient.addColorStop(0, "#f5e0c3");
          gradient.addColorStop(1, "#854d0e");
        } else {
          gradient.addColorStop(0, "#fca5a5");
          gradient.addColorStop(1, "#7f1d1d");
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 400);
        
        // Add text overlay for mock scanning
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(sample.name, 200, 180);
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "#475569";
        ctx.fillText(`(${sample.desc})`, 200, 210);
        
        const dataUrl = canvas.toDataURL("image/jpeg");
        setSelectedImage(dataUrl);
        setCapturedImageBase64(dataUrl.split(",")[1]);
        setSelectedMime("image/jpeg");
      }
      setIsScanning(false);
      showToast(`Sampel "${sample.name}" disimulasikan secara visual! Sedia untuk diimbas.`, "success");
    }
  };

  const startCamera = async () => {
    stopCamera();
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setSelectedImage(null);
      setCapturedImageBase64(null);
      showToast("Kamera peranti berjaya diaktifkan!", "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal mengakses kamera. Gunakan pilihan 'Pilih Fail' di bawah.", "error");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      
      setSelectedImage(dataUrl);
      setCapturedImageBase64(dataUrl.split(",")[1]);
      setSelectedMime("image/jpeg");
      setImageHint("Ambilan Kamera");
      stopCamera();
      showToast("Foto berjaya ditangkap!", "success");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    stopCamera();
    setResult(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedMime(file.type || "image/jpeg");
    setImageHint(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedImage(dataUrl);
      setCapturedImageBase64(dataUrl.split(",")[1]);
      showToast("Gambar berjaya dimuat naik!", "success");
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Realistic scanning progress labels
  const getStatusText = (progress: number) => {
    if (progress < 20) return { title: "Menganalisis Piksel...", desc: "Mengimbas struktur visual cecair." };
    if (progress < 50) return { title: "Menghubungi AI...", desc: "Mengirimkan ciri fizikal objek ke Google Gemini." };
    if (progress < 80) return { title: "Menilai Syarak...", desc: "Menimbang ciri-ciri mengikut kaedah Fiqh Taharah." };
    return { title: "Menyusun Penerangan...", desc: "Menjana panduan ringkas, cadangan dan amaran Fiqh." };
  };

  const startAnalysis = async () => {
    if (!capturedImageBase64) {
      showToast("Sila ambil gambar atau muat naik fail terlebih dahulu.", "warning");
      return;
    }

    setIsScanning(true);
    setResult(null);
    stopVoice();

    // Start progress simulation
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress >= 95) {
        currentProgress = 95;
        clearInterval(interval);
      }
      const texts = getStatusText(Math.floor(currentProgress));
      setLoadingStatus({
        title: texts.title,
        desc: texts.desc,
        progress: Math.floor(currentProgress),
      });
    }, 200);

    try {
      const response = await fetch("/api/taharah/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: capturedImageBase64,
          mimeType: selectedMime,
          hint: imageHint,
        }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ralat pelayan semasa menganalisis.");
      }

      const data: TaharahResult = await response.json();

      setLoadingStatus({
        title: "Selesai!",
        desc: "Maklumat analisis telah disusun.",
        progress: 100,
      });

      setTimeout(() => {
        setIsScanning(false);
        setResult(data);

        // Record history
        const record: HistoryRecord = {
          id: Math.random().toString(36).substring(2, 9),
          tarikh: new Date().toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit" }) + " | " + new Date().toLocaleDateString("ms-MY"),
          objek: data.objek,
          status: data.status_penggunaan,
          kategori: data.kategori_fiqh,
          keyakinan: data.keyakinan,
        };
        onScanCompleted(record);

        // Trigger confetti for suitable purification tools
        if (data.status_penggunaan.toLowerCase().includes("sesuai")) {
          setConfettiActive(true);
          showToast("Analisis Selesai! Objek sesuai digunakan untuk bersuci.", "success");
        } else {
          showToast("Analisis Selesai! Semak panduan penggunaan syarak.", "info");
        }

        // Auto-speak results
        speakResults(data);
      }, 500);

    } catch (err: any) {
      clearInterval(interval);
      setIsScanning(false);
      showToast(err.message || "Sambungan gagal. Sila cuba lagi.", "error");
    }
  };

  const speakResults = (data: TaharahResult) => {
    if (!synthRef.current) return;
    stopVoice();

    const ttsText = `Objek dikesan: ${data.objek}. Kategori Fiqh: ${data.kategori_fiqh}. Status penggunaan: ${data.status_penggunaan}. Analisis AI menunjukkan ${data.analisis_ai}.`;
    
    const utterance = new SpeechSynthesisUtterance(ttsText);
    utterance.lang = "ms-MY";
    
    // Find Malay or Indonesian voice
    const voices = synthRef.current.getVoices();
    const voice = voices.find(v => v.lang.includes("ms") || v.lang.includes("id")) || voices[0];
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = 0.95;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const stopVoice = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      stopVoice();
    } else if (result) {
      speakResults(result);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setCapturedImageBase64(null);
    setResult(null);
    stopVoice();
    stopCamera();
  };

  return (
    <div className="relative bg-[#0c0c0e] text-[#d1d1d1] h-full flex flex-col overflow-y-auto">
      {/* Dynamic Confetti Element */}
      <ConfettiCanvas active={confettiActive} onComplete={() => setConfettiActive(false)} />

      {/* Toast Notification */}
      {toast && (
        <div className={`absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-2xl text-xs font-semibold animate-bounce ${
          toast.type === "success" ? "bg-emerald-600 text-white" :
          toast.type === "warning" ? "bg-amber-500 text-slate-900" :
          toast.type === "error" ? "bg-red-600 text-white" : "bg-[#3b82f6] text-white"
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Widget Header */}
      <div className="bg-white/[0.02] border-b border-white/5 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-white/5 rounded-lg text-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.2)]">🕌</span>
          <div>
            <h3 className="font-extrabold text-xs tracking-widest text-white uppercase">SISTEM INTEGRASI TAHARAH</h3>
            <p className="text-[9px] text-white/40 font-mono uppercase tracking-wider">Ustaz Afdhal Irfan • Inovasi IPGKPP</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {result && (
            <button 
              onClick={handleReset}
              className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/60 hover:text-white"
              title="Semula"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <span className="px-2 py-0.5 bg-[#3b82f6]/20 text-[9px] font-mono font-bold rounded-full border border-[#3b82f6]/40 text-[#3b82f6] shadow-[0_0_6px_rgba(59,130,246,0.2)]">
            ONLINE
          </span>
        </div>
      </div>

      {/* Main Form/Preview Area */}
      <div className="p-4 flex-1 flex flex-col gap-4">
        
        {/* Visual Input Panel */}
        <div className="relative aspect-video w-full rounded-xl bg-[#050505] border border-white/10 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
          {cameraActive && (
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover" 
              playsInline 
              muted 
            />
          )}

          {selectedImage && !cameraActive && (
            <img 
              src={selectedImage} 
              alt="Pratonton" 
              className="w-full h-full object-cover"
            />
          )}

          {!selectedImage && !cameraActive && (
            <div className="text-center p-6 space-y-3">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-[#3b82f6] shadow-md border border-white/10">
                <Camera className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Ambil atau Pilih Gambar</p>
              <p className="text-[10px] text-white/40 max-w-xs mx-auto uppercase tracking-wide">Tangkap gambar bahan bersuci sedia ada menggunakan kamera atau pilih fail peranti.</p>
            </div>
          )}

          {/* Laser scan animation when loading */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent shadow-[0_0_12px_#3b82f6] laser-scan z-10" />
          )}
        </div>

        {/* Input Controls */}
        <div className="space-y-4">
          {/* Sample test buttons */}
          {!result && !isScanning && (
            <div>
              <p className="text-[9px] text-white/40 font-bold mb-2 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" /> Contoh Pantas Pengujian
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSample(sample)}
                    className="px-2 py-1.5 bg-white/5 border border-white/10 hover:border-[#3b82f6] hover:bg-[#3b82f6]/10 text-[10px] font-bold text-white/70 hover:text-white rounded-lg text-center transition uppercase tracking-wide"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            {cameraActive ? (
              <button
                onClick={capturePhoto}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition uppercase tracking-widest"
              >
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E" className="w-4 h-4 animate-pulse" alt="" /> Tangkap Gambar
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="flex-1 bg-[#3b82f6] hover:bg-[#5094ff] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(59,130,246,0.3)] active:scale-95 transition uppercase tracking-widest"
              >
                <Camera className="w-4 h-4" /> Gunakan Kamera
              </button>
            )}

            <button
              onClick={triggerFileSelect}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition uppercase tracking-widest"
            >
              <ImageIcon className="w-4 h-4" /> Pilih Fail
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </div>

          {/* Submit Action */}
          {selectedImage && !isScanning && !result && (
            <button
              onClick={startAnalysis}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 transition uppercase tracking-widest"
            >
              <BrainCircuit className="w-4 h-4" /> Imbas Sekarang & Analisis AI
            </button>
          )}
        </div>

        {/* Loading / Scanning state overlay */}
        {isScanning && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-10 h-10 border-4 border-white/10 border-t-[#3b82f6] rounded-full animate-spin" />
            <div>
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">{loadingStatus.title}</h4>
              <p className="text-[10px] text-white/40 uppercase mt-0.5 tracking-wide">{loadingStatus.desc}</p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 max-w-xs overflow-hidden">
              <div 
                className="bg-[#3b82f6] h-full transition-all duration-300 shadow-[0_0_8px_#3b82f6]"
                style={{ width: `${loadingStatus.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Analysis Result Card */}
        {result && (
          <div className="space-y-4 border-t border-white/10 pt-4 animate-fade-in">
            {/* Header info card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-inner">
              <div>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Objek Dikesan</span>
                <h4 className="font-extrabold text-sm text-white uppercase tracking-wide">{result.objek}</h4>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                result.status_penggunaan.toLowerCase().includes("tidak sesuai") 
                  ? "bg-red-500/10 border border-red-500/20 text-red-400" 
                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
              }`}>
                {result.status_penggunaan}
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-center">
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Kategori Fiqh</span>
                <p className="text-xs font-bold text-white uppercase mt-0.5 tracking-wide">{result.kategori_fiqh}</p>
              </div>
              <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-center">
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Keyakinan AI</span>
                <p className="text-xs font-bold text-[#3b82f6] mt-0.5">{result.keyakinan}</p>
              </div>
            </div>

            {/* AI observations */}
            <div className="space-y-1">
              <h5 className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Pemerhatian Visual AI</h5>
              <p className="text-xs text-white/70 leading-relaxed bg-white/[0.02] p-2.5 rounded-lg border border-white/5">{result.analisis_ai}</p>
            </div>

            {/* Educational content tab */}
            <div className="space-y-1 border-l-2 border-[#3b82f6] pl-2.5 py-0.5">
              <h5 className="text-[9px] font-bold text-[#3b82f6] uppercase tracking-widest flex items-center gap-1">
                📚 Pengajaran Syarak (Pendidikan)
              </h5>
              <p className="text-xs text-white/80 leading-relaxed">{result.penerangan_pendidikan}</p>
            </div>

            {/* Action / Warning split box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <h6 className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tindakan
                </h6>
                <p className="text-[10px] text-white/80 leading-relaxed">{result.cadangan}</p>
              </div>
              <div className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                <h6 className="text-[9px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Batasan AI
                </h6>
                <p className="text-[10px] text-white/80 leading-relaxed">{result.amaran}</p>
              </div>
            </div>

            {/* Voice player bar */}
            <div className="p-2 bg-white/5 rounded-xl flex items-center justify-between border border-white/5">
              <button
                onClick={toggleVoice}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg transition uppercase tracking-wide"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Hentikan Suara
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#3b82f6]" /> Dengar Suara AI
                  </>
                )}
              </button>
              <span className="text-[9px] text-white/30 uppercase tracking-wider font-mono">TTS Malaya</span>
            </div>

            {/* Core disclaimer */}
            <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-lg flex gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-wider">
                <strong>Penafian:</strong> AI ini dibina khas untuk tujuan bimbingan pembelajaran Pendidikan Fiqh Taharah IPG/KPM. Penilaian muktamad air bersuci hendaklah sentiasa berpandukan penilaian deria fizikal sedia ada mengikut hukum syarak tradisional.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

