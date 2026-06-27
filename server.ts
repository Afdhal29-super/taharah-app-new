import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase JSON body limit for Base64 images
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Lazy load or safely check Gemini API Key
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Route for Taharah Image Analysis
app.post("/api/taharah/analyze", async (req, res) => {
  try {
    const { imageBase64, mimeType, hint } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image base64 data provided" });
    }

    // Elegant Sandbox Heuristic/Simulated Fallback if GEMINI_API_KEY is missing
    if (!process.env.GEMINI_API_KEY) {
      console.warn("[Taharah Server] GEMINI_API_KEY is missing. Running smart Fiqh simulation mode...");
      
      const lowercaseHint = (hint || "").toLowerCase();
      
      if (lowercaseHint.includes("jernih") || lowercaseHint.includes("mutlak") || lowercaseHint.includes("paip")) {
        return res.json({
          objek: "Air Jernih Paip (Simulasi)",
          jenis_objek: "Cecair Jernih",
          kategori_fiqh: "Air Mutlak",
          status_penggunaan: "Sesuai untuk Berwuduk & Mandi Wajib",
          keyakinan: "98% (Mod Simulasi)",
          analisis_ai: "Cecair jernih, tidak berwarna, bebas daripada sebarang keladak atau perubahan warna fizikal yang ketara. Bekas bersih.",
          penerangan_pendidikan: "Air Mutlak ialah air yang suci lagi menyucikan. Air ini berada pada sifat asal kejadiannya (seperti air paip, air hujan, air perigi) dan belum digunakan untuk mengangkat hadas (wuduk/mandi) serta tidak bercampur najis.",
          cadangan: "Air ini sangat sesuai dan sah digunakan untuk semua jenis bersuci (wuduk, mandi wajib, menghilangkan najis pada pakaian/peranti).",
          amaran: "⚠️ MOD SIMULASI: Kunci API Gemini tiada dalam Secrets. Sila konfigurasikan GEMINI_API_KEY untuk analisis real-time pintar yang sebenar."
        });
      } else if (lowercaseHint.includes("teh") || lowercaseHint.includes("sirap") || lowercaseHint.includes("mutaghayyir") || lowercaseHint.includes("manis")) {
        return res.json({
          objek: "Minuman Teh Manis (Simulasi)",
          jenis_objek: "Cecair Berwarna",
          kategori_fiqh: "Air Mutaghayyir / Mukhalit",
          status_penggunaan: "Tidak Sesuai untuk Bersuci",
          keyakinan: "96% (Mod Simulasi)",
          analisis_ai: "Cecair berwarna coklat kemerahan, lut sinar sederhana, dikenal pasti sebagai teh atau minuman berperisa manis. Mengalami perubahan warna dan bau sepenuhnya.",
          penerangan_pendidikan: "Air Mutaghayyir ialah air mutlak yang telah bercampur dengan benda suci lain (seperti teh, kopi, sirap) hingga mengubah warna, bau, atau rasa asalnya secara ketara. Hukumnya suci (boleh diminum) tetapi tidak menyucikan (tidak sah wuduk/mandi).",
          cadangan: "Boleh diminum atau digunakan untuk masakan, tetapi TIDAK SAH digunakan untuk berwuduk atau menghilangkan najis.",
          amaran: "⚠️ MOD SIMULASI: Kunci API Gemini tiada dalam Secrets. Sila konfigurasikan GEMINI_API_KEY untuk analisis real-time pintar yang sebenar."
        });
      } else if (lowercaseHint.includes("debu") || lowercaseHint.includes("tanah") || lowercaseHint.includes("tayammum")) {
        return res.json({
          objek: "Debu Tanah Bersih (Simulasi)",
          jenis_objek: "Debu Kering",
          kategori_fiqh: "Alat Tayammum",
          status_penggunaan: "Sesuai untuk Tayammum",
          keyakinan: "95% (Mod Simulasi)",
          analisis_ai: "Zarah halus debu tanah berwarna coklat muda, kering, bebas daripada sampah, kerikil kasar, atau tanda-tanda kelembapan basah.",
          penerangan_pendidikan: "Debu tanah yang bersih dan kering merupakan alat bersuci alternatif untuk Tayammum apabila tiada air atau uzur syarak. Debu mestilah tulen (tidak bercampur tepung atau pasir kasar).",
          cadangan: "Gunakan debu tanah bersih ini untuk disapu ke wajah dan kedua belah tangan hingga ke siku dengan niat Tayammum yang sah.",
          amaran: "⚠️ MOD SIMULASI: Kunci API Gemini tiada dalam Secrets. Sila konfigurasikan GEMINI_API_KEY untuk analisis real-time pintar yang sebenar."
        });
      } else if (lowercaseHint.includes("mutanajjis") || lowercaseHint.includes("kotor") || lowercaseHint.includes("cemar")) {
        return res.json({
          objek: "Air Kotor Tercemar (Simulasi)",
          jenis_objek: "Cecair Tercemar / Kotor",
          kategori_fiqh: "Air Mutanajjis",
          status_penggunaan: "Tidak Sesuai untuk Bersuci",
          keyakinan: "94% (Mod Simulasi)",
          analisis_ai: "Cecair kelihatan keruh dengan mendapan keladak, warna kekuningan/keabu-abuan, bertakung di kawasan terbuka terdedah kepada pencemaran najis visual.",
          penerangan_pendidikan: "Air Mutanajjis ialah air kurang dua qullah yang dimasuki najis (walaupun tiada perubahan sifat), atau air lebih dua qullah yang berubah salah satu sifat asalnya (warna, bau, rasa) akibat kemasukan najis.",
          cadangan: "Air ini haram digunakan untuk bersuci, memasak, atau diminum. Hendaklah dijauhi daripada menyentuh badan atau pakaian solat.",
          amaran: "⚠️ MOD SIMULASI: Kunci API Gemini tiada dalam Secrets. Sila konfigurasikan GEMINI_API_KEY untuk analisis real-time pintar yang sebenar."
        });
      } else {
        // Fallback simulation based on basic heuristics (e.g., base64 length properties)
        const isOdd = imageBase64.length % 2 === 0;
        return res.json({
          objek: isOdd ? "Air Paip Jernih (Simulasi)" : "Air Minuman Manis (Simulasi)",
          jenis_objek: isOdd ? "Cecair Jernih" : "Cecair Berwarna",
          kategori_fiqh: isOdd ? "Air Mutlak" : "Air Mutaghayyir / Mukhalit",
          status_penggunaan: isOdd ? "Sesuai untuk Berwuduk & Mandi Wajib" : "Tidak Sesuai untuk Bersuci",
          keyakinan: "90% (Mod Simulasi Heuristik)",
          analisis_ai: "Cecair tersimulasi dikesan sebagai cecair bersih tanpa pencemaran visual ketara dalam takungan peranti.",
          penerangan_pendidikan: "Dalam kaedah Fiqh, air yang jernih dan bersih dihukumkan sebagai suci lagi menyucikan (Air Mutlak) selagi tiada bukti fizikal (bau, warna, rasa) yang mengubah status asalnya.",
          cadangan: "Boleh digunakan untuk bersuci, tetapi digalakkan melakukan semakan fizikal tradisional (bau, rasa, dan warna) sebelum menggunakannya.",
          amaran: "⚠️ MOD SIMULASI: Kunci API Gemini tiada dalam Secrets. Sila konfigurasikan GEMINI_API_KEY untuk analisis real-time pintar yang sebenar."
        });
      }
    }

    const ai = getGeminiClient();

    const systemPrompt = `Anda ialah AI Smart Taharah Assistant. Anda ialah pakar rujuk dan pembantu pendidikan Islam dalam bidang Fiqh bersuci (Taharah). 
Analisis imej yang diberikan dengan teliti. Kenal pasti objek utama (misalnya air jernih, sirap, tanah, bekas air, debu, tisu, batu, atau objek lain).
Sediakan panduan Fiqh yang sangat mendalam, mendidik, dan relevan dengan silibus pengajian Islam (seperti silibus KPM/IPG).

PENTING - IKUTI GARIS PANDUAN BERIKUT:
1. Jika objek ialah air jernih dalam gelas/bekas: Nyatakan ia BERKEMUNGKINAN "Air Mutlak" berdasarkan rupa visual, tetapi berikan amaran bahawa sifat batiniah (bau, rasa, kandungan mikro) tidak boleh dinilai sepenuhnya melalui visual semata-mata.
2. Jika objek ialah air berwarna (sirap, kopi, teh, dsb.): Nyatakan ia sebagai "Air Mutahayyar" (air yang berubah sifat kerana bercampur perkara suci) yang tidak sesuai untuk bersuci (wuduk/mandi wajib) tetapi suci untuk diminum.
3. Jika objek ialah debu tanah kering/bersih: Nyatakan ia sesuai sebagai alat "Tayammum".
4. Jika objek ialah alat pembersih alternatif (tisu, batu kering): Nyatakan kesesuaiannya untuk "Istinja'" berserta adab-adabnya.
5. Jika objek kelihatan kotor, bertakung, bercampur sampah atau najis visual: Nyatakan ia sebagai "Air Mutanajjis" atau air kotor yang tidak sesuai untuk bersuci.

Format jawapan mesti dalam JSON yang sah mengikut skema yang ditetapkan. JANGAN letak ulasan teks lain di luar blok JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType || "image/jpeg",
            data: imageBase64,
          },
        },
        {
          text: "Sila lakukan analisis visual dan Fiqh Taharah yang menyeluruh terhadap imej ini berdasarkan sistem prompt.",
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objek: { 
              type: Type.STRING, 
              description: "Nama objek atau cecair yang dikesan (cth: 'Segelas Air Sirap Merah', 'Air Paip Jernih')" 
            },
            jenis_objek: { 
              type: Type.STRING, 
              description: "Klasifikasi fizikal objek tersebut (cth: 'Cecair Berwarna', 'Cecair Jernih', 'Debu Tanah')" 
            },
            kategori_fiqh: { 
              type: Type.STRING, 
              description: "Kategori dalam ilmu Fiqh (cth: 'Air Mutlak', 'Air Musta'mal', 'Air Mutanajjis', 'Air Mutaghayyir / Mukhalit', 'Alat Tayammum', 'Alat Istinja'')" 
            },
            status_penggunaan: { 
              type: Type.STRING, 
              description: "Sama ada sesuai digunakan untuk bersuci (cth: 'Sesuai untuk Berwuduk & Mandi Wajib', 'Tidak Sesuai untuk Bersuci', 'Sesuai untuk Tayammum')" 
            },
            keyakinan: { 
              type: Type.STRING, 
              description: "Peratus keyakinan analisis visual (cth: '92%')" 
            },
            analisis_ai: { 
              type: Type.STRING, 
              description: "Penerangan visual AI tentang apa yang dilihat dalam imej (warna, bekas, keadaan fizik)" 
            },
            penerangan_pendidikan: { 
              type: Type.STRING, 
              description: "Huraian mendalam konsep Fiqh Taharah berkenaan kategori ini untuk tujuan pembelajaran pelajar." 
            },
            cadangan: { 
              type: Type.STRING, 
              description: "Cadangan tindakan praktikal berasaskan hukum syarak untuk bersuci." 
            },
            amaran: { 
              type: Type.STRING, 
              description: "Amaran batasan visual AI atau perkara penting yang perlu dipantau (cth: semakan bau/rasa)" 
            }
          },
          required: [
            "objek",
            "jenis_objek",
            "kategori_fiqh",
            "status_penggunaan",
            "keyakinan",
            "analisis_ai",
            "penerangan_pendidikan",
            "cadangan",
            "amaran"
          ],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Empty response from Gemini API");
    }

    // Try to parse JSON to guarantee it is valid before returning
    const parsedData = JSON.parse(textOutput.trim());
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/taharah/analyze:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to analyze image using Gemini API." 
    });
  }
});

// API Route to proxy sample images to avoid CORS issues on client-side
app.get("/api/taharah/sample-image", async (req, res) => {
  try {
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const base64 = buffer.toString("base64");
    return res.json({ base64: `data:${contentType};base64,${base64}` });
  } catch (error: any) {
    console.error("Error in /api/taharah/sample-image:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch image." });
  }
});

// Setup Vite Dev Middleware in Development
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Taharah Server] Server running on http://localhost:${PORT}`);
  });
}

startApp().catch((err) => {
  console.error("Failed to start full-stack application server:", err);
});
