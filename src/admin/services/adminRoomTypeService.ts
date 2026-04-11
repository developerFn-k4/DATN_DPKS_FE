import axios from 'axios';

// ===================== INTERFACES =====================

export interface RoomTypeImage {
  id: number;
  image_url: string;
}

export interface ApiResponse {
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

export interface RoomType {
  id: number;
  hotel_id: number;
  name: string;
  capacity: number;
  bed_type: string;
  area: number;
  base_price: string | number;
  currency: string;
  status: 'active' | 'inactive';
  amenities: string[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  images?: RoomTypeImage[];
  // Backward compat: một số response trả về room_type_id thay vì id
  room_type_id?: number;
}

// ===================== AXIOS INSTANCE =====================

// Instance riêng cho admin - tự động gắn Bearer token từ localStorage
const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    Accept: 'application/json',
    // Bỏ qua trang cảnh báo của ngrok khi chạy local
    'ngrok-skip-browser-warning': 'true',
  },
});

// Interceptor request: tự động gắn Authorization header
adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response: chuẩn hóa thông báo lỗi từ Laravel
adminAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    // Ưu tiên lấy message từ body response của Laravel
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Lỗi không xác định';
    return Promise.reject(new Error(msg));
  }
);

// ===================== URL HELPER =====================

// Tạo URL ảnh đầy đủ từ image_url có thể là relative path
export const getStorageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  // Chuyển /api → /storage để tạo storage URL
  const storageBase = (import.meta.env.VITE_API_URL as string).replace('/api', '/storage');
  return `${storageBase}/${imageUrl}`;
};

// ===================== SERVICE =====================

export const roomTypeService = {
  /**
   * Lấy danh sách tất cả loại phòng
   * GET /admin/room-types
   */
  getAll: async (): Promise<RoomType[]> => {
    const res = await adminAxios.get('/admin/room-types');
    // Hỗ trợ nhiều cấu trúc response: { data: [] } hoặc { room_types: [] } hoặc []
    return res.data?.data ?? res.data?.room_types ?? res.data ?? [];
  },

  /**
   * Xem chi tiết 1 loại phòng
   * GET /admin/room-types/{id}
   */
  getById: async (id: number | string): Promise<RoomType> => {
    const res = await adminAxios.get(`/admin/room-types/${id}`);
    return res.data?.data ?? res.data;
  },

  /**
   * Tạo loại phòng mới
   * POST /admin/room-types  (multipart/form-data)
   */
  create: async (formData: FormData): Promise<ApiResponse> => {
    const res = await adminAxios.post('/admin/room-types', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  /**
   * Cập nhật loại phòng
   * PUT /admin/room-types/{id}  (dùng POST + _method=PUT vì có file upload)
   */
  update: async (id: number | string, formData: FormData): Promise<ApiResponse> => {
    formData.set('_method', 'PUT');
    const res = await adminAxios.post(`/admin/room-types/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  /**
   * Xóa mềm (soft delete) loại phòng
   * DELETE /admin/room-types/{id}
   */
  delete: async (id: number | string): Promise<ApiResponse> => {
    const res = await adminAxios.delete(`/admin/room-types/${id}`);
    return res.data;
  },

  /**
   * Khôi phục loại phòng đã bị xóa mềm
   * PUT /admin/room-types/{id}/restore
   */
  restore: async (id: number | string): Promise<ApiResponse> => {
    const res = await adminAxios.put(`/admin/room-types/${id}/restore`);
    return res.data;
  },
};
