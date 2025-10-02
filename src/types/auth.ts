import { Interface } from "@/utils/decorator";

export type Roles = "ADMIN" | "SURVEYOR";

@Interface
export class Auth {
  id_pengguna!: number;
  nama_lengkap!: string;
  kata_sandi!: string;
  peran!: Roles;
  nip!: string | null;
  jabatan!: string | null;
  nomor_telepon!: string | null;
}