type Roles = "ADMIN" | "MASYARAKAT";

interface Auth {
  id_pengguna: number;
  surel: string;
  kata_sandi: string;
  peran: Roles;
}

export { Auth, Roles };