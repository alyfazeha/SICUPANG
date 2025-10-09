/* =======================
   AUTHENTICATION ROUTES
   ======================= */
export const AUTH_PAGES: string[] = ["/masuk", "/admin", "/surveyor"];

/* =======================
   ADMIN ROUTES
   ======================= */
export const ADMIN_DASHBOARD = "/admin/dasbor";
export const ADMIN_PROFILE = "/admin/profil";
export const ADMIN_MANAGE_SURVEYORS = "/admin/surveyor/kelola";
export const ADMIN_DETAIL_SURVEYORS = (id: string | number) => `/admin/surveyor/${id}/detail`;
export const ADMIN_EDIT_SURVEYORS = (id: string | number) => `/admin/surveyor/${id}/edit`;
export const ADMIN_DELETE_SURVEYORS = (id: string | number) => `/admin/surveyor/${id}/hapus`;
export const ADMIN_ADD_SURVEYORS = "/admin/surveyor/tambah";
export const ADMIN_SUBDISTRICT_RECORD = "/admin/rekap-kecamatan";
export const ADMIN_FOOD_RECORD = "/admin/rekap-pangan";
export const ADMIN_FOOD_RECORD_DETAIL = (id: string | number) => `/admin/rekap-pangan/${id}`;
export const ADMIN_PPH_RECORD = "/admin/rekap-pph";

/* =======================
   SURVEYOR ROUTES
   ======================= */
export const SURVEYOR_DASHBOARD = "/surveyor/dasbor";
export const SURVEYOR_PROFILE = "/surveyor/profil";
export const SURVEYOR_FAMILY = "/surveyor/keluarga";
export const SURVEYOR_ADD_DATA_FAMILY = "/surveyor/keluarga/tambah";
export const SURVEYOR_EDIT_DATA_FAMILY = (id: string | number) => `/surveyor/keluarga/${id}/edit`;
export const SURVEYOR_DETAIL_DATA_FAMILY = (id: string | number) => `/surveyor/keluarga/${id}/detail`;

/* =======================
   AUTH ROUTES
   ======================= */
export const LOGIN = "/masuk";

/* =======================
   API ROUTES
   ======================= */
export const API_ACCOUNT = "/api/auth/account";
export const API_LOGIN = "/api/auth/login";
export const API_LOGOUT = "/api/auth/logout";

export const FASTAPI_SERVICES = process.env.FASTAPI_SERVICES || "http://127.0.0.1:8000";
export const API_INGREDIENT_EXTRACT = `${FASTAPI_SERVICES}/api/ingredient-extract`;

export const API_ADMIN_MANAGE_SURVEYOR = (id: string | number) => `/api/admin/surveyors/${id}`;
export const API_ADMIN_PPH_EXPORT = (id: number, year: number) => `/api/admin/pph?kecamatan=${id}&tahun=${year}`;
export const API_ADMIN_DELETE_SURVEYOR = (id: string | number) => `/api/admin/surveyors/${id}`;

export const API_SURVEYOR_DASHBOARD = "/api/surveyor/dashboard";
export const API_SURVEYOR_FAMILY = "/api/surveyor/family";
export const API_SURVEYOR_ADD_DATA_FAMILY = "/api/surveyor/family/add";
export const API_SURVEYOR_DELETE_DATA_FAMILY = (id: string | number) => `/api/surveyor/family/${id}/delete`;
export const API_SURVEYOR_EDIT_DATA_FAMILY = (id: string | number) => `/api/surveyor/family/${id}/patch`;