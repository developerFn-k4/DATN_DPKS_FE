/**
 * RoomFormModal.tsx
 * Modal dùng chung cho thêm mới và chỉnh sửa phòng.
 * Props: isOpen, editRoom (null = thêm mới), onClose, onSuccess
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { roomApi, roomTypeApi } from '../../services/adminApi';
import type { Room, RoomStatus } from '../../services/adminApi';

// ===================== TYPES =====================

interface RoomType {
  id: number;
  name: string;
}

interface ApiError extends Error {
  validationErrors?: Record<string, string[]>;
}

interface Props {
  isOpen:   boolean;
  editRoom: Room | null;
  onClose:  () => void;
  onSuccess: () => void;
}

// ===================== CONSTANTS =====================

const STATUS_OPTIONS: { value: RoomStatus; label: string }[] = [
  { value: 'available',   label: 'Còn trống' },
  { value: 'booked',      label: 'Đã đặt' },
  { value: 'occupied',    label: 'Đang ở' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'reserved',    label: 'Đặt trước' },
  { value: 'unavailable', label: 'Không dùng' },
];

const EMPTY_FORM = {
  room_type_id: '',
  room_number:  '',
  floor:        '',
  status:       'available' as RoomStatus,
  note:         '',
};

// ===================== HELPERS =====================

/** Lấy lỗi đầu tiên của 1 field từ validationErrors */
const fieldErr = (
  errs: Record<string, string[]>,
  key: string
): string => errs[key]?.[0] ?? '';

// ===================== COMPONENT =====================

const RoomFormModal = ({ isOpen, editRoom, onClose, onSuccess }: Props) => {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting]   = useState(false);

  // Đóng khi bấm Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Reset form mỗi khi modal mở
  useEffect(() => {
    if (!isOpen) return;
    setFieldErrors({});
    setForm(
      editRoom
        ? {
            room_type_id: String(editRoom.room_type?.id ?? ''),
            room_number:  editRoom.room_number,
            floor:        String(editRoom.floor),
            status:       editRoom.status,
            note:         editRoom.note ?? '',
          }
        : EMPTY_FORM
    );
  }, [isOpen, editRoom]);

  // Tải danh sách loại phòng khi mở modal
  useEffect(() => {
    if (!isOpen) return;
    roomTypeApi.getAll()
      .then((res) => {
        const list = res.data?.data ?? [];
        setRoomTypes(list);
      })
      .catch(() => {/* không block UI */});
  }, [isOpen]);

  // Cập nhật 1 field
  const set = <K extends keyof typeof EMPTY_FORM>(key: K, val: (typeof EMPTY_FORM)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);

    const payload = {
      room_type_id: Number(form.room_type_id),
      room_number:  form.room_number.trim(),
      floor:        Number(form.floor),
      status:       form.status,
      note:         form.note.trim() || null,
    };

    try {
      if (editRoom) {
        await roomApi.update(editRoom.id, payload);
        toast.success('Cập nhật phòng thành công!');
      } else {
        await roomApi.create(payload as Parameters<typeof roomApi.create>[0]);
        toast.success('Tạo phòng thành công!');
      }
      onSuccess();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.validationErrors) {
        setFieldErrors(apiErr.validationErrors);
      } else {
        toast.error(apiErr.message || 'Đã có lỗi xảy ra');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // ===================== RENDER =====================

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-slate-800">
            {editRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* Loại phòng */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Loại phòng <span className="text-red-500">*</span>
            </label>
            <select
              value={form.room_type_id}
              onChange={(e) => set('room_type_id', e.target.value)}
              required
              className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer ${
                fieldErr(fieldErrors, 'room_type_id') ? 'border-red-400' : 'border-gray-200'
              }`}
            >
              <option value="">-- Chọn loại phòng --</option>
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>{rt.name}</option>
              ))}
            </select>
            {fieldErr(fieldErrors, 'room_type_id') && (
              <p className="text-xs text-red-500 mt-1">{fieldErr(fieldErrors, 'room_type_id')}</p>
            )}
          </div>

          {/* Số phòng */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Số phòng <span className="text-red-500">*</span>
            </label>
            <input
              value={form.room_number}
              onChange={(e) => set('room_number', e.target.value)}
              placeholder="Ví dụ: 101"
              required
              maxLength={50}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${
                fieldErr(fieldErrors, 'room_number') ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {fieldErr(fieldErrors, 'room_number') && (
              <p className="text-xs text-red-500 mt-1">{fieldErr(fieldErrors, 'room_number')}</p>
            )}
          </div>

          {/* Tầng */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Tầng <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.floor}
              onChange={(e) => set('floor', e.target.value)}
              placeholder="Ví dụ: 1"
              required
              min={1}
              max={50}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${
                fieldErr(fieldErrors, 'floor') ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {fieldErr(fieldErrors, 'floor') && (
              <p className="text-xs text-red-500 mt-1">{fieldErr(fieldErrors, 'floor')}</p>
            )}
          </div>

          {/* Trạng thái */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value as RoomStatus)}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer ${
                fieldErr(fieldErrors, 'status') ? 'border-red-400' : 'border-gray-200'
              }`}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {fieldErr(fieldErrors, 'status') && (
              <p className="text-xs text-red-500 mt-1">{fieldErr(fieldErrors, 'status')}</p>
            )}
          </div>

          {/* Ghi chú */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">Ghi chú</label>
            <textarea
              value={form.note}
              onChange={(e) => set('note', e.target.value)}
              placeholder="Ghi chú thêm (không bắt buộc)"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && (
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            )}
            {editRoom ? 'Lưu thay đổi' : 'Tạo phòng'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RoomFormModal;
