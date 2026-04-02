import { API_BASE_URL_NEW } from "../../services/endpoints/common";

export interface DashboardStats {
  total_rooms: number;
  total_room_types: number;
  total_users: number;
}

export interface BookingData {
  date?: string;
  year?: number;
  month?: number;
  total: number;
}

export interface RevenueData {
  date?: string;
  year?: number;
  month?: number;
  total: string;
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
    daily: BookingData[];
    monthly: BookingData[];
    yearly: BookingData[];
  };
  revenue: {
    daily: RevenueData[];
    monthly: RevenueData[];
    yearly: RevenueData[];
  };
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_BASE_URL_NEW}/admin/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
};
