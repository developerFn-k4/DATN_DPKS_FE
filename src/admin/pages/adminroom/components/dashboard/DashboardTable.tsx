import type { DashboardRow, DashboardViewType } from "../../types/dashboard";

 
type Props = {
  rows: DashboardRow[];
  viewType: DashboardViewType;
};

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN");
}

function getPeriodLabel(row: DashboardRow, viewType: DashboardViewType) {
  if (viewType === "day") return row.date || row.label;
  if (viewType === "month") return `Tháng ${row.month}/${row.year}`;
  return `Năm ${row.year}`;
}

export function DashboardTable({ rows, viewType }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-semibold">Mốc thời gian</th>
              <th className="px-4 py-3 font-semibold">Booking</th>
              <th className="px-4 py-3 font-semibold">Doanh thu</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.key} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">
                    {getPeriodLabel(row, viewType)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {row.bookings}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {formatCurrency(row.revenue)} đ
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}