/**
 * ServiceFormModal.tsx
 * Modal dùng chung cho thêm mới và chỉnh sửa dịch vụ.
 * Props: isOpen, editService (null = thêm mới), onClose, onSuccess
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { serviceApi } from '../../services/adminApi';
import type { Service, ServiceType } from '../../services/adminApi';

// ===================== TYPES =====================

interface ApiError extends Error {
  validationErrors?: Record<string, string[]>;
}

interface Props {
  isOpen:       boolean;
  editService:  Service | null;
  onClose:      () => void;
  onSuccess:    () => void;
}

// ===================== CONSTANTS =====================

const TYPE_OPTIONS: ServiceType[] = ['Ẩm thực', 'Di chuyển', 'Tiện ích', 'Thư giãn', 'Phòng'];

const EMPTY_FORM = {
  name:  '',
  price: '',
  type:  'Tiện ích' as ServiceType,
};

// ===================== HELPERS =====================

const fieldErr = (errs: Record<string, string[]>, key: string): string =>
  errs[key]?.[0] ?? '';

// ===================== COMPONENT =====================

const ServiceFormModal = ({ isOpen, editService, onClose, onSuccess }: Props) => {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting]   = useState(false);

  // Đóng khi bấm Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Reset form khi modal mở
  useEffect(() => {
    if (!isOpen) return;
    setFieldErrors({});
    setForm(
      editService
        ? {
            name:  editService.name,
            price: String(editService.price),
            type:  editService.type,
          }
        : EMPTY_FORM
    );
  }, [isOpen, editService]);

  const set = <K extends keyof typeof EMPTY_FORM>(key: K, val: (typeof EMPTY_FORM)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);

    const payload = {
      name:  form.name.trim(),
      price: Number(form.price),
      type:  form.type,
    };

    try {
      if (editService) {
        await serviceApi.update(editService.id, payload);
        toast.success('Cập nhật dịch vụ thành công!');
      } else {
        await serviceApi.create(payload);
        toast.success('Tạo dịch vụ thành công!');
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-slate-800">
            {editService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
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

          {/* Tên dịch vụ */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Tên dịch vụ <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ví dụ: Buffet sáng, Đưa đón sân bay..."
              required
              maxLength={255}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${
                fieldErr(fieldErrors, 'name') ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {fieldErr(fieldErrors, 'name') && (
              <p className="text-xs text-red-500 mt-1">{fieldErr(fieldErrors, 'name')}</p>
            )}
          </div>

          {/* Loại dịch vụ */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Loại dịch vụ <span className="text-red-500">*</span>
            </label>
            <select
              value={form.type}
              onChange={(e) => set('type', e.target.value as ServiceType)}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer ${
                fieldErr(fieldErrors, 'type') ? 'border-red-400' : 'border-gray-200'
              }`}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {fieldErr(fieldErrors, 'type') && (
              <p className="text-xs text-red-500 mt-1">{fieldErr(fieldErrors, 'type')}</p>
            )}
          </div>

          {/* Giá */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Giá (đ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="0"
              required
              min={0}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${
                fieldErr(fieldErrors, 'price') ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {form.price && Number(form.price) >= 0 && (
              <p className="text-xs text-indigo-500 mt-1 font-medium">
                {Number(form.price).toLocaleString('vi-VN')} đ
              </p>
            )}
            {fieldErr(fieldErrors, 'price') && (
              <p className="text-xs text-red-500 mt-1">{fieldErr(fieldErrors, 'price')}</p>
            )}
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
            className="flex-1 px-4 py-2.5 !bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && (
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            )}
            {editService ? 'Lưu thay đổi' : 'Tạo dịch vụ'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ServiceFormModal;
