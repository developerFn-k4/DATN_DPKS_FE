/**
 * adminApi.ts
 * Axios instance dùng chung cho toàn bộ admin panel.
 * Tự động gắn Bearer token + chuẩn hóa lỗi từ Laravel.
 */

import axios from 'axios';

// ===================== INTERFACES =====================

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'completed';

export type PaymentStatus = 'pending' | 'success' | 'failed';

export type RoomStatus =
  | 'available'
  | 'booked'
  | 'occupied'
  | 'maintenance'
  | 'reserved'
  | 'unavailable';

export type ServiceType = 'Ẩm thực' | 'Di chuyển' | 'Tiện ích' | 'Thư giãn' | 'Phòng';

export interface Payment {
  id: number;
  order_id: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  created_at?: string;
}

export interface BookingRoom {
  id: number;
  room_id: number;
  room: {
    id: number;
    room_number: string;
    room_type: { id: number; name: string };
  };
}

export interface BookingService {
  id: number;
  service: { id: number; name: string; price: number; type: string };
}

export interface Booking {
  id: number;
  booking_code: string;
  name: string;
  phone: string;
  email: string;
  status: BookingStatus;
  total_price: number;
  check_in: string;
  check_out: string;
  created_at: string;
  user: { id: number; name: string; email: string };
  booking_rooms: BookingRoom[];
  services: BookingService[];
  payment: Payment;
}

export interface Room {
  id: number;
  room_number: string;
  floor: number;
  status: RoomStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
  room_type: { id: number; name: string };
}

export interface Service {
  id: number;
  name: string;
  price: number;
  type: ServiceType;
  created_at: string;
  updated_at: string;
}

export interface RoomTypeImage {
  id: number;
  image_url: string; // full URL (đã có domain)
}

export interface RoomType {
  id: number;
  hotel_id: number;
  name: string;
  capacity: number;
  bed_type: string;
  area: number;
  amenities: string[];
  base_price: number;
  currency: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  images: RoomTypeImage[];
}

// ===================== AXIOS INSTANCE =====================

const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    Accept: 'application/json',
    // Bỏ qua trang cảnh báo của ngrok khi dev
    'ngrok-skip-browser-warning': 'true',
  },
});

// Tự động gắn Bearer token từ localStorage vào mọi request
adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Chuẩn hóa message lỗi từ Laravel (validation errors, server errors, ...)
adminAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data;
    // Lấy message lỗi đầu tiên từ Laravel validation errors nếu có
    const firstValidationError =
      data?.errors && Object.values(data.errors as Record<string, string[]>)[0]?.[0];
    const msg = firstValidationError || data?.message || err.message || 'Lỗi không xác định';
    // Đính kèm validation errors để form component có thể hiển thị lỗi theo từng field
    const customErr = new Error(msg) as Error & { validationErrors?: Record<string, string[]> };
    customErr.validationErrors = data?.errors ?? undefined;
    return Promise.reject(customErr);
  }
);

export default adminAxios;

// ===================== BOOKING API =====================
export const bookingApi = {
  /** GET /admin/bookings - lấy danh sách, hỗ trợ filter */
  getAll: (params?: {
    status?: BookingStatus | '';
    search?: string;
    page?: number;
    per_page?: number;
  }) => adminAxios.get<{ status: string; data: Booking[] | { data: Booking[]; total: number; current_page: number; last_page: number } }>('/admin/bookings', { params }),

  /** GET /admin/bookings/{id} */
  getById: (id: string | number) =>
    adminAxios.get<{ status: string; data: Booking }>(`/admin/bookings/${id}`),

  /** PUT /admin/bookings/{id} - cập nhật status, name, phone, email */
  update: (id: string | number, data: Partial<Pick<Booking, 'status' | 'name' | 'phone' | 'email'>>) =>
    adminAxios.put(`/admin/bookings/${id}`, data),

  /** DELETE /admin/bookings/{id} */
  delete: (id: string | number) => adminAxios.delete(`/admin/bookings/${id}`),
};

// ===================== PAYMENT API =====================
export const paymentApi = {
  cancel: (id: number) => adminAxios.post(`/admin/payments/${id}/cancel`),
  delete: (id: number) => adminAxios.delete(`/admin/payments/${id}`),
};

// ===================== ROOM API =====================
export const roomApi = {
  /** GET /admin/rooms */
  getAll: () =>
    adminAxios.get<{ success: boolean; data: Room[] }>('/admin/rooms'),

  /** POST /admin/rooms */
  create: (data: Pick<Room, 'room_number' | 'floor' | 'status'> & { room_type_id: number; note?: string | null }) =>
    adminAxios.post<{ success: boolean; data: Room }>('/admin/rooms', data),

  /** GET /admin/rooms/{id} */
  getById: (id: string | number) =>
    adminAxios.get<{ success: boolean; data: Room }>(`/admin/rooms/${id}`),

  /** PUT /admin/rooms/{id} */
  update: (
    id: string | number,
    data: Partial<Pick<Room, 'status' | 'room_number' | 'floor' | 'note'> & { room_type_id: number }>
  ) => adminAxios.put(`/admin/rooms/${id}`, data),

  /** DELETE /admin/rooms/{id} */
  delete: (id: string | number) => adminAxios.delete(`/admin/rooms/${id}`),

  /** PUT /admin/rooms/{id}/restore */
  restore: (id: string | number) => adminAxios.put(`/admin/rooms/${id}/restore`),
};

// ===================== SERVICE API =====================
export const serviceApi = {
  /** GET /admin/services - hỗ trợ filter theo type và search */
  getAll: (params?: { type?: string; search?: string }) =>
    adminAxios.get<{ success: boolean; data: Service[] }>('/admin/services', { params }),

  /** POST /admin/services */
  create: (data: Pick<Service, 'name' | 'price' | 'type'>) =>
    adminAxios.post<{ success: boolean; data: Service }>('/admin/services', data),

  /** GET /admin/services/{id} */
  getById: (id: string | number) =>
    adminAxios.get<{ success: boolean; data: Service }>(`/admin/services/${id}`),

  /** PUT /admin/services/{id} */
  update: (id: string | number, data: Partial<Pick<Service, 'name' | 'price' | 'type'>>) =>
    adminAxios.put(`/admin/services/${id}`, data),

  /** DELETE /admin/services/{id} */
  delete: (id: string | number) => adminAxios.delete(`/admin/services/${id}`),
};

// ===================== ROOM TYPE API =====================
export const roomTypeApi = {
  /** GET /admin/room-types - lấy danh sách để dùng trong dropdown */
  getAll: () =>
    adminAxios.get<{ data: { id: number; name: string }[] }>('/admin/room-types'),

  /** GET /admin/room-types/{id} */
  getById: (id: string | number) =>
    adminAxios.get<{ data: RoomType }>(`/admin/room-types/${id}`),
};
