import React, { useState, useMemo, useEffect } from 'react';
import type { RoomTypeL } from '../../../services/roomTypeService';

export const RoomCard: React.FC<{ room: RoomTypeL }> = ({ room }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const PLACEHOLDER_IMG = "https://placehold.co/600x400?text=No+Image";

  
  const displayImages = useMemo(() => {
    if (!room.images || room.images.length === 0) return [];

    let imgs = [...room.images];

    
    const shift = (room.room_type_id || 0) % imgs.length;
    const rotated = [...imgs.slice(shift), ...imgs.slice(0, shift)];

    // Lấy tối đa 7 ảnh cho album
    return rotated.slice(0, 7);
  }, [room.images, room.room_type_id]);

  const formatPrice = (p: string) => {
    const value = parseFloat(p);
    return isNaN(value) ? "Liên hệ" : new Intl.NumberFormat('vi-VN').format(value);
  };

  // Khóa scroll khi mở modal
  useEffect(() => {
    if (isDetailOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isDetailOpen]);

  return (
    <>
      <div className="group flex flex-col md:flex-row bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-all mb-6 overflow-hidden">
        
        <div 
          className="relative w-full md:w-80 h-52 md:h-auto overflow-hidden bg-gray-100 cursor-pointer" 
          onClick={() => setIsDetailOpen(true)}
        >
          <img 
            src={displayImages[0] || PLACEHOLDER_IMG} 
            alt={room.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 shadow-inner"
          />
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 backdrop-blur-sm rounded-sm">
            📷 {displayImages.length} ảnh chi tiết
          </div>
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 
              className="text-xl font-bold text-slate-800 hover:text-[#029618] cursor-pointer transition-colors"
              onClick={() => setIsDetailOpen(true)}
            >
              {room.name}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-gray-500 text-sm">
              <span className="flex items-center gap-1">📏 {room.area}m²</span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">🛏️ {room.bed_type}</span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">👥 {room.capacity} người</span>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-1.5">
              {room.amenities?.slice(0, 5).map((a, i) => (
                <span key={i} className="text-[10px] uppercase tracking-wider border border-gray-200 px-2 py-1 text-gray-500 bg-gray-50 font-medium">
                  {a}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${room.available_rooms > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
             <span className={`text-xs font-bold ${room.available_rooms > 0 ? 'text-green-600' : 'text-red-500'}`}>
               {room.available_rooms > 0 ? `Còn ${room.available_rooms} phòng trống` : 'Hết phòng'}
             </span>
          </div>
        </div>

        {/* CỘT GIÁ */}
        <div className="w-full md:w-52 p-6 flex flex-col justify-center items-end bg-slate-50 border-l border-gray-100">
          <span className="text-gray-400 text-[10px] mb-1 uppercase tracking-tighter">Giá tốt nhất</span>
          <div className="text-[#b18a5d] text-2xl font-black">{formatPrice(room.base_price)}</div>
          <div className="text-[#b18a5d] text-xs font-bold mb-5 tracking-widest">{room.currency}</div>
          <button 
            disabled={room.available_rooms === 0}
            className={`w-full font-bold py-3 px-4 rounded-sm transition-all text-sm shadow-md ${
              room.available_rooms > 0 ? '!bg-[#029618] text-white hover:shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            ĐẶT NGAY
          </button>
        </div>
      </div>

      {isDetailOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-all" onClick={() => setIsDetailOpen(false)}>
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-sm relative shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
            
            <button onClick={() => setIsDetailOpen(false)} className="absolute top-4 right-4 z-20 bg-white w-10 h-10 rounded-full flex items-center justify-center text-black shadow-xl hover:rotate-90 transition-transform">✕</button>

            <div className="p-6 md:p-10">
              <header className="mb-8 border-b pb-6">
                <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight">{room.name}</h2>
                <div className="flex gap-6 mt-4 text-emerald-700 font-bold text-sm uppercase tracking-widest">
                  <span>📏 {room.area} m²</span>
                  <span>🛏️ {room.bed_type}</span>
                  <span>👥 {room.capacity} Người lớn</span>
                </div>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
                {displayImages.map((img, index) => (
                  <div key={index} className={`relative overflow-hidden bg-gray-100 group/img ${index === 0 ? 'md:col-span-2 md:row-span-2' : 'aspect-square'}`}>
                    <img 
                      src={img} 
                      alt={`${room.name} ${index}`} 
                      className="w-full h-full object-cover transition-all duration-1000 group-hover/img:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition-colors"></div>
                    <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-[9px] font-bold text-slate-800 uppercase shadow-sm">
                      {room.name} #0{index + 1}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-12 pt-4">
                <div className="lg:col-span-2">
                   <h4 className="font-bold text-2xl mb-6 text-slate-800 border-l-4 border-emerald-500 pl-4">Trang thiết bị & Tiện ích</h4>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4">
                     {room.amenities?.map((a, i) => (
                       <div key={i} className="flex items-center text-gray-600 text-[13px] hover:text-emerald-600 transition-colors">
                         <span className="text-emerald-500 mr-2 font-black text-lg">·</span> {a}
                       </div>
                     ))}
                   </div>
                </div>
                
                <div className="bg-slate-50 p-8 rounded-sm border-t-4 border-[#b18a5d] shadow-sm">
                  <h4 className="font-black text-lg mb-6 uppercase tracking-widest text-slate-700">Chi tiết đặt phòng</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-3">
                      <span className="text-gray-400 text-xs uppercase">Loại phòng</span>
                      <span className="font-bold text-slate-800">{room.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-3">
                      <span className="text-gray-400 text-xs uppercase">Diện tích</span>
                      <span className="font-bold text-slate-800">{room.area} m²</span>
                    </div>
                    <div className="flex justify-between border-b pb-3">
                      <span className="text-gray-400 text-xs uppercase">Giường</span>
                      <span className="font-bold text-slate-800">{room.bed_type}</span>
                    </div>
                    <div className="flex justify-between border-b pb-3">
                      <span className="text-gray-400 text-xs uppercase">Sức chứa</span>
                      <span className="font-bold text-slate-800">{room.capacity} người</span>
                    </div>
                    
                    <div className="pt-8">
                      <p className="text-center text-[#b18a5d] text-3xl font-black mb-1">
                        {formatPrice(room.base_price)} <span className="text-sm font-bold">{room.currency}</span>
                      </p>
                      <p className="text-center text-gray-400 text-[10px] italic mb-6">Giá áp dụng cho 01 đêm</p>
                      
                      <button className="w-full !bg-[#029618] text-white font-bold py-4 hover:bg-[#027a14] transition-all shadow-xl uppercase tracking-widest text-sm">
                        Hoàn tất đặt phòng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};