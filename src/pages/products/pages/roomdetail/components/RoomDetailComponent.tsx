import React from "react";
import { CheckCircleOutlined, RightOutlined } from "@ant-design/icons";
import type { RoomType } from "../type";
import { Tag } from "antd";

// 1. Component Gallery Ảnh (Layout Traveloka: 1 lớn, 2 nhỏ)
export const RoomGallery = ({ images }: { images: any[] }) => {
  // Fallback nếu không có ảnh từ API
  const displayImages = images?.length > 0 ? images : [{ image_url: 'https://placehold.co/800x450' }];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[450px] mb-8 overflow-hidden rounded-xl shadow-md">
      {/* Ảnh lớn bên trái */}
      <div className="md:col-span-2 h-full overflow-hidden">
        <img 
          src={displayImages[0]?.image_url} 
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" 
          alt="Room Main" 
        />
      </div>
      
      {/* 2 ảnh nhỏ bên phải */}
      <div className="grid grid-rows-2 gap-2 h-full">
        <div className="overflow-hidden">
          <img 
            src={displayImages[1]?.image_url || displayImages[0]?.image_url} 
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" 
            alt="Room Sub 1" 
          />
        </div>
        <div className="relative overflow-hidden group">
          <img 
            src={displayImages[2]?.image_url || displayImages[0]?.image_url} 
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" 
            alt="Room Sub 2" 
          />
          {/* Lớp phủ "Xem thêm" */}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white cursor-pointer group-hover:bg-black/50 transition-all">
            <span className="font-bold text-lg">+{displayImages.length} Ảnh</span>
            <span className="text-xs">Xem tất cả</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// 2. Component Sidebar đặt phòng (Sticky Sidebar)
export const RoomSidebar = ({ price }: { price: string }) => {
  return (
    <div className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Giá phòng thấp nhất</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-orange-500">
              {Number(price || 0).toLocaleString()} VND
            </span>
            <span className="text-xs text-slate-400 font-medium">/đêm</span>
          </div>
        </div>
        <Tag color="orange" className="m-0 border-none font-bold text-[10px]">Ưu đãi nhất</Tag>
      </div>

      <div className="space-y-3 py-4 border-t border-b border-slate-50 mb-6">
        <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
          <CheckCircleOutlined /> Hoàn huỷ miễn phí trước 24h
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CheckCircleOutlined /> Xác nhận tức thì
        </div>
      </div>

      <button className="group relative w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]">
        <span className="flex items-center justify-center gap-2">
          Đặt ngay bây giờ <RightOutlined className="text-sm group-hover:translate-x-1 transition-transform" />
        </span>
      </button>

      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <p className="text-[10px] text-slate-500 leading-relaxed text-center">
          ⚡️ <b>12 người</b> khác đang xem phòng này. Đừng bỏ lỡ giá tốt nhất hôm nay!
        </p>
      </div>
    </div>
  );
};