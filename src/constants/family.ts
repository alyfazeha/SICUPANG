import type { Family } from "@/types/family";

type Except = (keyof Family)[];
type Include = Record<keyof Omit<Family, "comment" | "created_at" | "id_district" | "id_family" | "id_surveyor" | "foodstuff" | "photo" | "status" | "updated_at">, string>;

export const FAMILY_ATTRIBUTES: Include = {
  name: "Nama Kepala Keluarga",
  family_card_number: "Nomor Kartu Keluarga",
  village: "Desa/Kelurahan",
  address: "Alamat Lengkap",
  members: "Jumlah Anggota Keluarga",
  income: "Pendapatan per Bulan",
  spending: "Pengeluaran per Bulan",
  pregnant: "Ada Ibu Hamil",
  breastfeeding: "Ada Ibu Menyusui",
  toddler: "Ada Balita",
};

export const KEYS_TO_EXCLUDE: Except = [
  "id_district",
  "id_family",
  "id_surveyor",
  "photo",
  "foodstuff",
  "created_at",
  "updated_at",
];