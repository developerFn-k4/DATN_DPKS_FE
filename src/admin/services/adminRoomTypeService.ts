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
    "ngrok-skip-browser-warning": "true", // Quan trọng khi dùng ngrok
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(BASE_URL + url, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    // Thử parse JSON, nếu server lỗi 500/404 trả về HTML thì catch trả về null
    const data = await res.json().catch(() => {
      return null;
    });

    if (!res.ok) {
      // Log lỗi từ backend trả về (nếu có)
      console.error("API Error Response:", data);
      throw new Error(data?.message || `Lỗi server: ${res.status}`);
    }

    return data;
  } catch (error: any) {
    // Đây là nơi bắt lỗi "Failed to fetch" (Ngrok chết, CORS, hoặc mất mạng)
    console.error("Fetch Execution Error:", error);
    
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Không thể kết nối đến server. Hãy kiểm tra Ngrok hoặc mạng của bạn.");
    }
    throw error;
  }
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

  update: async (id: number | string, formData: FormData) => {
    // Ép kiểu chuẩn cho Laravel
    formData.set("_method", "PUT"); 

    return request(`/admin/room-types/${id}`, {
      method: "POST", // Laravel bắt buộc POST + _method PUT khi có File
      body: formData,
    });
  },
  delete: async (id: number) => {
    return request(`/admin/room-types/${id}`, { method: "DELETE" });
  },
};