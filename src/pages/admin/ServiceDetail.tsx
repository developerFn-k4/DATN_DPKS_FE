/**
 * ServiceDetail.tsx
 * Trang chi tiết dịch vụ cho admin.
 * Hiển thị: tên, giá, loại dịch vụ.
 * Hỗ trợ: inline edit (click Sửa → form → lưu), xóa có confirm.
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serviceApi, type Service, type ServiceType } from '../../services/adminApi';

// ===================== HELPERS =====================

const SERVICE_TYPES: ServiceType[] = ['Ẩm thực', 'Di chuyển', 'Tiện ích', 'Thư giãn', 'Phòng'];

// Màu badge cho từng loại dịch vụ
const TYPE_CLS: Record<ServiceType, string> = {
  'Ẩm thực': 'bg-orange-100 text-orange-700',
  'Di chuyển': 'bg-blue-100 text-blue-700',
  'Tiện ích': 'bg-indigo-100 text-indigo-700',
  'Thư giãn': 'bg-pink-100 text-pink-700',
  'Phòng': 'bg-slate-100 text-slate-700',
};

// Icon cho từng loại
const TYPE_ICON: Record<ServiceType, string> = {
  'Ẩm thực': '🍽',
  'Di chuyển': '🚗',
  'Tiện ích': '🔧',
  'Thư giãn': '🛁',
  'Phòng': '🏨',
};

const fmtMoney = (n: number) =>
  n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const fmtDate = (s: string) => new Date(s).toLocaleDateString('vi-VN');

// ===================== MAIN COMPONENT =====================

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  // Trạng thái edit inline
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    name: string;
    price: string;
    type: ServiceType;
  }>({ name: '', price: '', type: 'Tiện ích' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Tải chi tiết dịch vụ
  const fetchService = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await serviceApi.getById(id);
      const data = res.data?.data;
      setService(data);
      // Khởi tạo form edit với dữ liệu hiện tại
      setEditForm({
        name: data.name,
        price: String(data.price),
        type: data.type,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải thông tin dịch vụ';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  // ---- Lưu chỉnh sửa ----
  const handleSave = async () => {
    if (!id) return;
    // Validate nhanh
    if (!editForm.name.trim()) return toast.error('Tên dịch vụ không được để trống');
    if (!editForm.price || Number(editForm.price) < 0) return toast.error('Giá không hợp lệ');

    setSaving(true);
    try {
      await serviceApi.update(id, {
        name: editForm.name.trim(),
        price: Number(editForm.price),
        type: editForm.type,
      });
      toast.success('Cập nhật dịch vụ thành công!');
      setIsEditing(false);
      await fetchService();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cập nhật thất bại';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ---- Xóa dịch vụ ----
  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm(`Xóa dịch vụ "${service?.name}"?`)) return;
    setDeleting(true);
    try {
      await serviceApi.delete(id);
      toast.success('Đã xóa dịch vụ!');
      navigate(-1);
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
        <p className="text-sm text-gray-400">Đang tải thông tin dịch vụ...</p>
      </div>
    );
  }

  // ---- Not found ----
  if (!service) {
    return (
      <div className="p-8 text-center">
        <p className="text-5xl mb-3">🔧</p>
        <p className="text-gray-400 text-sm mb-4">Không tìm thấy dịch vụ.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-bold hover:underline bg-transparent border-none cursor-pointer"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  const typeCls = TYPE_CLS[service.type] ?? 'bg-gray-100 text-gray-600';

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
            <h1 className="text-xl font-black text-slate-800">{service.name}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold mt-1 inline-block ${typeCls}`}>
              {TYPE_ICON[service.type]} {service.type}
            </span>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  // Reset về giá trị gốc
                  setEditForm({
                    name: service.name,
                    price: String(service.price),
                    type: service.type,
                  });
                }}
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
                Lưu
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
              >
                ✏️ Sửa
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
            </>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-5 pb-3 border-b border-gray-50">
            {isEditing ? 'Chỉnh sửa dịch vụ' : 'Thông tin dịch vụ'}
          </h3>

          {isEditing ? (
            /* ---- Form inline edit ---- */
            <div className="space-y-4">
              {/* Tên */}
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider block mb-1">
                  Tên dịch vụ <span className="text-red-400">*</span>
                </label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                />
              </div>

              {/* Giá */}
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider block mb-1">
                  Giá (VND) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={editForm.price}
                  onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                />
                {editForm.price && (
                  <p className="text-xs text-orange-500 font-bold mt-1">
                    = {fmtMoney(Number(editForm.price))}
                  </p>
                )}
              </div>

              {/* Loại */}
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider block mb-2">
                  Loại dịch vụ
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICE_TYPES.map((t) => (
                    <label
                      key={t}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                        editForm.type === t
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="service-type"
                        value={t}
                        checked={editForm.type === t}
                        onChange={() => setEditForm((p) => ({ ...p, type: t }))}
                        className="accent-indigo-600"
                      />
                      <span className={`text-sm ${editForm.type === t ? 'font-black text-indigo-700' : 'text-gray-600'}`}>
                        {TYPE_ICON[t]} {t}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ---- Chế độ xem ---- */
            <div className="space-y-4">
              {/* Tên */}
              <div className="text-center py-4">
                <p className="text-3xl font-black text-slate-800">{service.name}</p>
                <span className={`mt-2 inline-block px-3 py-1.5 rounded-full text-sm font-black ${typeCls}`}>
                  {TYPE_ICON[service.type]} {service.type}
                </span>
              </div>

              {/* Giá */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                <p className="text-[11px] font-black text-orange-400 uppercase tracking-widest mb-1">Giá dịch vụ</p>
                <p className="text-3xl font-black text-orange-500">{fmtMoney(service.price)}</p>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Ngày tạo</p>
                  <p className="text-sm font-bold text-slate-600 mt-0.5">{fmtDate(service.created_at)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Cập nhật</p>
                  <p className="text-sm font-bold text-slate-600 mt-0.5">{fmtDate(service.updated_at)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
