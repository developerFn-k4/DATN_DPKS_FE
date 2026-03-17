import * as React from "react";
import { useQuery } from "@tanstack/react-query"; 
import type {
  AdminDashboardResponse,
  DashboardInsightItem,
  DashboardRow,
  DashboardSummary,
  DashboardViewType,
} from "../types/dashboard";
import { adminDashboardService } from "../service/adminDashboard";

function parseMoney(value: string | number | null | undefined) {
  if (value == null) return 0;
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")} đ`;
}

function buildDailyRows(data: AdminDashboardResponse, year: number, month: number): DashboardRow[] {
  const bookingMap = new Map(data.bookings.daily.map((item) => [item.date, item.total]));
  const revenueMap = new Map(data.revenue.daily.map((item) => [item.date, parseMoney(item.total)]));

  const days = getDaysInMonth(year, month);

  return Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    const date = formatDateKey(year, month, day);

    return {
      key: date,
      label: `${pad2(day)}/${pad2(month)}`,
      date,
      year,
      month,
      bookings: bookingMap.get(date) ?? 0,
      revenue: revenueMap.get(date) ?? 0,
    };
  });
}

function buildMonthlyRows(data: AdminDashboardResponse, year: number): DashboardRow[] {
  const bookingMap = new Map(
    data.bookings.monthly.map((item) => [`${item.year}-${item.month}`, item.total])
  );

  const revenueMap = new Map(
    data.revenue.monthly.map((item) => [`${item.year}-${item.month}`, parseMoney(item.total)])
  );

  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const key = `${year}-${month}`;

    return {
      key,
      label: `Tháng ${month}/${year}`,
      year,
      month,
      bookings: bookingMap.get(key) ?? 0,
      revenue: revenueMap.get(key) ?? 0,
    };
  });
}

function buildYearlyRows(data: AdminDashboardResponse): DashboardRow[] {
  const bookingMap = new Map(data.bookings.yearly.map((item) => [String(item.year), item.total]));
  const revenueMap = new Map(
    data.revenue.yearly.map((item) => [String(item.year), parseMoney(item.total)])
  );

  const years = new Set<number>();

  data.bookings.yearly.forEach((item) => years.add(item.year));
  data.revenue.yearly.forEach((item) => years.add(item.year));
  data.bookings.monthly.forEach((item) => years.add(item.year));
  data.revenue.monthly.forEach((item) => years.add(item.year));
  data.bookings.daily.forEach((item) => years.add(new Date(item.date).getFullYear()));
  data.revenue.daily.forEach((item) => years.add(new Date(item.date).getFullYear()));

  return Array.from(years)
    .sort((a, b) => a - b)
    .map((year) => ({
      key: String(year),
      label: `Năm ${year}`,
      year,
      bookings: bookingMap.get(String(year)) ?? 0,
      revenue: revenueMap.get(String(year)) ?? 0,
    }));
}

function getAvailableYears(data?: AdminDashboardResponse) {
  if (!data) return [];

  const years = new Set<number>();

  data.bookings.daily.forEach((item) => years.add(new Date(item.date).getFullYear()));
  data.bookings.monthly.forEach((item) => years.add(item.year));
  data.bookings.yearly.forEach((item) => years.add(item.year));

  data.revenue.daily.forEach((item) => years.add(new Date(item.date).getFullYear()));
  data.revenue.monthly.forEach((item) => years.add(item.year));
  data.revenue.yearly.forEach((item) => years.add(item.year));

  return Array.from(years).sort((a, b) => b - a);
}

function sumRows(rows: DashboardRow[]): DashboardSummary {
  return rows.reduce(
    (acc, row) => {
      acc.totalBookings += row.bookings;
      acc.totalRevenue += row.revenue;
      acc.totalRows += 1;
      return acc;
    },
    {
      totalBookings: 0,
      totalRevenue: 0,
      totalRows: 0,
    }
  );
}

function buildInsights(rows: DashboardRow[], summary: DashboardSummary): DashboardInsightItem[] {
  if (!rows.length) {
    return [
      { title: "Ngày / kỳ cao nhất", value: "--", subtitle: "Chưa có dữ liệu" },
      { title: "Doanh thu cao nhất", value: "--", subtitle: "Chưa có dữ liệu" },
      { title: "Doanh thu trung bình", value: "--", subtitle: "Chưa có dữ liệu" },
    ];
  }

  const maxBookingRow = rows.reduce((best, row) =>
    row.bookings > best.bookings ? row : best
  );

  const maxRevenueRow = rows.reduce((best, row) =>
    row.revenue > best.revenue ? row : best
  );

  const avgRevenue = summary.totalRows > 0 ? summary.totalRevenue / summary.totalRows : 0;

  return [
    {
      title: "Booking cao nhất",
      value: `${maxBookingRow.bookings}`,
      subtitle: maxBookingRow.label,
    },
    {
      title: "Doanh thu cao nhất",
      value: formatCurrency(maxRevenueRow.revenue),
      subtitle: maxRevenueRow.label,
    },
    {
      title: "Doanh thu trung bình",
      value: formatCurrency(avgRevenue),
      subtitle: `Trên ${summary.totalRows} mốc thời gian`,
    },
  ];
}

export function useAdminDashboard() {
  const query = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminDashboardService.getDashboard,
  });

  const data = query.data;

  const availableYears = React.useMemo(() => getAvailableYears(data), [data]);

  const [viewType, setViewType] = React.useState<DashboardViewType>("day");
  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = React.useState<number>(new Date().getMonth() + 1);

  React.useEffect(() => {
    if (!data) return;
    if (!availableYears.length) return;

    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [data, availableYears, selectedYear]);

  const rows = React.useMemo(() => {
    if (!data) return [];

    if (viewType === "day") {
      return buildDailyRows(data, selectedYear, selectedMonth);
    }

    if (viewType === "month") {
      return buildMonthlyRows(data, selectedYear);
    }

    return buildYearlyRows(data);
  }, [data, viewType, selectedYear, selectedMonth]);

  const summary = React.useMemo(() => sumRows(rows), [rows]);
  const insights = React.useMemo(() => buildInsights(rows, summary), [rows, summary]);

  const filterLabel = React.useMemo(() => {
    if (viewType === "day") return `Theo ngày - Tháng ${selectedMonth}/${selectedYear}`;
    if (viewType === "month") return `Theo tháng - Năm ${selectedYear}`;
    return "Theo năm";
  }, [viewType, selectedMonth, selectedYear]);

  return {
    ...query,
    data,
    viewType,
    setViewType,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    availableYears,
    rows,
    summary,
    insights,
    filterLabel,
  };
}