import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardRow, DashboardViewType } from "../../types/dashboard";
 
type Props = {
  rows: DashboardRow[];
  viewType: DashboardViewType;
};

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN");
}

function formatRevenueTick(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${value}`;
}

function getChartLabel(row: DashboardRow, viewType: DashboardViewType) {
  if (viewType === "day" && row.date) {
    const d = new Date(row.date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  }

  if (viewType === "month") {
    return `T${row.month}`;
  }

  return `${row.year}`;
}

export function DashboardBarChart({ rows, viewType }: Props) {
  const chartData = React.useMemo(() => {
    return rows.map((row) => ({
      ...row,
      chartLabel: getChartLabel(row, viewType),
    }));
  }, [rows, viewType]);

  if (!chartData.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Biểu đồ thống kê</h3>
        <div className="flex h-[360px] items-center justify-center text-slate-500">
          Không có dữ liệu để hiển thị biểu đồ
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Biểu đồ thống kê</h3>
        <p className="text-sm text-slate-500">
          So sánh số booking và doanh thu theo bộ lọc đang chọn
        </p>
      </div>

      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 16, left: 4, bottom: 8 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="chartLabel"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatRevenueTick}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "Doanh thu") {
                  return [`${formatCurrency(Number(value))} đ`, name];
                }
                return [value, name];
              }}
              labelFormatter={(label) => `Mốc: ${label}`}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="bookings"
              name="Booking"
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((item) => (
                <Cell key={`booking-${item.key}`} fill="#2563eb" />
              ))}
            </Bar>
            <Bar
              yAxisId="right"
              dataKey="revenue"
              name="Doanh thu"
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((item) => (
                <Cell key={`revenue-${item.key}`} fill="#16a34a" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}