import axios from "axios";

const BASE_URL = "https://vietstay.ngrok.dev/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export interface RoomImage {
  id: number;
  image_url: string;
}

export interface Room {
  id: number;
  room_number: string;
  room_type_id: number;
  floor: number;
  status: "available" | "occupied" | "maintenance" | "unavailable"; 
  note: string | null;
  price: string | number;
  images?: RoomImage[]; 
  room_type?: {
    id: number;
    name: string;
  };
}

export const roomService = {
  getAll: async () => {
    const res = await api.get("/admin/rooms");
    return res.data.data || res.data;
  },

  create: async (formData: FormData) => {
    const res = await api.post("/admin/rooms", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (id: number, formData: FormData) => {
    formData.append("_method", "PUT");
    const res = await api.post(`/admin/rooms/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (id: number) => {
    const res = await api.delete(`/admin/rooms/${id}`);
    return res.data;
  },
};