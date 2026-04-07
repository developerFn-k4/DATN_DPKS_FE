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
  bank_code?: string;
}

export interface BookingResponse {
  message: string;
  booking_id?: number;
  order_id?: string;
  amount?: number;
  payment_url?: string;
}

export const createBooking = async (params: BookingParams): Promise<BookingResponse> => {
  const response = await api.post<BookingResponse>("/booking", params);
  return response.data;
};
