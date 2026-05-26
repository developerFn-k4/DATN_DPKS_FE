const _apiUrl: string = import.meta.env.VITE_API_URL || "http://103.101.162.191:8080/api";

export const API_BASE_URL = _apiUrl;
export const API_BASE_URL_NEW = _apiUrl;
export const API_STORAGE_URL = _apiUrl.replace("/api", "/storage");

export const ENDPOINTS = {
  ROOMS: "/rooms",
  AVAILABLE_ROOMS: "/available-rooms",
  BOOKINGS: "/bookings",
};
