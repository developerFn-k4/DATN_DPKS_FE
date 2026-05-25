import React, { useState, useMemo } from 'react';
import type { RoomTypeL } from '../../../services/roomTypeService';
import { RoomDetailComponent } from '../../roomdetail/components/RoomDetailComponent';

export const RoomCard: React.FC<{ room: RoomTypeL }> = ({ room }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null); // State để xem slide ảnh

  // CẬP NHẬT: Placeholder vuông 16:9 để phù hợp tỉ lệ mới
  const PLACEHOLDER_IMG = "https://placehold.co/1280x720?text=No+Image";

  // Logic xoay ảnh của bạn giữ nguyên
  const displayImages = useMemo(() => {
    if (!room.images || room.images.length === 0) return [];
    let imgs = [...room.images];
    const shift = (room.room_type_id || 0) % imgs.length;
    return [...imgs.slice(shift), ...imgs.slice(0, shift)];
  }, [room.images, room.room_type_id]);

  const formatPrice = (p: string) => {
    const value = parseFloat(p);
    return isNaN(value) ? "Liên hệ" : new Intl.NumberFormat('vi-VN').format(value);
  };

  // Hàm điều hướng slide tay
  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex !== null) {
      setPhotoIndex((photoIndex + 1) % displayImages.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex !== null) {
      setPhotoIndex((photoIndex - 1 + displayImages.length) % displayImages.length);
    }
  };

  return (
    <>
      {/* CẬP NHẬT: Đảm bảo bố cục cha luôn căn giữa theo chiều dọc md:items-center */}
      <div className="group flex flex-col md:flex-row md:items-center bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-all mb-6 overflow-hidden">
        
        {/* CLICK VÀO ẢNH CHỈ MỞ SLIDE ẢNH - CẬP NHẬT KHUNG ẢNH */}
        <div 
          className="relative w-full md:w-[480px] aspect-video overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0" 
          onClick={() => setPhotoIndex(0)} // Mở ảnh đầu tiên
        >
          <img 
            src={displayImages[0] || PLACEHOLDER_IMG} 
            alt={room.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">Xem album ({displayImages.length})</span>
          </div>
        </div>

        {/* Nội dung giữa (GIỮ NGUYÊN GIAO DIỆN CŨ) */}
        {/* THÊM: self-stretch để content cao bằng ảnh trên desktop */}
        <div className="flex-1 p-5 flex flex-col justify-between self-stretch md:self-stretch md:self-auto">
          <div>
            <h3 className="text-xl font-bold text-slate-800 hover:text-[#029618] cursor-pointer" onClick={() => setIsDetailOpen(true)}>
              {room.name}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-gray-500 text-sm">
              <span>📏 {room.area}m² | 🛏️ {room.bed_type} | 👥 {room.capacity} người</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${room.available_rooms > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs font-bold">{room.available_rooms > 0 ? `Còn ${room.available_rooms} phòng` : 'Hết phòng'}</span>
          </div>
          {/* Rating summary */}
          {(room.average_rating != null || room.rating_summary?.overall != null) && (
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-yellow-400 text-white text-xs font-black rounded">
                ★ {(room.average_rating ?? room.rating_summary?.overall ?? 0).toFixed(1)}
              </span>
              {(room.total_reviews ?? room.rating_summary?.total_reviews) != null && (
                <span className="text-xs text-gray-400">
                  {room.total_reviews ?? room.rating_summary?.total_reviews} đánh giá
                </span>
              )}
            </div>
          )}
        </div>

        {/* Nút Chi Tiết mở Modal thông tin (GIỮ NGUYÊN GIAO DIỆN CŨ) */}
        {/* THÊM: self-stretch để phần giá/nút cao bằng ảnh trên desktop */}
        <div className="w-full md:w-52 p-6 flex flex-col justify-center items-end bg-slate-50 border-l self-stretch md:self-stretch md:self-auto">
          <div className="text-[#b18a5d] text-2xl font-black">{formatPrice(room.base_price)}</div>
          <div className="text-[#b18a5d] text-xs font-bold mb-5">{room.currency}</div>
          <button
            type="button"
            onClick={() => setIsDetailOpen(true)}
            className="w-full !bg-[#029618] text-white font-bold py-3 hover:bg-[#027a14]"
          >
            CHI TIẾT
          </button>
        </div>
      </div>

      {/* 1. MODAL XEM SLIDE ẢNH (CHỈ ẢNH - GIỮ NGUYÊN) */}
      {photoIndex !== null && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center select-none" onClick={() => setPhotoIndex(null)}>
          <button type="button" className="absolute top-5 right-5 text-white text-4xl hover:text-gray-400">&times;</button>

          {/* Nút lùi */}
          <button type="button" onClick={prevPhoto} className="absolute left-5 p-4 text-white hover:bg-white/10 rounded-full transition-all text-3xl">❮</button>

          {/* Ảnh hiển thị */}
          <div className="max-w-5xl max-h-[85vh] p-4" onClick={(e) => e.stopPropagation()}>
            <img 
              src={displayImages[photoIndex]} 
              className="max-w-full max-h-[80vh] object-contain shadow-2xl animate-in fade-in zoom-in duration-300"
              alt="Room preview" 
            />
            <p className="text-white text-center mt-4 font-light tracking-widest">
              {photoIndex + 1} / {displayImages.length}
            </p>
          </div>

          {/* Nút tiến */}
          <button type="button" onClick={nextPhoto} className="absolute right-5 p-4 text-white hover:bg-white/10 rounded-full transition-all text-3xl">❯</button>
        </div>
      )}

      {/* 2. MODAL CHI TIẾT (THÔNG TIN PHÒNG - GIỮ NGUYÊN) */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)}>
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-sm" onClick={(e) => e.stopPropagation()}>
            <RoomDetailComponent 
              room={room} 
              onClose={() => setIsDetailOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
};