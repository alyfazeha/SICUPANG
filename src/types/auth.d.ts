export type Roles = "ADMIN" | "MASYARAKAT";

interface Auth {
  id_pengguna: string;
  surel: string;
  kata_sandi: string;
  peran: Roles;
}

interface Token {
  access_token: string;
  refresh_token: string;
}

export { Auth, Token };