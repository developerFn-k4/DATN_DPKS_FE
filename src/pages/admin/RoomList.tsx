/**
 * RoomList.tsx — Quản lý tài sản (Phòng)
 * Danh sách toàn bộ phòng, lọc client-side theo số phòng & trạng thái.
 * CRUD: thêm, sửa (modal), xóa, khôi phục.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { roomApi } from '../../services/adminApi';
import type { Room, RoomStatus } from '../../services/adminApi';
import RoomFormModal from '../../components/admin/RoomFormModal';

// ===================== CONSTANTS =====================

const STATUS_CONFIG: Record<RoomStatus, { label: string; cls: string }> = {
  available:   { label: 'Còn trống',    cls: 'bg-green-100 text-green-700' },
  booked:      { label: 'Đã đặt',       cls: 'bg-orange-100 text-orange-700' },
  occupied:    { label: 'Đang ở',       cls: 'bg-red-100 text-red-700' },
  maintenance: { label: 'Bảo trì',      cls: 'bg-yellow-100 text-yellow-700' },
  reserved:    { label: 'Đặt trước',    cls: 'bg-purple-100 text-purple-700' },
  unavailable: { label: 'Không dùng',   cls: 'bg-gray-100 text-gray-500' },
};

const STATUS_OPTIONS: { value: RoomStatus | ''; label: string }[] = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'available',   label: 'Còn trống' },
  { value: 'booked',      label: 'Đã đặt' },
  { value: 'occupied',    label: 'Đang ở' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'reserved',    label: 'Đặt trước' },
  { value: 'unavailable', label: 'Không dùng' },
];

// ===================== MAIN COMPONENT =====================

const RoomList = () => {
  const [rooms, setRooms]               = useState<Room[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState<RoomStatus | ''>('');
  const [deletingId, setDeletingId]     = useState<number | null>(null);
  const [restoringId, setRestoringId]   = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editRoom, setEditRoom]         = useState<Room | null>(null);

  // Tải danh sách phòng
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roomApi.getAll();
      setRooms(res.data?.data ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể tải danh sách phòng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  // Lọc phía client
  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      const matchSearch = !search ||
        r.room_number.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || r.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [rooms, search, filterStatus]);

  // Xóa phòng
  const handleDelete = async (room: Room) => {
    if (!window.confirm(`Xóa phòng "${room.room_number}"? Thao tác này không thể hoàn tác.`)) return;
    setDeletingId(room.id);
    try {
      await roomApi.delete(room.id);
      toast.success('Xóa phòng thành công!');
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Xóa thất bại');
    } finally {
      setDeletingId(null);
    }
  };

  // Khôi phục phòng
  const handleRestore = async (room: Room) => {
    setRestoringId(room.id);
    try {
      await roomApi.restore(room.id);
      toast.success('Khôi phục phòng thành công!');
      await fetchRooms();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Khôi phục thất bại');
    } finally {
      setRestoringId(null);
    }
  };

  const handleOpenAdd  = () => { setEditRoom(null); setIsModalOpen(true); };
  const handleOpenEdit = (room: Room) => { setEditRoom(room); setIsModalOpen(true); };
  const handleClose    = () => { setIsModalOpen(false); setEditRoom(null); };
  const handleSuccess  = () => { handleClose(); fetchRooms(); };

  // ===================== RENDER =====================

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans">

      {/* ===== Header ===== */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản Lý Trạng Thái (Phòng)</h1>
          <p className="text-sm text-gray-400 mt-1">Danh sách toàn bộ phòng trong hệ thống</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
        >
          + Thêm phòng
        </button>
      </div>

      {/* ===== Thống kê nhanh ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {(Object.entries(STATUS_CONFIG) as [RoomStatus, { label: string; cls: string }][]).map(
          ([status, cfg]) => (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? '' : status)}
              className={`rounded-xl p-3 text-left border-2 transition-all ${
                filterStatus === status
                  ? 'border-indigo-400 shadow-sm scale-[1.02]'
                  : 'border-transparent bg-white shadow-sm'
              }`}
            >
              <p className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full w-fit mb-2 ${cfg.cls}`}>
                {cfg.label}
              </p>
              <p className="text-2xl font-black text-slate-800">
                {rooms.filter((r) => r.status === status).length}
              </p>
            </button>
          )
        )}
      </div>

      {/* ===== Bộ lọc ===== */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Tìm số phòng..."
          className="flex-1 min-w-[180px] border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as RoomStatus | '')}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {(search || filterStatus) && (
          <button
            onClick={() => { setSearch(''); setFilterStatus(''); }}
            className="text-sm text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl px-3 py-2 bg-white"
          >
            ✕ Xóa lọc
          </button>
        )}
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} phòng</span>
      </div>

      {/* ===== Bảng / Trạng thái ===== */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-400">Đang tải...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide w-12">STT</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Số phòng</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Loại phòng</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Tầng</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Trạng thái</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Ghi chú</th>
                  <th className="px-5 py-3.5 w-36" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                      <p className="text-3xl mb-2">🏨</p>
                      Không tìm thấy phòng nào.
                    </td>
                  </tr>
                ) : (
                  filtered.map((room, idx) => {
                    const cfg = STATUS_CONFIG[room.status];
                    const isDeleting  = deletingId  === room.id;
                    const isRestoring = restoringId === room.id;

                    return (
                      <tr key={room.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-5 py-4 text-gray-400 font-medium">{idx + 1}</td>
                        <td className="px-5 py-4">
                          <span className="font-black text-slate-700">{room.room_number}</span>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{room.room_type?.name ?? '—'}</td>
                        <td className="px-5 py-4 text-slate-600">{room.floor}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${cfg.cls}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 max-w-[180px] truncate">
                          {room.note || <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(room)}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                            >
                              ✏️ Sửa
                            </button>
                            <button
                              onClick={() => handleRestore(room)}
                              disabled={isRestoring}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                            >
                              {isRestoring ? '...' : '♻️'}
                            </button>
                            <button
                              onClick={() => handleDelete(room)}
                              disabled={isDeleting}
                              className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                            >
                              {isDeleting ? '...' : '🗑'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal thêm / sửa */}
      <RoomFormModal
        isOpen={isModalOpen}
        editRoom={editRoom}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default RoomList;
