/**
 * OrderManagement.tsx — Quản lý Đơn đặt phòng
 * Hiển thị toàn bộ đơn đặt phòng dạng bảng, hỗ trợ phân trang phía client.
 * Hỗ trợ: tìm kiếm, lọc status & thanh toán, xem chi tiết, xóa.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookingApi, type Booking, type BookingStatus, type PaymentStatus } from '../../services/adminApi';

// ===================== CONSTANTS =====================

const STATUS_OPTIONS: { value: BookingStatus | ''; label: string }[] = [
  { value: '', label: 'Tất cả trạng thái' },
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

const PAYMENT_CLS: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  success: 'bg-green-100 text-green-700',
  failed:  'bg-red-100 text-red-700',
};

const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  pending: 'Chưa TT',
  success: 'Đã TT',
  failed:  'Thất bại',
};

const PAGE_SIZE = 10;

// ===================== HELPERS =====================

const fmtDate = (s: string) => new Date(s).toLocaleDateString('vi-VN');
const fmtMoney = (n: number) => n.toLocaleString('vi-VN') + ' đ';

const extractBookings = (data: unknown): Booking[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'data' in data) {
    const inner = (data as { data: unknown }).data;
    if (Array.isArray(inner)) return inner;
  }
  return [];
};

// ===================== MAIN COMPONENT =====================

const OrderManagement = () => {
  const navigate = useNavigate();

  const [bookings, setBookings]       = useState<Booking[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | ''>('');
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | ''>('');
  const [search, setSearch]           = useState('');
  const [deletingId, setDeletingId]   = useState<number | null>(null);
  const [page, setPage]               = useState(1);

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
      setPage(1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể tải dữ liệu đơn đặt phòng');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Lọc payment ở client side
  const filtered = useMemo(() => {
    if (!filterPayment) return bookings;
    return bookings.filter((b) => b.payment?.status === filterPayment);
  }, [bookings, filterPayment]);

  // Phân trang
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page khi filter thay đổi
  useEffect(() => { setPage(1); }, [filterPayment]);

  // Xóa đơn
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

  // ===================== RENDER =====================

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans">

      {/* ===== Header ===== */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quản Lý Đơn Đặt Phòng</h1>
        <p className="text-sm text-gray-400 mt-1">Danh sách toàn bộ đơn đặt phòng và tình trạng thanh toán</p>
      </div>

      {/* ===== Bộ lọc ===== */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Tìm mã đặt phòng, tên khách, email..."
          className="flex-1 min-w-[220px] border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
        />

        {/* Filter booking status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as BookingStatus | '')}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Filter payment status */}
        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value as PaymentStatus | '')}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
        >
          <option value="">Tất cả thanh toán</option>
          <option value="pending">Chưa thanh toán</option>
          <option value="success">Đã thanh toán</option>
          <option value="failed">Thanh toán thất bại</option>
        </select>

        {/* Reset */}
        {(filterStatus || filterPayment || search) && (
          <button
            onClick={() => { setFilterStatus(''); setFilterPayment(''); setSearch(''); }}
            className="text-sm text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl px-3 py-2 bg-white"
          >
            ✕ Xóa lọc
          </button>
        )}

        <span className="text-xs text-gray-400 ml-auto">{filtered.length} đơn</span>
      </div>

      {/* ===== Bảng dữ liệu ===== */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-400">Đang tải...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm font-medium">Không tìm thấy đơn đặt phòng nào.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">#</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Mã đơn</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Khách hàng</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Phòng</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Check-in</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Check-out</th>
                  <th className="text-right px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Tổng tiền</th>
                  <th className="text-center px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Trạng thái</th>
                  <th className="text-center px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Thanh toán</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Ngày tạo</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.map((booking, idx) => {
                  const isDeleting = deletingId === booking.id;
                  const rowNum = (page - 1) * PAGE_SIZE + idx + 1;

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      {/* STT */}
                      <td className="px-5 py-4 text-gray-400 font-medium">{rowNum}</td>

                      {/* Mã đơn */}
                      <td className="px-5 py-4">
                        <span className="font-mono font-black text-indigo-600 text-xs">
                          {booking.booking_code}
                        </span>
                      </td>

                      {/* Khách hàng */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-700 whitespace-nowrap">{booking.name}</p>
                        <p className="text-xs text-gray-400">{booking.phone}</p>
                      </td>

                      {/* Phòng */}
                      <td className="px-5 py-4 text-slate-600 font-medium">
                        {booking.booking_rooms?.length > 0
                          ? booking.booking_rooms.map((r) => r.room?.room_number).join(', ')
                          : <span className="text-gray-300">—</span>
                        }
                      </td>

                      {/* Check-in */}
                      <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{fmtDate(booking.check_in)}</td>

                      {/* Check-out */}
                      <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{fmtDate(booking.check_out)}</td>

                      {/* Tổng tiền */}
                      <td className="px-5 py-4 text-right font-black text-orange-500 whitespace-nowrap">
                        {fmtMoney(booking.total_price)}
                      </td>

                      {/* Booking status */}
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${STATUS_CLS[booking.status]}`}>
                          {STATUS_LABEL[booking.status]}
                        </span>
                      </td>

                      {/* Payment status */}
                      <td className="px-5 py-4 text-center">
                        {booking.payment ? (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${PAYMENT_CLS[booking.payment.status]}`}>
                            {PAYMENT_LABEL[booking.payment.status]}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Ngày tạo */}
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap text-xs">
                        {fmtDate(booking.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Xem chi tiết */}
                          <button
                            onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors whitespace-nowrap"
                          >
                            👁 Xem
                          </button>
                          {/* Xem thanh toán */}
                          {booking.payment && (
                            <button
                              onClick={() => navigate(`/admin/payments/${booking.id}`)}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors whitespace-nowrap"
                            >
                              💳 TT
                            </button>
                          )}
                          {/* Xóa */}
                          <button
                            onClick={() => handleDelete(booking)}
                            disabled={isDeleting}
                            className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                          >
                            {isDeleting ? '...' : '🗑'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ===== Phân trang ===== */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Trang {page} / {totalPages} · {filtered.length} đơn
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ‹ Trước
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Hiển thị tối đa 5 trang xung quanh trang hiện tại
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const p = start + i;
                  return p <= totalPages ? (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                        p === page
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ) : null;
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Sau ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
