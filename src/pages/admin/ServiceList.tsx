/**
 * ServiceList.tsx — Quản lý dịch vụ
 * Tìm kiếm & lọc gọi API server-side. CRUD: thêm, sửa (modal), xóa.
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { serviceApi } from '../../services/adminApi';
import type { Service, ServiceType } from '../../services/adminApi';
import ServiceFormModal from '../../components/admin/ServiceFormModal';

// ===================== CONSTANTS =====================

const TYPE_OPTIONS: { value: ServiceType | ''; label: string }[] = [
  { value: '',           label: 'Tất cả loại' },
  { value: 'Ẩm thực',   label: '🍽 Ẩm thực' },
  { value: 'Di chuyển', label: '🚌 Di chuyển' },
  { value: 'Tiện ích',  label: '🔧 Tiện ích' },
  { value: 'Thư giãn',  label: '🛁 Thư giãn' },
  { value: 'Phòng',     label: '🛏 Phòng' },
];

const TYPE_CLS: Record<ServiceType, string> = {
  'Ẩm thực':   'bg-orange-100 text-orange-700',
  'Di chuyển': 'bg-blue-100 text-blue-700',
  'Tiện ích':  'bg-purple-100 text-purple-700',
  'Thư giãn':  'bg-green-100 text-green-700',
  'Phòng':     'bg-yellow-100 text-yellow-700',
};

const TYPE_ICON: Record<ServiceType, string> = {
  'Ẩm thực':   '🍽',
  'Di chuyển': '🚌',
  'Tiện ích':  '🔧',
  'Thư giãn':  '🛁',
  'Phòng':     '🛏',
};

const fmtMoney = (n: number) => n.toLocaleString('vi-VN') + ' đ';
const fmtDate  = (s: string) => new Date(s).toLocaleDateString('vi-VN');

// ===================== MAIN COMPONENT =====================

const ServiceList = () => {
  const [services, setServices]         = useState<Service[]>([]);
  const [loading, setLoading]           = useState(true);
  const [searchInput, setSearchInput]   = useState('');
  const [search, setSearch]             = useState('');         // debounced
  const [filterType, setFilterType]     = useState<ServiceType | ''>('');
  const [deletingId, setDeletingId]     = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editService, setEditService]   = useState<Service | null>(null);

  // Debounce search input 450ms
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 450);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Tải dịch vụ từ server (server-side filter)
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...(search     ? { search }     : {}),
        ...(filterType ? { type: filterType } : {}),
      };
      const res = await serviceApi.getAll(params);
      setServices(res.data?.data ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể tải danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  }, [search, filterType]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // Xóa dịch vụ
  const handleDelete = async (service: Service) => {
    if (!window.confirm(`Xóa dịch vụ "${service.name}"?`)) return;
    setDeletingId(service.id);
    try {
      await serviceApi.delete(service.id);
      toast.success('Xóa dịch vụ thành công!');
      setServices((prev) => prev.filter((s) => s.id !== service.id));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Xóa thất bại');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenAdd    = () => { setEditService(null); setIsModalOpen(true); };
  const handleOpenEdit   = (s: Service) => { setEditService(s); setIsModalOpen(true); };
  const handleClose      = () => { setIsModalOpen(false); setEditService(null); };
  const handleSuccess    = () => { handleClose(); fetchServices(); };

  // ===================== RENDER =====================

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans">

      {/* ===== Header ===== */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản Lý Dịch Vụ</h1>
          <p className="text-sm text-gray-400 mt-1">Danh sách toàn bộ dịch vụ khách sạn</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
        >
          + Thêm dịch vụ
        </button>
      </div>

      {/* ===== Thống kê theo loại ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {(['Ẩm thực', 'Di chuyển', 'Tiện ích', 'Thư giãn', 'Phòng'] as ServiceType[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(filterType === t ? '' : t)}
            className={`rounded-xl p-3 text-left border-2 transition-all ${
              filterType === t
                ? 'border-indigo-400 shadow-sm scale-[1.02]'
                : 'border-transparent bg-white shadow-sm'
            }`}
          >
            <p className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full w-fit mb-2 ${TYPE_CLS[t]}`}>
              {TYPE_ICON[t]} {t}
            </p>
            <p className="text-2xl font-black text-slate-800">
              {services.filter((s) => s.type === t).length}
            </p>
          </button>
        ))}
      </div>

      {/* ===== Bộ lọc ===== */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3 items-center">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="🔍  Tìm tên dịch vụ..."
          className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as ServiceType | '')}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {(searchInput || filterType) && (
          <button
            onClick={() => { setSearchInput(''); setSearch(''); setFilterType(''); }}
            className="text-sm text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl px-3 py-2 bg-white"
          >
            ✕ Xóa lọc
          </button>
        )}
        <span className="text-xs text-gray-400 ml-auto">{services.length} dịch vụ</span>
      </div>

      {/* ===== Bảng ===== */}
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
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Tên dịch vụ</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Loại</th>
                  <th className="text-right px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Giá</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wide">Ngày tạo</th>
                  <th className="px-5 py-3.5 w-32" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                      <p className="text-3xl mb-2">🛎</p>
                      Không tìm thấy dịch vụ nào.
                    </td>
                  </tr>
                ) : (
                  services.map((service, idx) => {
                    const isDeleting = deletingId === service.id;
                    return (
                      <tr key={service.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-5 py-4 text-gray-400 font-medium">{idx + 1}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">{service.name}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${TYPE_CLS[service.type]}`}>
                            {TYPE_ICON[service.type]} {service.type}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-black text-orange-500 whitespace-nowrap">
                          {fmtMoney(service.price)}
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                          {fmtDate(service.created_at)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(service)}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                            >
                              ✏️ Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(service)}
                              disabled={isDeleting}
                              className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                            >
                              {isDeleting ? '...' : '🗑 Xóa'}
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
      <ServiceFormModal
        isOpen={isModalOpen}
        editService={editService}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ServiceList;
