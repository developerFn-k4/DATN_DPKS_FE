export type DashboardViewType = "day" | "month" | "year";

export interface AdminProfile {
  name: string;
  email: string;
  avatar: string | null;
}

export interface DashboardStats {
  total_rooms: number;
  total_room_types: number;
  total_users: number;
}

export interface BookingDailyItem {
  date: string;
  total: number;
}

export interface BookingMonthlyItem {
  year: number;
  month: number;
  total: number;
}

export interface BookingYearlyItem {
  year: number;
  total: number;
}

export interface RevenueDailyItem {
  date: string;
  total: string;
}

export interface RevenueMonthlyItem {
  year: number;
  month: number;
  total: string;
}

export interface RevenueYearlyItem {
  year: number;
  total: string;
}

export interface DashboardBookings {
  daily: BookingDailyItem[];
  monthly: BookingMonthlyItem[];
  yearly: BookingYearlyItem[];
}

export interface DashboardRevenue {
  daily: RevenueDailyItem[];
  monthly: RevenueMonthlyItem[];
  yearly: RevenueYearlyItem[];
}

export interface AdminDashboardResponse {
  success: boolean;
  admin: AdminProfile;
  stats: DashboardStats;
  bookings: DashboardBookings;
  revenue: DashboardRevenue;
}

export interface DashboardRow {
  key: string;
  label: string;
  bookings: number;
  revenue: number;
  year?: number;
  month?: number;
  date?: string;
}

export interface DashboardSummary {
  totalBookings: number;
  totalRevenue: number;
  totalRows: number;
}

export interface DashboardInsightItem {
  title: string;
  value: string;
  subtitle: string;
}