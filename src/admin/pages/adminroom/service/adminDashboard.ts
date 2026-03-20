import instance from "../../../../core/api";
import type { AdminDashboardResponse } from "../types/dashboard";

export const adminDashboardService = {
  async getDashboard() {
    const { data } = await instance.get<AdminDashboardResponse>("/admin/dashboard");
    return data;
  },
};