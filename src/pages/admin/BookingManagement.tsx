/**
 * BookingManagement.tsx — Quản lý đặt phòng
 * Hiển thị các booking đang hoạt động, phân nhóm theo trạng thái.
 * Hỗ trợ: tìm kiếm, lọc status, cập nhật nhanh, xóa, xem chi tiết.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookingApi, type Booking, type BookingStatus } from '../../services/adminApi';

// ===================== HELPERS =====================

const STATUS_OPTIONS: { value: BookingStatus | ''; label: string }[] = [
  { value: '', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'checked_in', label: 'Đã nhận phòng' },
  { value: 'checked_out', label: 'Đã trả phòng' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: 'completed', label: 'Hoàn thành' },
];

const STATUS_CLS: Record<BookingStatus, string> = {
  pending:     'bg-amber-100 text-amber-700',
  confirmed:   'bg-blue-100 text-blue-700',
  checked_in:  'bg-emerald-100 text-emerald-700',
  checked_out: 'bg-slate-100 text-slate-600',
  cancelled:   'bg-red-100 text-red-700',
  completed:   'bg-purple-100 text-purple-700',
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending:     'Chờ xác nhận',
  confirmed:   'Đã xác nhận',
  checked_in:  'Đã nhận phòng',
  checked_out: 'Đã trả phòng',
  cancelled:   'Đã hủy',
  completed:   'Hoàn thành',
};

// Màu border của card theo status
const CARD_BORDER: Record<BookingStatus, string> = {
  pending:     'border-l-amber-400',
  confirmed:   'border-l-blue-400',
  checked_in:  'border-l-emerald-400',
  checked_out: 'border-l-slate-300',
  cancelled:   'border-l-red-400',
  completed:   'border-l-purple-400',
};

// Bước chuyển status nhanh (confirm / check-in / check-out)
const QUICK_ACTIONS: Partial<Record<BookingStatus, { next: BookingStatus; label: string; cls: string }>> = {
  pending:    { next: 'confirmed',   label: '✓ Xác nhận',   cls: 'bg-blue-600 text-white hover:bg-blue-700' },
  confirmed:  { next: 'checked_in',  label: '🔑 Nhận phòng', cls: 'bg-emerald-600 text-white hover:bg-emerald-700' },
  checked_in: { next: 'checked_out', label: '🚪 Trả phòng',  cls: 'bg-slate-600 text-white hover:bg-slate-700' },
};

const fmtDate = (s: string) => new Date(s).toLocaleDateString('vi-VN');
const fmtMoney = (n: number) => n.toLocaleString('vi-VN') + ' đ';

// Lấy mảng booking từ response (hỗ trợ cả array trực tiếp lẫn pagination object)
const extractBookings = (data: unknown): Booking[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'data' in data) {
    const inner = (data as { data: unknown }).data;
    if (Array.isArray(inner)) return inner;
  }
  return [];
};

// ===================== MAIN COMPONENT =====================

const BookingManagement = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | ''>('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Tải danh sách booking
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...(filterStatus ? { status: filterStatus } : {}),
        ...(search.trim() ? { search: search.trim() } : {}),
      };
      const res = await bookingApi.getAll(params);
      setBookings(extractBookings(res.data?.data ?? res.data));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải danh sách đặt phòng';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Cập nhật status nhanh
  const handleQuickAction = async (booking: Booking, nextStatus: BookingStatus) => {
    setUpdatingId(booking.id);
    try {
      await bookingApi.update(booking.id, { status: nextStatus });
      toast.success(`Đã chuyển sang "${STATUS_LABEL[nextStatus]}"!`);
      await fetchBookings();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Cập nhật thất bại');
    } finally {
      setUpdatingId(null);
    }
  };

  // Xóa booking
  const handleDelete = async (booking: Booking) => {
    if (!window.confirm(`Xóa đơn ${booking.booking_code}?`)) return;
    setDeletingId(booking.id);
    try {
      await bookingApi.delete(booking.id);
      toast.success('Đã xóa đơn đặt phòng!');
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Xóa thất bại');
    } finally {
      setDeletingId(null);
    }
  };

  // Đếm booking theo status
  const countByStatus = (s: BookingStatus) => bookings.filter((b) => b.status === s).length;

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans">

      {/* ===== Header ===== */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quản Lý Đặt Phòng</h1>
        <p className="text-sm text-gray-400 mt-1">Theo dõi và xử lý các booking đang hoạt động</p>
      </div>

      {/* ===== Thống kê nhanh ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(
          [
            { status: 'pending',    label: 'Chờ xác nhận', color: 'text-amber-600',   bg: 'bg-amber-50'  },
            { status: 'confirmed',  label: 'Đã xác nhận',  color: 'text-blue-600',    bg: 'bg-blue-50'   },
            { status: 'checked_in', label: 'Đang ở',       color: 'text-emerald-600', bg: 'bg-emerald-50'},
            { status: 'cancelled',  label: 'Đã hủy',       color: 'text-red-600',     bg: 'bg-red-50'    },
          ] as const
        ).map((item) => (
          <button
            key={item.status}
            onClick={() => setFilterStatus(filterStatus === item.status ? '' : item.status)}
            className={`${item.bg} rounded-2xl p-4 text-left transition-all border-2 ${
              filterStatus === item.status ? 'border-current scale-[1.02] shadow-md' : 'border-transparent'
            } ${item.color}`}
          >
            <p className="text-xs font-medium opacity-70">{item.label}</p>
            <p className="text-3xl font-black mt-1">{countByStatus(item.status as BookingStatus)}</p>
          </button>
        ))}
      </div>

      {/* ===== Bộ lọc + tìm kiếm ===== */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Tìm mã đặt phòng, tên khách..."
          className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
        />
        {/* Filter status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as BookingStatus | '')}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {/* Reset */}
        {(filterStatus || search) && (
          <button
            onClick={() => { setFilterStatus(''); setSearch(''); }}
            className="text-sm text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl px-3 py-2 bg-white"
          >
            ✕ Xóa lọc
          </button>
        )}
        <span className="text-xs text-gray-400 ml-auto">{bookings.length} kết quả</span>
      </div>

      {/* ===== Danh sách booking dạng card ===== */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-400">Đang tải...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm font-medium">Không có đặt phòng nào{filterStatus ? ` ở trạng thái "${STATUS_LABEL[filterStatus]}"` : ''}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const quickAction = QUICK_ACTIONS[booking.status];
            const isUpdating = updatingId === booking.id;
            const isDeleting = deletingId === booking.id;

            return (
              <div
                key={booking.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${CARD_BORDER[booking.status]} p-5 flex flex-wrap gap-4 items-center group`}
              >
                {/* Thông tin chính */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-black text-indigo-600 text-sm">
                      {booking.booking_code}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${STATUS_CLS[booking.status]}`}>
                      {STATUS_LABEL[booking.status]}
                    </span>
                  </div>
                  <p className="font-bold text-slate-700">{booking.name}</p>
                  <p className="text-xs text-gray-400">{booking.phone} · {booking.email}</p>
                </div>

                {/* Ngày */}
                <div className="text-sm text-slate-600">
                  <p className="text-xs text-gray-400 font-medium">Check-in</p>
                  <p className="font-bold">{fmtDate(booking.check_in)}</p>
                </div>
                <div className="text-slate-400 text-lg">→</div>
                <div className="text-sm text-slate-600">
                  <p className="text-xs text-gray-400 font-medium">Check-out</p>
                  <p className="font-bold">{fmtDate(booking.check_out)}</p>
                </div>

                {/* Phòng */}
                {booking.booking_rooms?.length > 0 && (
                  <div className="text-sm">
                    <p className="text-xs text-gray-400 font-medium">Phòng</p>
                    <p className="font-bold text-slate-700">
                      {booking.booking_rooms.map((r) => r.room?.room_number).join(', ')}
                    </p>
                  </div>
                )}

                {/* Tổng tiền */}
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium">Tổng tiền</p>
                  <p className="font-black text-orange-500">{fmtMoney(booking.total_price)}</p>
                </div>

                {/* Hành động */}
                <div className="flex gap-2 ml-auto">
                  {/* Quick action (xác nhận / nhận phòng / trả phòng) */}
                  {quickAction && (
                    <button
                      onClick={() => handleQuickAction(booking, quickAction.next)}
                      disabled={isUpdating}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 ${quickAction.cls}`}
                    >
                      {isUpdating && (
                        <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                      )}
                      {quickAction.label}
                    </button>
                  )}
                  {/* Xem chi tiết */}
                  <button
                    onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                  >
                    👁 Xem
                  </button>
                  {/* Xóa */}
                  <button
                    onClick={() => handleDelete(booking)}
                    disabled={isDeleting}
                    className="px-3 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? '...' : '🗑'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
