/**
 * Statistics.tsx
 * Trang thống kê admin — tổng quan hệ thống, booking, doanh thu.
 * API: GET /admin/dashboard  +  GET /admin/stats
 * Bộ lọc: theo ngày | theo tháng | theo năm | khoảng ngày tùy chọn
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ===================== CONSTANTS =====================

const BASE_URL = import.meta.env.VITE_API_URL as string;

const NOW           = new Date();
const CURRENT_YEAR  = NOW.getFullYear();
const CURRENT_MONTH = NOW.getMonth() + 1;

const YEARS  = [2023, 2024, 2025, 2026];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const TABS = [
  { label: 'Theo ngày',    value: 'daily'   },
  { label: 'Theo tháng',  value: 'monthly' },
  { label: 'Theo năm',    value: 'yearly'  },
  { label: 'Khoảng ngày', value: 'range'   },
] as const;

type Mode = 'daily' | 'monthly' | 'yearly' | 'range';

// ===================== TYPES =====================

interface DashStats {
  total_rooms: number;
  total_room_types: number;
  total_users: number;
  total_bookings: number;
}

interface Summary {
  total_periods:  number;
  total_bookings: number;
  total_revenue:  number;
  max_booking:    { value: number; label: string };
  max_revenue:    { value: number; label: string };
  avg_revenue:    number;
  active_periods: number;
}

interface ChartPoint {
  label:          string;
  total_bookings: number;
  total_revenue:  number;
}

interface StatsData {
  period_label: string;
  summary:      Summary;
  chart:        ChartPoint[];
}

// ===================== HELPERS =====================

/** Format số thành tiền VND: 253660000 → "253.660.000 đ" */
const formatMoney = (value: number): string =>
  (value || 0).toLocaleString('vi-VN') + ' đ';

/** Rút gọn số lớn cho trục Y: 164410000 → "164.4M" */
const formatMillions = (value: number): string => {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B';
  if (value >= 1_000_000)     return (value / 1_000_000).toFixed(1) + 'M';
  if (value >= 1_000)         return (value / 1_000).toFixed(0) + 'K';
  return String(value);
};

/** Header chuẩn cho mọi request admin */
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
  Accept: 'application/json',
});

// ===================== SUB-COMPONENTS =====================

/** Thẻ chỉ số thống kê */
const StatCard = ({
  label,
  value,
  sub,
  subColor = 'text-gray-400',
}: {
  label:    string;
  value:    string | number;
  sub?:     string;
  subColor?: string;
}) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
    <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">{label}</p>
    <p className="text-2xl font-black text-slate-800 leading-tight">{value}</p>
    {sub && <p className={`text-xs font-semibold mt-1.5 ${subColor}`}>{sub}</p>}
  </div>
);

/** Tooltip tùy chỉnh cho biểu đồ booking */
const BookingTooltip = ({
  active, payload, label,
}: {
  active?:  boolean;
  payload?: { value: number }[];
  label?:   string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-black text-blue-600">{payload[0].value} booking</p>
    </div>
  );
};

/** Tooltip tùy chỉnh cho biểu đồ doanh thu */
const RevenueTooltip = ({
  active, payload, label,
}: {
  active?:  boolean;
  payload?: { value: number }[];
  label?:   string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-black text-green-600">{formatMoney(payload[0].value)}</p>
    </div>
  );
};

// ===================== MAIN COMPONENT =====================

