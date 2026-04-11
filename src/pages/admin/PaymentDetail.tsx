/**
 * PaymentDetail.tsx
 * Trang chi tiết thanh toán cho admin.
 * Lấy bookingId từ URL param, gọi GET /admin/bookings/{id}
 * rồi hiển thị phần payment + booking_code + total_price.
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookingApi, type Booking } from '../../services/adminApi';

// ===================== HELPERS =====================

const PAYMENT_STATUS_CLS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: '⏳ Chờ thanh toán',
  success: '✓ Thành công',
  failed: '✕ Thất bại',
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  vnpay: 'VNPay',
  momo: 'MoMo',
  cash: 'Tiền mặt',
  bank: 'Chuyển khoản',
};

const fmtMoney = (n: number) =>
  n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const fmtDate = (s: string) =>
  new Date(s).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// ===================== SUB-COMPONENTS =====================

const InfoRow = ({
  label,
  value,
  large,
}: {
  label: string;
  value: React.ReactNode;
  large?: boolean;
}) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-400 font-medium">{label}</span>
    <span className={`font-bold text-slate-700 ${large ? 'text-xl' : 'text-sm'}`}>{value}</span>
  </div>
);

// ===================== MAIN COMPONENT =====================

const PaymentDetail = () => {
  // Route có thể là /admin/payments/:bookingId
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // Tải thông tin booking → lấy phần payment
  const fetchData = useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    try {
      const res = await bookingApi.getById(bookingId);
      setBooking(res.data?.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải thông tin thanh toán';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-gray-400">Đang tải thông tin thanh toán...</p>
      </div>
    );
  }

  // ---- Không tìm thấy ----
  if (!booking || !booking.payment) {
    return (
      <div className="p-8 text-center">
        <p className="text-5xl mb-3">💳</p>
        <p className="text-gray-400 text-sm mb-4">Không tìm thấy thông tin thanh toán.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-bold hover:underline bg-transparent border-none cursor-pointer"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  const { payment } = booking;
  const statusCls = PAYMENT_STATUS_CLS[payment.status] ?? 'bg-gray-100 text-gray-600 border-gray-200';

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-800">Chi tiết thanh toán</h1>
          <p className="text-xs text-gray-400 mt-0.5">Đơn #{booking.booking_code}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* ===== Badge trạng thái lớn ===== */}
        <div className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-2 ${statusCls}`}>
          <span className="text-3xl font-black">
            {PAYMENT_STATUS_LABEL[payment.status]}
          </span>
        </div>

        {/* ===== Card thông tin chính ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">
            Thông tin giao dịch
          </h3>

          <InfoRow
            label="Mã đơn đặt phòng"
            value={<span className="font-mono text-indigo-600">{booking.booking_code}</span>}
          />
          <InfoRow
            label="Mã giao dịch"
            value={<span className="font-mono text-xs">{payment.order_id}</span>}
          />
          <InfoRow
            label="Phương thức thanh toán"
            value={PAYMENT_METHOD_LABEL[payment.method] ?? payment.method.toUpperCase()}
          />
          <InfoRow
            label="Số tiền thanh toán"
            value={
              <span className="text-orange-500 font-black text-lg">
                {fmtMoney(payment.amount)}
              </span>
            }
          />
          <InfoRow
            label="Tổng giá trị đơn"
            value={fmtMoney(booking.total_price)}
          />
        </div>

        {/* ===== Card thông tin đặt phòng kèm theo ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">
            Thông tin đơn đặt phòng
          </h3>
          <InfoRow label="Khách hàng" value={booking.name} />
          <InfoRow label="Email" value={booking.email} />
          <InfoRow label="Check-in" value={booking.check_in} />
          <InfoRow label="Check-out" value={booking.check_out} />
          <InfoRow
            label="Ngày tạo đơn"
            value={fmtDate(booking.created_at)}
          />
        </div>

        {/* ===== Nút điều hướng ===== */}
        <button
          onClick={() => navigate(`/admin/bookings/${bookingId}`)}
          className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          Xem chi tiết đơn đặt phòng →
        </button>
      </div>
    </div>
  );
};

export default PaymentDetail;
