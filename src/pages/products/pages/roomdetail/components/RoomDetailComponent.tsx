import React from "react";
import type { RoomTypeL } from "../../../services/roomTypeService";

interface Props {
  room: RoomTypeL;
  onClose?: () => void; // Thêm prop để đóng modal
}

export const RoomDetailComponent: React.FC<Props> = ({ room, onClose }) => {
  const formatPrice = (p: string) => {
    const value = parseFloat(p);
    return isNaN(value) ? "Liên hệ" : new Intl.NumberFormat("vi-VN").format(value);
  };

  const displayImages = room.images || [];

  return (
    <div className="bg-white w-full max-w-6xl mx-auto relative">
      {/* Nút đóng cho Modal */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black text-2xl z-50"
        >
          ✕
        </button>
      )}

      <div className="p-6 md:p-10">
        <header className="mb-8 border-b pb-6">
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight">
            {room.name}
          </h2>
          <div className="flex gap-6 mt-4 text-emerald-700 font-bold text-sm uppercase tracking-widest">
            <span>📏 {room.area} m²</span>
            <span>🛏️ {room.bed_type}</span>
            <span>👥 {room.capacity} Người lớn</span>
          </div>
        </header>

        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {displayImages.map((img, index) => (
            <div key={index} className="aspect-square overflow-hidden bg-gray-100">
              <img src={img} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform" />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12 pt-4">
          <div className="lg:col-span-2">
            <h4 className="font-bold text-2xl mb-6">Trang thiết bị & Tiện ích</h4>
            <div className="grid grid-cols-2 gap-y-5">
              {room.amenities?.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-700">
                  <span className="text-emerald-500">✓</span> {a}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-sm shadow-sm h-fit">
            <p className="text-center text-3xl font-black mb-6 text-[#b18a5d]">
              {formatPrice(room.base_price)} {room.currency}
            </p>
            <button className="w-full bg-[#029618] hover:bg-[#027a14] text-white font-bold py-4 transition-colors">
              HOÀN TẤT ĐẶT PHÒNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};