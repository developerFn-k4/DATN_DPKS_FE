const BASE_URL = "https://vietstay.ngrok.dev/api";

export interface RoomType {
  room_type_id: number;
  hotel_id: number;
  name: string;
  capacity: number;
  bed_type: string;
  area: number;
  base_price: string | number;
  currency: string;
  status: "active" | "inactive";
  amenities: string[];
  images?: { id: number; image_url: string }[];
}

const request = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "true",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(BASE_URL + url, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Lỗi kết nối API");
  return data;
};

export const roomTypeService = {
  getAll: async () => {
    const res = await request("/admin/room-types", { method: "GET" });
    return res?.room_types ?? res?.data ?? res ?? [];
  },

  create: async (formData: FormData) => {
    return request("/admin/room-types", {
      method: "POST",
      body: formData,
    });
  },

  update: async (id: number, formData: FormData) => {
    formData.append("_method", "PUT");
    return request(`/admin/room-types/${id}`, {
      method: "POST",
      body: formData,
    });
  },

  delete: async (id: number) => {
    return request(`/admin/room-types/${id}`, { method: "DELETE" });
  },
};