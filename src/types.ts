export interface Widget {
  id: string;
  title: string;
  x: number; // grid position percentage or pixels
  y: number;
  w: number; // width in grid units or columns
  h: number; // height or auto
  type: "taharah" | "guide" | "history" | "stats";
  isDragging?: boolean;
}

export interface TaharahResult {
  objek: string;
  jenis_objek: string;
  kategori_fiqh: string;
  status_penggunaan: string;
  keyakinan: string;
  analisis_ai: string;
  penerangan_pendidikan: string;
  cadangan: string;
  amaran: string;
}

export interface HistoryRecord {
  id: string;
  tarikh: string;
  objek: string;
  status: string;
  kategori: string;
  keyakinan: string;
}
