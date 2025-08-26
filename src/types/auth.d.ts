type Roles = "ADMIN" | "SURVEYOR";

interface Auth {
  id_pengguna: number;
  surel: string;
  kata_sandi: string;
  peran: Roles;
}

export { Auth, Roles };