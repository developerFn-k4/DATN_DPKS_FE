import React from "react";
import { CalendarDays, CalendarRange, BarChart3 } from "lucide-react";
import type { DashboardViewType } from "../../types/dashboard";

type Props = {
  viewType: DashboardViewType;
  onChangeViewType: (value: DashboardViewType) => void;
  selectedYear: number;
  onChangeYear: (value: number) => void;
  selectedMonth: number;
  onChangeMonth: (value: number) => void;
  availableYears: number[];
};

const viewOptions: {
  label: string;
  value: DashboardViewType;
  icon: React.ReactNode;
}[] = [
  {
    label: "Theo ngày",
    value: "day",
    icon: <CalendarDays className="h-4 w-4" />,
  },
  {
    label: "Theo tháng",
    value: "month",
    icon: <CalendarRange className="h-4 w-4" />,
  },
  {
    label: "Theo năm",
    value: "year",
    icon: <BarChart3 className="h-4 w-4" />,
  },
];

export function DashboardFilterBar({
  viewType,
  onChangeViewType,
  selectedYear,
  onChangeYear,
  selectedMonth,
  onChangeMonth,
  availableYears,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900">Bộ lọc thống kê</h2>
          <p className="mt-1 text-sm text-slate-500">
            Xem dữ liệu booking và doanh thu theo ngày, tháng hoặc năm
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1">
            {viewOptions.map((item) => {
              const active = viewType === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onChangeViewType(item.value)}
                  className={[
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-black text-sm font-medium transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-slate-300",
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-900",
                  ].join(" ")}
                >
                  {item.icon}
                  <span className="text-black">{item.label}</span>
                </button>
              );
            })}
          </div>

          {viewType !== "year" && (
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Năm
              </span>
              <select
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
                value={selectedYear}
                onChange={(e) => onChangeYear(Number(e.target.value))}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}

          {viewType === "day" && (
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Tháng
              </span>
              <select
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
                value={selectedMonth}
                onChange={(e) => onChangeMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                  <option key={month} value={month}>
                    Tháng {month}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}