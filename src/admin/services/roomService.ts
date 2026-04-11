const BASE_URL = import.meta.env.VITE_API_URL as string;

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
  room_type?: {
    id: number;
    name: string;
  };
}

const request = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "true",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(BASE_URL + url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("API ERROR:", data);
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

export const roomService = {
  getAll: async () => {
    const res = await request("/admin/rooms", {
      method: "GET",
    });

    return res?.data ?? res ?? [];
  },
  getRoomTypes: async () => {
    return await request("/admin/room-types", { // Thay đổi endpoint cho đúng API của bạn
      method: "GET",
    });
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
// hoàn thành