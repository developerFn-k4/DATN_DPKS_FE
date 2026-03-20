import React from "react";
import type { DashboardSummary } from "../../types/dashboard";
 
type Props = {
  title: string;
  summary: DashboardSummary;
};

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")} đ`;
}

const cardClass =
  "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm";

export function DashboardSummaryCards({ title, summary }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">
          Dữ liệu đang hiển thị theo bộ lọc hiện tại
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className={cardClass}>
          <p className="text-sm text-slate-500">Số mốc thời gian</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {summary.totalRows}
          </p>
        </div>

        <div className={cardClass}>
          <p className="text-sm text-slate-500">Tổng booking</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {summary.totalBookings}
          </p>
        </div>

        <div className={cardClass}>
          <p className="text-sm text-slate-500">Tổng doanh thu</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {formatCurrency(summary.totalRevenue)}
          </p>
        </div>
      </div>
    </div>
  );
}