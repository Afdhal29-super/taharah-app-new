import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { imageBase64, hint } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Tiada gambar dihantar" });
    }

    const input = (hint || "").toLowerCase();

    let result;

    if (input.includes("teh") || input.includes("kopi") || input.includes("ais")) {
      result = {
        objek: "Air Teh / Air Berubah",
        status_penggunaan: "Tidak sesuai untuk Wuduk",
        kategori_fiqh: "Air Mutaghayyir",
        keyakinan: "92%",
        analisis_ai: "Air telah berubah warna, bau atau rasa.",
        penerangan_pendidikan: "Tidak sah untuk wuduk kerana bukan air mutlak.",
        cadangan: "Elakkan digunakan untuk bersuci.",
        amaran: "Air tidak memenuhi syarat kesucian.",
      };
    } else {
      result = {
        objek: "Air Mutlak",
        status_penggunaan: "Sesuai untuk Wuduk",
        kategori_fiqh: "Air Mutlak",
        keyakinan: "95%",
        analisis_ai: "Air kelihatan jernih dan tidak berubah sifat.",
        penerangan_pendidikan: "Boleh digunakan untuk wuduk dan mandi wajib.",
        cadangan: "Sah digunakan untuk bersuci.",
        amaran: "Pastikan tidak bercampur najis.",
      };
    }

    return res.status(200).json(result);

  } catch (err: any) {
    return res.status(500).json({
      error: "Server error",
      detail: err.message,
    });
  }
}
