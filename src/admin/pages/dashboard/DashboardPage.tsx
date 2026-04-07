import React, { useEffect, useState } from "react";
import { Spin, Tag } from "antd";
import { motion } from "framer-motion";
import { FiHome, FiUsers, FiCalendar, FiLayers, FiTrendingUp } from "react-icons/fi";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import dayjs from "dayjs";
import { fetchDashboardData, type DashboardData } from "../../services/dashboardService";

const formatMoney = (val: number) =>
  val >= 1_000_000
    ? (val / 1_000_000).toFixed(1) + " tr₫"
    : val.toLocaleString("vi-VN") + " ₫";

const formatFullMoney = (val: number) =>
  new Intl.NumberFormat("vi-VN").format(val) + " ₫";

const PIE_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#f97316"];

const statusConfig: Record<string, { color: string; label: string }> = {
  completed:  { color: "success",   label: "Hoàn thành" },
  confirmed:  { color: "processing", label: "Xác nhận" },
  pending:    { color: "warning",   label: "Chờ xử lý" },
  cancelled:  { color: "error",     label: "Đã hủy" },
};

const paymentConfig: Record<string, { color: string; label: string }> = {
  paid:   { color: "green",  label: "Đã thanh toán" },
  unpaid: { color: "orange", label: "Chưa thanh toán" },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
};

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData()
      .then(setData)
      .catch(() => {/* handled by empty state */})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        Không thể tải dữ liệu
      </div>
    );
  }

  const monthlyRevenue = parseFloat(data.revenue.monthly[0]?.total ?? "0");
  const todayBookings  = data.bookings.daily[0]?.total ?? 0;

  const stats = [
    {
      title: "Tổng phòng",
      value: data.stats.total_rooms,
      sub: `${data.stats.total_room_types} loại phòng`,
      icon: <FiHome className="text-xl" />,
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      border: "border-emerald-100",
    },
    {
      title: "Tổng đặt phòng",
      value: data.stats.total_bookings,
      sub: `${todayBookings} lượt hôm nay`,
      icon: <FiCalendar className="text-xl" />,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      border: "border-blue-100",
    },
    {
      title: "Khách hàng",
      value: data.stats.total_users,
      sub: "Tài khoản đã đăng ký",
      icon: <FiUsers className="text-xl" />,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      border: "border-purple-100",
    },
    {
      title: "Loại phòng",
      value: data.stats.total_room_types,
      sub: "Danh mục phòng",
      icon: <FiLayers className="text-xl" />,
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      border: "border-amber-100",
    },
  ];

  // Revenue chart data — daily
  const revenueChartData = data.revenue.daily.map((d) => ({
    date: dayjs(d.date).format("DD/MM"),
    revenue: parseFloat(d.total) / 1_000_000,
    rawRevenue: parseFloat(d.total),
  }));

  // Bookings chart data — daily
  const bookingChartData = data.bookings.daily.map((d) => ({
    date: dayjs(d.date ?? "").format("DD/MM"),
    bookings: d.total,
  }));

  // Pie chart — room type percentage (only non-zero for clean display)
  const pieData = data.room_type_percentage
    .filter((r) => parseFloat(r.percentage) > 0)
    .map((r) => ({ name: r.name, value: parseFloat(r.percentage) }));

  // Fallback: if all are 0, show all to avoid empty pie
  const pieDataFinal = pieData.length > 0
    ? pieData
    : data.room_type_percentage.map((r) => ({ name: r.name, value: 1 }));

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-2"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Xin chào, {data.admin.name} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {dayjs().format("dddd, DD/MM/YYYY")} · Tổng quan hệ thống VietStay
          </p>
        </div>
        {/* Monthly revenue highlight */}
        <div className="flex items-center gap-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-2xl px-5 py-3 shadow-md shadow-emerald-100">
          <FiTrendingUp className="text-2xl shrink-0" />
          <div>
            <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide">Doanh thu tháng</p>
            <p className="text-xl font-black">{formatFullMoney(monthlyRevenue)}</p>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className={`${s.bg} ${s.border} border rounded-2xl p-5 flex items-center gap-4`}
          >
            <div className={`${s.iconBg} ${s.iconColor} rounded-xl p-3 shrink-0`}>
              {s.icon}
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-black text-slate-800 leading-tight">{s.value}</p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">{s.title}</p>
              <p className="text-[11px] text-slate-400 truncate">{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Revenue area chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Doanh thu theo ngày</h3>
              <p className="text-xs text-slate-400 mt-0.5">Đơn vị: triệu đồng</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}tr`} />
              <Tooltip
                formatter={(val: number) => [formatFullMoney(val * 1_000_000), "Doanh thu"]}
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 4, fill: "#10b981" }} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Bookings bar below */}
          <div className="mt-6">
            <h4 className="font-semibold text-slate-700 text-sm mb-3">Số lượng đặt phòng theo ngày</h4>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={bookingChartData} margin={{ top: 0, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(val: number) => [val, "Đặt phòng"]}
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }}
                />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Room type pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <h3 className="font-bold text-slate-800 mb-1">Phân bố loại phòng</h3>
          <p className="text-xs text-slate-400 mb-4">Tỷ lệ đặt phòng theo loại</p>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieDataFinal}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {pieDataFinal.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number) => [`${val.toFixed(2)}%`, "Tỷ lệ"]}
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Top room types list */}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Top đặt nhiều nhất</p>
            {data.top_room_types.slice(0, 4).map((rt, i) => (
              <div key={rt.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-sm text-slate-600 truncate">{rt.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800 shrink-0 ml-2">
                  {rt.total_bookings}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Latest bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800">Đặt phòng gần đây</h3>
            <p className="text-xs text-slate-400 mt-0.5">{data.latest_bookings.length} giao dịch mới nhất</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-6 py-3 font-semibold">Mã đặt phòng</th>
                <th className="text-left px-4 py-3 font-semibold">Khách hàng</th>
                <th className="text-left px-4 py-3 font-semibold">Check-in → Check-out</th>
                <th className="text-center px-4 py-3 font-semibold">Đêm / Khách</th>
                <th className="text-right px-4 py-3 font-semibold">Tổng tiền</th>
                <th className="text-center px-4 py-3 font-semibold">Trạng thái</th>
                <th className="text-center px-6 py-3 font-semibold">Thanh toán</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.latest_bookings.map((b, i) => {
                const st = statusConfig[b.status] ?? { color: "default", label: b.status };
                const pt = paymentConfig[b.payment_status] ?? { color: "default", label: b.payment_status };
                return (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                        {b.booking_code}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-800">{b.name}</p>
                      <p className="text-slate-400 text-xs">{b.email}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {dayjs(b.check_in).format("DD/MM/YY")}
                      <span className="mx-1 text-slate-300">→</span>
                      {dayjs(b.check_out).format("DD/MM/YY")}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600">
                      <span className="font-semibold">{b.nights}</span>
                      <span className="text-slate-300 mx-1">/</span>
                      <span>{b.guests}</span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-slate-800">
                      {formatMoney(parseFloat(b.total_price))}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Tag color={st.color} className="rounded-full text-xs px-2">
                        {st.label}
                      </Tag>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Tag color={pt.color} className="rounded-full text-xs px-2">
                        {pt.label}
                      </Tag>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
