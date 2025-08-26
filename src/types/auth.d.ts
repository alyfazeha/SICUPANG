type Roles = "ADMIN" | "SURVEYOR";

interface Auth {
  id_pengguna: number;
  nama_lengkap: string;
  surel: string;
  kata_sandi: string;
  peran: Roles;
  nip: string | null;
  jabatan: string | null;
  nomor_telepon: string | null;
}

export { Auth, Roles };