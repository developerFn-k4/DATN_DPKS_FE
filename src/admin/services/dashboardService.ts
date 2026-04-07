import api from "../../core/api";

export interface DashboardStats {
  total_rooms: number;
  total_room_types: number;
  total_users: number;
  total_bookings: number;
}

export interface BookingPeriod {
  date?: string;
  year?: number;
  month?: number;
  total: number;
}

export interface RevenuePeriod {
  date?: string;
  year?: number;
  month?: number;
  total: string;
}

export interface TopRoomType {
  id: number;
  name: string;
  total_bookings: number;
}

export interface RoomTypePercentage {
  id: number;
  name: string;
  total_bookings: number;
  percentage: string;
}

export interface LatestBookingUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  status: string;
}

export interface LatestBooking {
  id: number;
  booking_code: string;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  status: string;
  total_price: string;
  payment_status: string;
  payment_method: string | null;
  created_at: string;
  user: LatestBookingUser;
}

export interface DashboardData {
  success: boolean;
  admin: {
    name: string;
    email: string;
    avatar: string | null;
  };
  stats: DashboardStats;
  bookings: {
    daily: BookingPeriod[];
    monthly: BookingPeriod[];
    yearly: BookingPeriod[];
  };
  revenue: {
    daily: RevenuePeriod[];
    monthly: RevenuePeriod[];
    yearly: RevenuePeriod[];
  };
  top_room_types: TopRoomType[];
  room_type_percentage: RoomTypePercentage[];
  latest_bookings: LatestBooking[];
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get<DashboardData>("/admin/dashboard");
  return response.data;
};
