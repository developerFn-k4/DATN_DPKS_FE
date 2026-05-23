import api from "../../core/api";

export type PaymentMethod = "vnpay" | "momo" | "cash";

export interface CheckoutResponse {
  success: boolean;
  message?: string;
  payment_url?: string;
  order_id?: string;
  booking_id?: number;
  actions?: {
    home: string;
    my_bookings: string;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  status: "paid" | "pending" | "failed" | string;
  message?: string;
  order_id?: string;
  booking_id?: number;
  amount?: number;
  method?: string;
  transaction_id?: string;
  bank?: string;
  card_type?: string;
  pay_date?: string;
  booking?: {
    id: number;
    check_in: string;
    check_out: string;
    name: string;
    room_name?: string;
  };
}

export interface MyBooking {
  id: number;
  check_in: string;
  check_out: string;
  status: string;
  total_price: number;
  created_at: string;
  rooms?: { name: string; quantity: number }[];
  payment?: {
    status: string;
    method: string;
    amount: number;
  };
}

export interface MyBookingsResponse {
  success: boolean;
  data: MyBooking[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export const paymentService = {
  checkout: async (bookingId: number, method: PaymentMethod): Promise<CheckoutResponse> => {
    const res = await api.post<CheckoutResponse>(`/payment/checkout/${bookingId}`, { method });
    return res.data;
  },

  getPaymentStatus: async (orderId: string): Promise<PaymentStatusResponse> => {
    const res = await api.get<PaymentStatusResponse>(`/payment/status/${orderId}`);
    return res.data;
  },

  getMyBookings: async (): Promise<MyBookingsResponse> => {
    const res = await api.get<MyBookingsResponse>("/my-bookings");
    return res.data;
  },
};
