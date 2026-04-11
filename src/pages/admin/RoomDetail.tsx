/**
 * RoomDetail.tsx
 * Trang chi tiết tài sản phòng cho admin.
 * Hiển thị: số phòng, tầng, loại phòng, trạng thái, ghi chú.
 * Hỗ trợ: đổi status, xóa, khôi phục.
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { roomApi, type Room, type RoomStatus } from '../../services/adminApi';

// ===================== HELPERS =====================

const ROOM_STATUS_OPTIONS: { value: RoomStatus; label: string }[] = [
  { value: 'available', label: 'Trống (Có thể đặt)' },
  { value: 'booked', label: 'Đã đặt trước' },
  { value: 'occupied', label: 'Đang sử dụng' },
  { value: 'maintenance', label: 'Đang bảo trì' },
  { value: 'reserved', label: 'Đang giữ chỗ' },
  { value: 'unavailable', label: 'Không khả dụng' },
];

const STATUS_CLS: Record<RoomStatus, string> = {
  available: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  booked: 'bg-orange-100 text-orange-700 border-orange-200',
  occupied: 'bg-red-100 text-red-700 border-red-200',
  maintenance: 'bg-amber-100 text-amber-700 border-amber-200',
  reserved: 'bg-blue-100 text-blue-700 border-blue-200',
  unavailable: 'bg-slate-100 text-slate-600 border-slate-200',
};

const STATUS_ICON: Record<RoomStatus, string> = {
  available: '🟢',
  booked: '🟠',
  occupied: '🔴',
  maintenance: '🟡',
  reserved: '🔵',
  unavailable: '⚫',
};

const fmtDate = (s: string) => new Date(s).toLocaleDateString('vi-VN');

// ===================== SUB-COMPONENTS =====================

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-400 font-medium">{label}</span>
    <span className="text-sm font-bold text-slate-700 text-right">{value}</span>
  </div>
);

// ===================== MAIN COMPONENT =====================

const RoomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus>('available');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // Tải chi tiết phòng
  const fetchRoom = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await roomApi.getById(id);
      const data = res.data?.data;
      setRoom(data);
      setSelectedStatus(data.status);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải thông tin phòng';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  // ---- Cập nhật trạng thái ----
  const handleUpdateStatus = async () => {
    if (!id || selectedStatus === room?.status) return;
    setUpdating(true);
    try {
      await roomApi.update(id, { status: selectedStatus });
      toast.success(`Cập nhật trạng thái thành công!`);
      await fetchRoom();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cập nhật thất bại';
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  // ---- Xóa phòng ----
  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm(`Xóa phòng ${room?.room_number}? Hành động này có thể hoàn tác.`)) return;
    setDeleting(true);
    try {
      await roomApi.delete(id);
      toast.success('Đã xóa phòng!');
      navigate(-1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Xóa thất bại';
      toast.error(msg);
      setDeleting(false);
    }
  };

  // ---- Khôi phục phòng ----
  const handleRestore = async () => {
    if (!id) return;
    setRestoring(true);
    try {
      await roomApi.restore(id);
      toast.success('Khôi phục phòng thành công!');
      await fetchRoom();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Khôi phục thất bại';
      toast.error(msg);
    } finally {
      setRestoring(false);
    }
  };

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-gray-400">Đang tải thông tin phòng...</p>
      </div>
    );
  }

  // ---- Not found ----
  if (!room) {
    return (
      <div className="p-8 text-center">
        <p className="text-5xl mb-3">🏠</p>
        <p className="text-gray-400 text-sm mb-4">Không tìm thấy phòng.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-bold hover:underline bg-transparent border-none cursor-pointer"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  const statusCls = STATUS_CLS[room.status];
  const statusChanged = selectedStatus !== room.status;

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* ===== Header ===== */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800">
              Phòng {room.room_number}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {room.room_type?.name} · Tầng {room.floor}
            </p>
          </div>
          {/* Badge trạng thái */}
          <span className={`px-3 py-1.5 rounded-full text-[11px] font-black border ${statusCls}`}>
            {STATUS_ICON[room.status]}{' '}
            {ROOM_STATUS_OPTIONS.find((o) => o.value === room.status)?.label}
          </span>
        </div>

        {/* Nút xóa / khôi phục */}
        <div className="flex gap-2">
          <button
            onClick={handleRestore}
            disabled={restoring}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-sm hover:bg-emerald-500 hover:text-white transition-colors disabled:opacity-60 flex items-center gap-1.5"
          >
            {restoring && (
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-current border-t-transparent" />
            )}
            ♻ Khôi phục
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-colors disabled:opacity-60 flex items-center gap-1.5"
          >
            {deleting && (
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-current border-t-transparent" />
            )}
            🗑 Xóa
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* ===== Thông tin phòng ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">
            Thông tin phòng
          </h3>
          <Row label="Số phòng" value={<span className="font-mono text-indigo-600 font-black text-base">{room.room_number}</span>} />
          <Row label="Loại phòng" value={
            <span className="text-indigo-600 hover:underline cursor-pointer">
              {room.room_type?.name}
            </span>
          } />
          <Row label="Tầng" value={`Tầng ${room.floor}`} />
          <Row label="Ghi chú" value={room.note || <span className="text-gray-300 italic">Không có ghi chú</span>} />
          <Row label="Ngày tạo" value={fmtDate(room.created_at)} />
          <Row label="Cập nhật lần cuối" value={fmtDate(room.updated_at)} />
        </div>

        {/* ===== Đổi trạng thái ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">
            Cập nhật trạng thái
          </h3>

          <div className="space-y-2 mb-4">
            {ROOM_STATUS_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedStatus === opt.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="room-status"
                  value={opt.value}
                  checked={selectedStatus === opt.value}
                  onChange={() => setSelectedStatus(opt.value)}
                  className="accent-indigo-600"
                />
                <span className="text-sm">
                  {STATUS_ICON[opt.value]}{' '}
                  <span className={selectedStatus === opt.value ? 'font-black text-indigo-700' : 'font-medium text-gray-600'}>
                    {opt.label}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={handleUpdateStatus}
            disabled={!statusChanged || updating}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {updating && (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            )}
            {statusChanged ? 'Lưu trạng thái mới' : 'Chưa có thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
