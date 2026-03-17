const BASE_URL = "https://vietstay.ngrok.dev/api";

export interface RoomImage {
  id: number;
  image_url: string;
}

export interface Room {
  id: number;
  room_number: string;
  room_type_id: number;
  floor: number;
  status: "available" | "occupied" | "maintenance" | "unavailable" | "booked" | "reserved"; 
  note: string | null;
  price: string | number;
  images?: RoomImage[];
  room_type?: {
    id: number;
    name: string;
  };
}

const request = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "true",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(BASE_URL + url, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

export const roomService = {
  getAll: async () => {
    const data = await request("/admin/rooms", {
      method: "GET",
    });
    return data.data || data;
  },

  create: async (formData: FormData) => {
    return request("/admin/rooms", {
      method: "POST",
      body: formData,
    });
  },

  update: async (id: number, formData: FormData) => {
    formData.append("_method", "PUT");

    return request(`/admin/rooms/${id}`, {
      method: "POST",
      body: formData,
    });
  },

  delete: async (id: number) => {
    return request(`/admin/rooms/${id}`, {
      method: "DELETE",
    });
  },
};