const Statistics = () => {
  // ---- Bộ lọc ----
  const [mode,  setMode]  = useState<Mode>('daily');
  const [year,  setYear]  = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);

  // Input date (chưa áp dụng)
  const [fromDate, setFromDate] = useState('');
  const [toDate,   setToDate]   = useState('');

  // Applied range — chỉ thay đổi khi bấm "Áp dụng"
  const [appliedFrom, setAppliedFrom] = useState('');
  const [appliedTo,   setAppliedTo]   = useState('');

  // ---- Dữ liệu ----
  const [dashStats, setDashStats] = useState<DashStats | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading,   setLoading]   = useState(false);

  // ---- Tải tổng quan từ dashboard (1 lần khi mount) ----
  const fetchDashboard = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/dashboard`, {
        headers: getHeaders(),
      });
      setDashStats(res.data?.stats ?? null);
    } catch (err) {
      console.error('Lỗi tải dashboard:', err);
    }
  }, []);

  // ---- Tải dữ liệu thống kê theo bộ lọc ----
  const fetchStats = useCallback(async () => {
    // Chế độ khoảng ngày: chỉ gọi API sau khi bấm Áp dụng
    if (mode === 'range') {
      if (!appliedFrom || !appliedTo) return;
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/admin/stats`, {
          headers: getHeaders(),
          params: { from_date: appliedFrom, to_date: appliedTo },
        });
        setStatsData(res.data ?? null);
      } catch (err) {
        console.error('Lỗi tải thống kê khoảng ngày:', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Các chế độ còn lại: daily / monthly / yearly
    setLoading(true);
    try {
      const params: Record<string, string | number> = { mode };
      if (mode !== 'yearly') params.year  = year;
      if (mode === 'daily')  params.month = month;

      const res = await axios.get(`${BASE_URL}/admin/stats`, {
        headers: getHeaders(),
        params,
      });
      setStatsData(res.data ?? null);
    } catch (err) {
      console.error('Lỗi tải thống kê:', err);
    } finally {
      setLoading(false);
    }
  }, [mode, year, month, appliedFrom, appliedTo]);

  // Gọi lần đầu khi mount
  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // Gọi lại mỗi khi bộ lọc thay đổi
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ---- Đổi tab mode: xóa kết quả cũ để tránh stale data ----
  const handleSetMode = (m: Mode) => {
    setMode(m);
    setStatsData(null);
    // Reset applied range khi rời khỏi chế độ khoảng ngày
    if (m !== 'range') {
      setAppliedFrom('');
      setAppliedTo('');
    }
  };

  // ---- Xử lý nút Áp dụng (range mode) ----
  const handleApplyRange = () => {
    if (!fromDate || !toDate) {
      alert('Vui lòng chọn đủ ngày bắt đầu và ngày kết thúc.');
      return;
    }
    if (toDate < fromDate) {
      alert('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.');
      return;
    }
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
  };

  // Hiện placeholder khi ở chế độ range nhưng chưa áp dụng
  const showRangePlaceholder = mode === 'range' && (!appliedFrom || !appliedTo);

  // ===================== RENDER =====================

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans space-y-6">

      {/* ===== PHẦN 1 – HEADER ===== */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Thống Kê</h1>
        <p className="text-sm text-gray-400 mt-1">
          Theo dõi tổng quan hệ thống, booking và doanh thu
        </p>
      </div>

      {/* ===== PHẦN 2 – 3 THẺ TỔNG QUAN (dashboard) ===== */}
      <div className="flex justify-end gap-4 flex-wrap">
        {[
          { label: 'Tổng số phòng', value: dashStats?.total_rooms },
          { label: 'Loại phòng',    value: dashStats?.total_room_types },
          { label: 'Người dùng',    value: dashStats?.total_users },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100 min-w-[140px]"
          >
            <p className="text-xs text-gray-400 font-medium">{card.label}</p>
            <p className="text-3xl font-black text-slate-800 mt-1">
              {card.value ?? '—'}
            </p>
          </div>
        ))}
      </div>

      {/* ===== PHẦN 3 – BỘ LỌC ===== */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h3 className="font-bold text-slate-800">Bộ lọc thống kê</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Xem dữ liệu theo ngày, tháng, năm hoặc khoảng ngày tùy chọn
          </p>
        </div>

        {/* Hàng 1: 4 tab */}
        <div className="flex flex-wrap gap-2 mb-5">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleSetMode(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                mode === tab.value
                  ? 'border-2 border-black font-bold text-black bg-white'
                  : 'border border-gray-200 text-gray-500 hover:border-gray-400 bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hàng 2: controls theo mode */}
        <div className="flex flex-wrap gap-3 items-end">

          {/* daily: năm + tháng */}
          {mode === 'daily' && (
            <>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
              >
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
              >
                {MONTHS.map((m) => <option key={m} value={m}>Tháng {m}</option>)}
              </select>
            </>
          )}

          {/* monthly: chỉ năm */}
          {mode === 'monthly' && (
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
            >
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          )}

          {/* yearly: không có control bổ sung */}

          {/* range: from – to + Áp dụng */}
          {mode === 'range' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 font-medium">Từ ngày</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 font-medium">Đến ngày</label>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                />
              </div>
              <button
                onClick={handleApplyRange}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors self-end"
              >
                Áp dụng
              </button>
            </>
          )}
        </div>
      </div>

      {/* ===== NỘI DUNG KẾT QUẢ ===== */}
      {showRangePlaceholder ? (
        /* Placeholder khi chưa chọn khoảng ngày */
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-sm font-medium">Chọn khoảng ngày để xem thống kê</p>
        </div>

      ) : loading ? (
        /* Loading spinner */
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-400 font-medium">Đang tải dữ liệu...</p>
        </div>

      ) : statsData ? (
        <>
          {/* ===== PHẦN 4 – TIÊU ĐỀ KẾT QUẢ ===== */}
          <div>
            <h2 className="text-xl font-bold text-slate-800">{statsData.period_label}</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Dữ liệu đang hiển thị theo bộ lọc hiện tại
            </p>
          </div>

          {/* ===== PHẦN 5 – 6 THẺ CHỈ SỐ ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Hàng 1 */}
            <StatCard label="Số mốc thời gian" value={statsData.summary.total_periods} />
            <StatCard label="Tổng booking"      value={statsData.summary.total_bookings} />
            <StatCard label="Tổng doanh thu"    value={formatMoney(statsData.summary.total_revenue)} />

            {/* Hàng 2 */}
            <StatCard
              label="Booking cao nhất"
              value={statsData.summary.max_booking.value}
              sub={statsData.summary.max_booking.label}
              subColor="text-blue-500"
            />
            <StatCard
              label="Doanh thu cao nhất"
              value={formatMoney(statsData.summary.max_revenue.value)}
              sub={statsData.summary.max_revenue.label}
              subColor="text-blue-500"
            />
            <StatCard
              label="Doanh thu trung bình"
              value={formatMoney(statsData.summary.avg_revenue)}
              sub={`Trên ${statsData.summary.active_periods} mốc thời gian`}
              subColor="text-gray-400"
            />
          </div>

          {/* ===== PHẦN 6 – 2 BIỂU ĐỒ (50/50) ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Biểu đồ Booking */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-slate-800">Booking</h3>
              <p className="text-xs text-gray-400 mt-0.5 mb-5">
                Biểu đồ số lượng booking theo bộ lọc đang chọn
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={statsData.chart}
                  margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                    width={28}
                    allowDecimals={false}
                  />
                  <Tooltip content={<BookingTooltip />} cursor={{ fill: '#f0f9ff' }} />
                  <Bar
                    dataKey="total_bookings"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Biểu đồ Doanh thu */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-slate-800">Doanh thu</h3>
              <p className="text-xs text-gray-400 mt-0.5 mb-5">
                Biểu đồ doanh thu theo bộ lọc đang chọn
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={statsData.chart}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatMillions}
                    width={42}
                  />
                  <Tooltip content={<RevenueTooltip />} cursor={{ fill: '#f0fdf4' }} />
                  <Bar
                    dataKey="total_revenue"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-400 text-sm">
          Không có dữ liệu thống kê.
        </div>
      )}

    </div>
  );
};

export default Statistics;
