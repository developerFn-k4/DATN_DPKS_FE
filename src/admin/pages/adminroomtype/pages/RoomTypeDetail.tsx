import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';
import { roomTypeService, getStorageUrl, type RoomType } from '../../../services/adminRoomTypeService';

// ===================== SUB-COMPONENT =====================

// Hiển thị 1 ô thông tin (nhãn + giá trị)
const InfoCard = ({ label, value }: { label: string; value: string | number }) => (
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
  // Index ảnh đang được hiển thị trong gallery
  const [activeIdx, setActiveIdx] = useState(0);

  // Tải chi tiết loại phòng theo id từ URL
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    roomTypeService
      .getById(id)
      .then((data) => {
        setRoomType(data);
        setActiveIdx(0);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Không thể tải thông tin loại phòng';
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ---- Render: Loading ----
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-gray-400 font-medium">Đang tải...</p>
      </div>
    );
  }

  // ---- Render: Not found ----
  if (!roomType) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400 text-sm mb-4">Không tìm thấy loại phòng.</p>
        <button
          onClick={() => navigate('/admin/roomtype')}
          className="text-indigo-600 font-bold hover:underline !bg-transparent"
        >
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  const images = roomType.images ?? [];
  const activeImage = images[activeIdx];

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      <Toaster position="top-right" />

      {/* Header điều hướng */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/admin/roomtype')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors !bg-transparent"
        >
          <ArrowLeftOutlined /> Danh sách loại phòng
        </button>
        <button
          onClick={() => navigate(`/admin/roomtype/${id}/edit`)}
          className="!bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all font-bold flex items-center gap-2"
        >
          <EditOutlined /> Chỉnh sửa
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ===== Cột trái: Gallery ảnh ===== */}
        <div>
          {/* Ảnh lớn */}
          <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-100 h-80">
            {activeImage ? (
              <img
                src={getStorageUrl(activeImage.image_url)}
                alt={roomType.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/800x400?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                <PictureOutlined style={{ fontSize: 40 }} />
                <p className="text-sm text-gray-400">Chưa có ảnh</p>
              </div>
            )}
          </div>

          {/* Thumbnails - hiển thị khi có nhiều hơn 1 ảnh */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`h-16 w-20 rounded-xl overflow-hidden border-4 transition-all !bg-transparent ${
                    activeIdx === idx
                      ? 'border-indigo-500 shadow-lg scale-105'
                      : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <img
                    src={getStorageUrl(img.image_url)}
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

          {/* Số lượng ảnh */}
          {images.length > 0 && (
            <p className="text-xs text-gray-400 mt-2 font-medium">
              {activeIdx + 1} / {images.length} ảnh
            </p>
          )}
        </div>

        {/* ===== Cột phải: Thông tin chi tiết ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          {/* Tên + trạng thái */}
          <div>
            <h1 className="text-2xl font-black text-slate-800">{roomType.name}</h1>
            <span
              className={`mt-2 inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase ${
                roomType.status === 'active'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              {roomType.status === 'active' ? '● Đang hoạt động' : '○ Tạm ngưng'}
            </span>
          </div>

          {/* Giá */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">
              Giá cơ bản / đêm
            </p>
            <p className="text-3xl font-black text-orange-500">
              {Number(roomType.base_price).toLocaleString('vi-VN')}
              <span className="text-base font-normal text-orange-300 ml-2">
                {roomType.currency}
              </span>
            </p>
          </div>

          {/* Thông số kỹ thuật */}
          <div className="grid grid-cols-2 gap-3">
            <InfoCard label="Sức chứa" value={`${roomType.capacity} người`} />
            <InfoCard label="Loại giường" value={roomType.bed_type} />
            <InfoCard label="Diện tích" value={`${roomType.area} m²`} />
            <InfoCard label="Tiền tệ" value={roomType.currency} />
          </div>

          {/* Tiện nghi - hiển thị dạng badge */}
          {roomType.amenities && roomType.amenities.length > 0 && (
            <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
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

          {/* Thời gian tạo/cập nhật */}
          {(roomType.created_at || roomType.updated_at) && (
            <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-3 text-xs text-gray-400">
              {roomType.created_at && (
                <div>
                  <span className="font-bold block">Ngày tạo</span>
                  {new Date(roomType.created_at).toLocaleDateString('vi-VN')}
                </div>
              )}
              {roomType.updated_at && (
                <div>
                  <span className="font-bold block">Cập nhật lần cuối</span>
                  {new Date(roomType.updated_at).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomTypeDetail;
