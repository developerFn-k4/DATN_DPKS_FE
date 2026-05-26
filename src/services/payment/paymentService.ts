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
    payment_status?: string;
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
interface RawMyBooking {
  id: number;
  check_in: string;
  check_out: string;
  status: string;
  total_price: string | number;
  created_at: string;
  rooms?: { name: string; quantity: number }[];
  booking_rooms?: Array<{
    quantity: number;
    room?: {
      room_type?: {
        name?: string;
      };
    };
  }>;
  payment?: {
    status: string;
    method: string;
    amount: string | number;
  };
}

interface MyBookingsPaginatedData {
  data: RawMyBooking[];
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
}

interface MyBookingsApiResponse {
  success: boolean;
  data: RawMyBooking[] | MyBookingsPaginatedData;
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
const normalizeBooking = (booking: RawMyBooking): MyBooking => {
  const mappedRooms =
    booking.rooms && booking.rooms.length > 0
      ? booking.rooms
      : (booking.booking_rooms ?? []).map((item) => ({
          name: item.room?.room_type?.name ?? "Phòng",
          quantity: item.quantity ?? 1,
        }));

  return {
    id: booking.id,
    check_in: booking.check_in,
    check_out: booking.check_out,
    status: booking.status,
    total_price: Number(booking.total_price ?? 0),
    created_at: booking.created_at,
    rooms: mappedRooms,
    payment: booking.payment
      ? {
          status: booking.payment.status,
          method: booking.payment.method,
          amount: Number(booking.payment.amount ?? 0),
        }
      : undefined,
  };
};
export const paymentService = {
  checkout: async (bookingId: number, method: PaymentMethod): Promise<CheckoutResponse> => {
    const res = await api.post<CheckoutResponse>(`/payment/checkout/${bookingId}`, { method });
    return res.data;
  },

  getPaymentStatus: async (orderId: string): Promise<PaymentStatusResponse> => {
     const res = await api.get<{ success: boolean; data: PaymentStatusResponse }>(`/payment/status/${orderId}`);
    const inner = res.data.data;
    return {
      success: res.data.success,
      status: inner.booking?.payment_status ?? inner.status,
      order_id: inner.order_id,
      booking_id: inner.booking?.id,
      amount: inner.amount,
      method: inner.method,
      booking: inner.booking,
    };
  },

  getMyBookings: async (): Promise<MyBookingsResponse> => {
     const res = await api.get<MyBookingsApiResponse>("/my-bookings");
    const payload = res.data.data;

    const rawBookings = Array.isArray(payload) ? payload : payload.data;

    return {
      success: res.data.success,
      data: rawBookings.map(normalizeBooking),
      meta: Array.isArray(payload)
        ? undefined
        : {
            total: payload.total ?? rawBookings.length,
            per_page: payload.per_page ?? rawBookings.length,
            current_page: payload.current_page ?? 1,
            last_page: payload.last_page ?? 1,
          },
    };
  },
};
