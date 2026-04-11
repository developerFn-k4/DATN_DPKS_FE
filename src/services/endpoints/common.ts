export const API_BASE_URL = import.meta.env.VITE_API_URL as string;
export const API_BASE_URL_NEW = import.meta.env.VITE_API_URL as string;
export const API_STORAGE_URL = (import.meta.env.VITE_API_URL as string).replace("/api", "/storage");

export const ENDPOINTS = {
  ROOMS: "/rooms",
  AVAILABLE_ROOMS: "/available-rooms",
  BOOKINGS: "/bookings",
};
