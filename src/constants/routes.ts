/* =======================
   AUTHENTICATION ROUTES
   ======================= */
export const AUTH_PAGES: string[] = ["/masuk", "/admin", "/surveyor"];

/* =======================
   ADMIN ROUTES
   ======================= */
export const ADMIN_DASHBOARD = "/admin/dasbor";
export const ADMIN_PROFILE = "/admin/profil";
export const ADMIN_SUBDISTRICT_DATA = "/admin/data-kecamatan";
export const ADMIN_MANAGE_SURVEYORS = "/admin/kelola-surveyor";
export const ADMIN_ADD_SURVEYORS = "/admin/kelola-surveyor/tambah";
export const ADMIN_FOOD_RECORD = "/admin/rekap-pangan";
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

export const API_ADMIN_DASHBOARD = "/api/admin/dashboard";
export const API_ADMIN_DISTRICT_DATA = "/api/admin/district";
export const API_ADMIN_READ_DISTRICT_DATA = (id: string | number) => `/api/admin/district/${id}/get`;
export const API_ADMIN_READ_SURVEYOR_DATA = (id: string | number) => `/api/admin/surveyor/${id}/get`;

export const API_SURVEYOR_DASHBOARD = "/api/surveyor/dashboard";
export const API_SURVEYOR_FAMILY = "/api/surveyor/family";
export const API_SURVEYOR_ADD_DATA_FAMILY = "/api/surveyor/family/add";
export const API_SURVEYOR_DELETE_DATA_FAMILY = (id: string | number) => `/api/surveyor/family/${id}/delete`;
export const API_SURVEYOR_EDIT_DATA_FAMILY = (id: string | number) => `/api/surveyor/family/${id}/patch`;
export const API_SURVEYOR_READ_DATA_FAMILY = (id: string | number) => `/api/surveyor/family/${id}/get`;