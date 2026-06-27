import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Tiada gambar dihantar" });
    }

    // 🔥 MOCK AI RESPONSE (untuk pastikan UI jalan dulu)
    return res.status(200).json({
      objek: "Air Jernih",
      status_penggunaan: "Sesuai untuk Wuduk",
      kategori_fiqh: "Air Mutlak",
      keyakinan: "95%",
      analisis_ai: "AI mengesan air bersih tanpa najis atau perubahan sifat.",
      penerangan_pendidikan: "Air ini sah digunakan untuk wuduk dan bersuci mengikut hukum fiqh.",
      cadangan: "Boleh digunakan untuk wuduk dan mandi wajib.",
      amaran: "Pastikan tiada campuran najis atau bahan asing.",
    });

  } catch (err: any) {
    return res.status(500).json({
      error: "Server error",
      detail: err.message,
    });
  }
}
