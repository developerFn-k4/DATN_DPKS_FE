/**
 * BookingDetail.tsx
 * Trang chi tiết đơn đặt phòng cho admin.
 * Hiển thị: thông tin khách, booking, phòng, dịch vụ, thanh toán.
 * Hỗ trợ: cập nhật thông tin + status, xóa đơn.
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookingApi, type Booking, type BookingStatus } from '../../services/adminApi';

// ===================== HELPERS =====================

const BOOKING_STATUS_OPTIONS: BookingStatus[] = [
  'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'completed',
];

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  checked_in: 'Đã nhận phòng',
  checked_out: 'Đã trả phòng',
  cancelled: 'Đã hủy',
  completed: 'Hoàn thành',
};

const STATUS_CLS: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  checked_in: 'bg-emerald-100 text-emerald-700',
  checked_out: 'bg-slate-100 text-slate-600',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-purple-100 text-purple-700',
};

const PAYMENT_STATUS_CLS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  success: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ thanh toán',
  success: 'Thành công',
  failed: 'Thất bại',
};

// Format ngày từ ISO string sang dd/mm/yyyy
const fmtDate = (s: string) => new Date(s).toLocaleDateString('vi-VN');

// Format tiền VND
const fmtMoney = (n: number) =>
  n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

// ===================== SUB-COMPONENTS =====================

// Card tiêu đề section
const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">
      {title}
    </h3>
    {children}
  </div>
);

// Dòng nhãn - giá trị
const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-start py-1.5 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-400 font-medium min-w-[120px]">{label}</span>
    <span className="text-sm font-bold text-slate-700 text-right">{value}</span>
  </div>
);

// ===================== MAIN COMPONENT =====================

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // State cho form chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '' as BookingStatus,
    name: '',
    phone: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ---- Tải dữ liệu booking ----
  const fetchBooking = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await bookingApi.getById(id);
      const data = res.data?.data;
      setBooking(data);
      // Đồng bộ form edit với dữ liệu mới nhất
      setEditForm({
        status: data.status,
        name: data.name,
        phone: data.phone,
        email: data.email,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải đơn đặt phòng';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  // ---- Lưu cập nhật ----
  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await bookingApi.update(id, editForm);
      toast.success('Cập nhật đơn đặt phòng thành công!');
      setIsEditing(false);
      await fetchBooking();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cập nhật thất bại';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ---- Xóa đơn ----
  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm(`Bạn chắc chắn muốn xóa đơn ${booking?.booking_code}?`)) return;
    setDeleting(true);
    try {
      await bookingApi.delete(id);
      toast.success('Đã xóa đơn đặt phòng!');
      navigate('/admin/bookings');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Xóa thất bại';
      toast.error(msg);
      setDeleting(false);
    }
  };

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-gray-400">Đang tải đơn đặt phòng...</p>
      </div>
    );
  }

  // ---- Not found ----
  if (!booking) {
    return (
      <div className="p-8 text-center">
        <p className="text-2xl font-black text-gray-200 mb-2">404</p>
        <p className="text-gray-400 text-sm mb-4">Không tìm thấy đơn đặt phòng.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-bold hover:underline bg-transparent border-none cursor-pointer"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* ===== Header ===== */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800">
              Đơn đặt phòng #{booking.booking_code}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Tạo ngày {fmtDate(booking.created_at)}
            </p>
          </div>
          {/* Badge trạng thái */}
          <span
            className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase ${STATUS_CLS[booking.status]}`}
          >
            {STATUS_LABEL[booking.status]}
          </span>
        </div>

        {/* Nút hành động */}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {saving && (
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                )}
                Lưu thay đổi
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
              >
                ✏️ Chỉnh sửa
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-colors disabled:opacity-60"
              >
                🗑 Xóa đơn
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Cột trái: Thông tin chính ===== */}
        <div className="lg:col-span-2 space-y-5">
          {/* ---- Thông tin khách hàng ---- */}
          <SectionCard title="Thông tin khách hàng">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider block mb-1">
                    Họ tên
                  </label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider block mb-1">
                      Số điện thoại
                    </label>
                    <input
                      value={editForm.phone}
                      onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider block mb-1">
                      Email
                    </label>
                    <input
                      value={editForm.email}
                      onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Row label="Họ tên" value={booking.name} />
                <Row label="Số điện thoại" value={booking.phone} />
                <Row label="Email" value={booking.email} />
                {booking.user && (
                  <Row
                    label="Tài khoản"
                    value={
                      <span className="text-indigo-600">
                        {booking.user.name} ({booking.user.email})
                      </span>
                    }
                  />
                )}
              </>
            )}
          </SectionCard>

          {/* ---- Danh sách phòng ---- */}
          <SectionCard title={`Phòng đã đặt (${booking.booking_rooms?.length ?? 0} phòng)`}>
            {booking.booking_rooms?.length > 0 ? (
              <div className="space-y-2">
                {booking.booking_rooms.map((br) => (
                  <div
                    key={br.id}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                  >
                    <div>
                      <p className="font-black text-slate-700 text-sm">
                        Phòng {br.room?.room_number}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {br.room?.room_type?.name}
                      </p>
                    </div>
                    <span className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-lg font-medium text-gray-500">
                      ID #{br.room_id}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Không có phòng nào</p>
            )}
          </SectionCard>

          {/* ---- Danh sách dịch vụ ---- */}
          <SectionCard title={`Dịch vụ đã dùng (${booking.services?.length ?? 0})`}>
            {booking.services?.length > 0 ? (
              <div className="space-y-2">
                {booking.services.map((bs) => (
                  <div
                    key={bs.id}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                  >
                    <div>
                      <p className="font-bold text-slate-700 text-sm">{bs.service?.name}</p>
                      <p className="text-xs text-gray-400">{bs.service?.type}</p>
                    </div>
                    <span className="font-black text-orange-500 text-sm">
                      {fmtMoney(bs.service?.price ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Không sử dụng dịch vụ</p>
            )}
          </SectionCard>
        </div>

        {/* ===== Cột phải: Booking Info + Payment ===== */}
        <div className="space-y-5">
          {/* ---- Thông tin booking ---- */}
          <SectionCard title="Thông tin đặt phòng">
            <Row label="Mã đơn" value={<span className="font-mono">{booking.booking_code}</span>} />
            <Row label="Check-in" value={fmtDate(booking.check_in)} />
            <Row label="Check-out" value={fmtDate(booking.check_out)} />
            <Row
              label="Tổng tiền"
              value={
                <span className="text-orange-500 font-black">
                  {fmtMoney(booking.total_price)}
                </span>
              }
            />
            {/* Dropdown thay đổi status */}
            <div className="pt-3 border-t border-gray-50 mt-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                Trạng thái đơn
              </label>
              <select
                value={isEditing ? editForm.status : booking.status}
                onChange={(e) =>
                  isEditing
                    ? setEditForm((p) => ({ ...p, status: e.target.value as BookingStatus }))
                    : undefined
                }
                disabled={!isEditing}
                className={`w-full border rounded-xl p-2.5 text-sm font-bold outline-none transition-all ${
                  isEditing
                    ? 'border-indigo-400 bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer'
                    : `border-gray-100 cursor-not-allowed ${STATUS_CLS[booking.status]}`
                }`}
              >
                {BOOKING_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              {!isEditing && (
                <p className="text-[10px] text-gray-400 mt-1">Click "Chỉnh sửa" để thay đổi</p>
              )}
            </div>
          </SectionCard>

          {/* ---- Thông tin thanh toán ---- */}
          {booking.payment && (
            <SectionCard title="Thanh toán">
              <Row label="Mã giao dịch" value={<span className="font-mono text-xs">{booking.payment.order_id}</span>} />
              <Row
                label="Số tiền"
                value={
                  <span className="text-orange-500 font-black">
                    {fmtMoney(booking.payment.amount)}
                  </span>
                }
              />
              <Row
                label="Phương thức"
                value={<span className="uppercase">{booking.payment.method}</span>}
              />
              <Row
                label="Trạng thái"
                value={
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      PAYMENT_STATUS_CLS[booking.payment.status]
                    }`}
                  >
                    {PAYMENT_STATUS_LABEL[booking.payment.status]}
                  </span>
                }
              />
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
