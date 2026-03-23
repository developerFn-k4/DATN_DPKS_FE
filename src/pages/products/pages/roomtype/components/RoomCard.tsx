import React from 'react';
import type { RoomType } from '../../../services/roomTypeService';

export const RoomCard: React.FC<{ room: RoomType }> = ({ room }) => {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN').format(parseFloat(price));
  };

  return (
    <div className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden mb-5">
      {/* Hình ảnh */}
      <div className="relative w-full md:w-80 h-48 md:h-auto">
        <img 
          src="https://via.placeholder.com/400x250?text=Room+Image" 
          alt={room.name} 
          className="w-full h-full object-cover"
        />
        <button className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] px-2 py-1 flex items-center gap-1">
          📷 Xem thêm ảnh
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">{room.name}</h3>
          <p className="text-gray-500 text-xs mt-1 italic">
             {room.area}m² | {room.bed_type} | Sức chứa: {room.capacity} người
          </p>
          
          <div className="mt-4 flex flex-wrap gap-1">
            {room.amenities.slice(0, 4).map((item, i) => (
              <span key={i} className="text-[10px] border border-gray-300 px-2 py-0.5 text-gray-600 rounded-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-3">
          <span className="text-green-600 text-xs font-semibold">
            ✓ Còn {room.available_rooms} phòng trống
          </span>
        </div>
      </div>

      {/* Giá & Booking */}
      <div className="w-full md:w-52 border-t md:border-t-0 md:border-l border-gray-100 p-5 flex flex-col justify-center items-end bg-gray-50/50">
        <span className="text-gray-400 text-[11px]">Chỉ từ</span>
        <div className="text-[#d4a373] text-2xl font-bold leading-none my-1">
          {formatPrice(room.base_price)}
        </div>
        <div className="text-[#d4a373] text-xs font-bold uppercase mb-1">{room.currency}</div>
        <span className="text-gray-400 text-[10px] mb-4 italic text-right">phòng/đêm</span>
        
        <button className="w-full bg-[#003580] hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-sm transition-all uppercase text-sm">
          ĐẶT NGAY
        </button>
      </div>
    </div>
  );
};