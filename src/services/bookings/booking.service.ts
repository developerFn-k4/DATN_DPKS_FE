import api from "../../core/api";

export interface RoomBookingItem {
  room_type_id: number;
  quantity: number;
  adults: number;
  children: number;
}

export interface ServiceBookingItem {
  service_id: number;
  quantity: number;
}

export interface BookingParams {
  name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  rooms: RoomBookingItem[];
  services: ServiceBookingItem[];
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    check_in: string;
    check_out: string;
    total_price: string;
    status: string;
    created_at: string;
  };
}

export const createBooking = async (params: BookingParams): Promise<BookingResponse> => {
  const response = await api.post<BookingResponse>("/admin/booking", params);
  return response.data;
};
