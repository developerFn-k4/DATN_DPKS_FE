import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Tag, Spin, Empty, Card } from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { HomeHeader } from "../../../../components/Header/HomeHeader";
import { HomeFooter } from "../../../../components/Footer/HomeFooter";
import { paymentService, type MyBooking } from "../../../../services/payment/paymentService";

const STATUS_COLORS: Record<string, string> = {
  confirmed: "green",
  pending: "orange",
  cancelled: "red",
  checked_in: "blue",
  checked_out: "purple",
};

const PAYMENT_COLORS: Record<string, string> = {
  paid: "green",
  pending: "orange",
  failed: "red",
};

const formatDate = (d: string) => {
  if (!d) return "-";
  const [y, m, day] = d.split("T")[0].split("-");
  return `${day}/${m}/${y}`;
};

const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => paymentService.getMyBookings(),
    enabled: !!token,
    retry: 1,
  });

  if (!token) {
    return (
      <>
        <HomeHeader />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Bạn chưa đăng nhập</h2>
          <p className="text-slate-400 mb-6">Vui lòng đăng nhập để xem lịch sử đặt phòng.</p>
          <button
            type="button"
            onClick={() => navigate("/auth")}
            className="px-8 py-3 !bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
          >
            Đăng nhập
          </button>
        </div>
        <HomeFooter />
      </>
    );
  }

  return (
    <>
      <HomeHeader />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors text-sm"
          >
            <ArrowLeftOutlined /> Quay lại
          </button>
          <span className="text-slate-300">|</span>
          <h1 className="text-2xl font-black text-slate-800">Đơn đặt phòng của tôi</h1>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Spin size="large" tip="Đang tải danh sách đặt phòng..." />
          </div>
        )}

        {isError && 
        (
          <div className="py-10 text-center text-red-500">
            {(error as any)?.response?.data?.message || (error as any)?.message || "Không thể tải dữ liệu."}
          </div>
        )}

        {!isLoading && !isError && (!data?.data || data.data.length === 0) && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Bạn chưa có đơn đặt phòng nào."
          >
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 !bg-green-600 text-white font-bold rounded-xl !hover:bg-green-700 transition-colors"
            >
              <HomeOutlined /> Về trang chủ
            </button>
          </Empty>
        )}

        <div className="space-y-4">
          {data?.data?.map((booking: MyBooking) => (
            <Card key={booking.id} className="rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Đơn #</span>
                    <span className="text-lg font-black text-slate-800">{booking.id}</span>
                    <Tag color={STATUS_COLORS[booking.status] ?? "default"}>
                      {booking.status}
                    </Tag>
                  </div>

                  {booking.rooms && booking.rooms.length > 0 && (
                    <p className="text-slate-600 text-sm font-medium">
                      {booking.rooms.map((r) => `${r.name} × ${r.quantity}`).join(", ")}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <CalendarOutlined />
                      {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarOutlined />
                      {Number(booking.total_price).toLocaleString("vi-VN")} VND
                    </span>
                  </div>

                  {booking.payment && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Thanh toán:</span>
                      <Tag color={PAYMENT_COLORS[booking.payment.status] ?? "default"} className="text-xs">
                        {booking.payment.status}
                      </Tag>
                      <span className="text-slate-400">{booking.payment.method?.toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    {new Date(booking.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default MyBookingsPage;
