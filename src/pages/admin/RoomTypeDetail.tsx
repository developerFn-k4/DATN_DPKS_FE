/**
 * RoomTypeDetail.tsx
 * Trang chi tiết loại phòng cho admin (view only).
 * Hiển thị: gallery ảnh, thông tin, tiện nghi dạng badge.
 * image_url trong response đã là full URL có domain.
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { roomTypeApi, type RoomType } from '../../services/adminApi';

// ===================== HELPERS =====================

const fmtMoney = (n: number, currency = 'VND') =>
  currency === 'VND'
    ? `${n.toLocaleString('vi-VN')} ₫`
    : n.toLocaleString('en-US', { style: 'currency', currency });

const fmtDate = (s: string) => new Date(s).toLocaleDateString('vi-VN');

// ===================== SUB-COMPONENTS =====================

const InfoCard = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-700">{value}</p>
  </div>
);

// ===================== MAIN COMPONENT =====================

const RoomTypeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  // Index ảnh đang active trong gallery
  const [activeIdx, setActiveIdx] = useState(0);
  // Lightbox: index ảnh đang xem to (-1 = đóng)
  const [lightboxIdx, setLightboxIdx] = useState(-1);

  // Tải chi tiết loại phòng
  const fetchRoomType = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await roomTypeApi.getById(id);
      const data = res.data?.data;
      setRoomType(data);
      setActiveIdx(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải thông tin loại phòng';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoomType();
  }, [fetchRoomType]);

  // Đóng lightbox khi nhấn Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(-1);
      if (e.key === 'ArrowRight' && lightboxIdx >= 0 && roomType)
        setLightboxIdx((i) => (i + 1) % roomType.images.length);
      if (e.key === 'ArrowLeft' && lightboxIdx >= 0 && roomType)
        setLightboxIdx((i) => (i - 1 + roomType.images.length) % roomType.images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, roomType]);

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-gray-400">Đang tải thông tin loại phòng...</p>
      </div>
    );
  }

  // ---- Not found ----
  if (!roomType) {
    return (
      <div className="p-8 text-center">
        <p className="text-5xl mb-3">🏨</p>
        <p className="text-gray-400 text-sm mb-4">Không tìm thấy loại phòng.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-bold hover:underline bg-transparent border-none cursor-pointer"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  const images = roomType.images ?? [];
  const activeImage = images[activeIdx];

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* ===== Lightbox ===== */}
      {lightboxIdx >= 0 && images[lightboxIdx] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxIdx(-1)}
        >
          {/* Ảnh lớn */}
          <img
            src={images[lightboxIdx].image_url}
            alt={`lightbox-${lightboxIdx}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {/* Nút đóng */}
          <button
            onClick={() => setLightboxIdx(-1)}
            className="absolute top-4 right-4 text-white text-2xl font-black bg-black/40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            ✕
          </button>
          {/* Điều hướng */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i - 1 + images.length) % images.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-xl bg-black/40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i + 1) % images.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-xl bg-black/40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                ›
              </button>
            </>
          )}
          <p className="absolute bottom-4 text-white/70 text-sm">
            {lightboxIdx + 1} / {images.length}
          </p>
        </div>
      )}

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
            <h1 className="text-xl font-black text-slate-800">{roomType.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">ID #{roomType.id} · Hotel #{roomType.hotel_id}</p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase ${
              roomType.status === 'active'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {roomType.status === 'active' ? '● Hoạt động' : '○ Ngưng'}
          </span>
        </div>
        <button
          onClick={() => navigate(`/admin/roomtype/${id}/edit`)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          ✏️ Chỉnh sửa
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ===== Cột trái: Gallery ảnh ===== */}
        <div>
          {/* Ảnh lớn - click để mở lightbox */}
          <div
            className="rounded-2xl overflow-hidden shadow-lg bg-gray-100 h-72 cursor-pointer group"
            onClick={() => activeImage && setLightboxIdx(activeIdx)}
          >
            {activeImage ? (
              <div className="relative h-full">
                <img
                  src={activeImage.image_url}
                  alt={roomType.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/800x400?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-bold bg-black/40 px-3 py-1.5 rounded-full transition-opacity">
                    🔍 Xem to
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                <span className="text-4xl">🖼</span>
                <p className="text-sm text-gray-400">Chưa có ảnh</p>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`h-16 w-20 rounded-xl overflow-hidden border-4 transition-all bg-gray-100 ${
                    activeIdx === idx
                      ? 'border-indigo-500 shadow-lg scale-105'
                      : 'border-transparent opacity-60 hover:opacity-90 hover:scale-102'
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/80x64?text=X';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
          {images.length > 0 && (
            <p className="text-xs text-gray-400 mt-2 font-medium">
              {activeIdx + 1} / {images.length} ảnh · Click để xem to
            </p>
          )}
        </div>

        {/* ===== Cột phải: Thông tin chi tiết ===== */}
        <div className="space-y-5">
          {/* Giá */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <p className="text-[11px] font-black text-orange-400 uppercase tracking-widest mb-1">Giá cơ bản / đêm</p>
            <p className="text-3xl font-black text-orange-500">
              {fmtMoney(Number(roomType.base_price), roomType.currency)}
            </p>
          </div>

          {/* Thông số */}
          <div className="grid grid-cols-2 gap-3">
            <InfoCard label="Sức chứa" value={`${roomType.capacity} người`} />
            <InfoCard label="Loại giường" value={`🛏 ${roomType.bed_type}`} />
            <InfoCard label="Diện tích" value={`${roomType.area} m²`} />
            <InfoCard label="Tiền tệ" value={roomType.currency} />
          </div>

          {/* Amenities - dạng badge */}
          {roomType.amenities?.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                Tiện nghi ({roomType.amenities.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {roomType.amenities.map((a, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Ngày tạo</p>
              <p className="text-sm font-bold text-slate-600 mt-0.5">{fmtDate(roomType.created_at)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Cập nhật</p>
              <p className="text-sm font-bold text-slate-600 mt-0.5">{fmtDate(roomType.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomTypeDetail;
