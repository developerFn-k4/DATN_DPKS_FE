import React, { useState } from "react";
import type { RoomTypeL } from "../../../services/roomTypeService";

interface Props {
  room: RoomTypeL;
  onClose?: () => void;
}

export const RoomDetailComponent: React.FC<Props> = ({ room, onClose }) => {
  // --- DỮ LIỆU TỪ API ---
  const availableRooms = room.available_rooms || 0;
  const maxAdultsPerRoom = room.max_adults || 2;
  const maxChildrenPerRoom = room.max_children || 0;
  const capacity = Number(room.capacity) || 2;

  // --- STATE ---
  const [checkIn, setCheckIn] = useState("2026-04-10");
  const [checkOut, setCheckOut] = useState("2026-04-12");
  const [roomCount, setRoomCount] = useState(availableRooms > 0 ? 1 : 0);
  const [rooms, setRooms] = useState([{ adults: 1, children: 0, infant: 0 }]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  // --- LOGIC TÍNH TOÁN ---
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  const formatPrice = (p: number) => new Intl.NumberFormat("vi-VN").format(p);
  const basePrice = Number(room.base_price) || 0;

  const handleRoomChange = (value: number) => {
    setRoomCount(value);
    const newRooms = Array.from({ length: value }, () => ({
      adults: 1,
      children: 0,
      infant: 0,
    }));
    setRooms(newRooms);
  };

  const toggleService = (id: number) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const services = [
    { id: 1, name: "Ăn sáng", price: 100000 },
    { id: 2, name: "Đưa đón sân bay", price: 300000 },
    { id: 3, name: "Giặt ủi", price: 50000 },
    { id: 4, name: "Spa & Massage", price: 400000 },
    { id: 5, name: "Giường phụ", price: 200000 },
    { id: 6, name: "Thuê xe máy", price: 150000 },
    { id: 7, name: "Thuê xe ô tô", price: 800000 },
    { id: 8, name: "Dọn phòng", price: 50000 },
  ];

  const serviceTotal = selectedServices.reduce((total, id) => {
    const service = services.find((s) => s.id === id);
    return total + (service?.price || 0) * roomCount * nights;
  }, 0);

  const total = basePrice * roomCount * nights + serviceTotal;

  return (
    <div className="bg-white w-full max-w-6xl mx-auto relative shadow-xl rounded-lg overflow-hidden">
      {onClose && (
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black text-2xl z-50">✕</button>
      )}

      <div className="p-6 md:p-10">
        <h2 className="text-4xl font-black mb-6">{room.name}</h2>

        {/* GALLERY node  */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {room.images?.map((img, index) => (
            <img key={index} src={img} className="w-full h-40 object-cover rounded-sm" alt="room" />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* 1. TIỆN NGHI */}
            <div>
              <h4 className="font-bold text-xl mb-3 text-gray-800">Trang thiết bị & Tiện ích</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                {room.amenities?.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✔</span> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. CHỌN PHÒNG & GIỚI HẠN CAPACITY */}
            <div className="border rounded overflow-hidden shadow-sm">
              <div className="bg-gray-100 p-3 flex justify-between items-center">
                <span className="font-bold text-gray-700">
                   {roomCount} / {availableRooms} Phòng còn trống
                </span>
                <select
                  value={roomCount}
                  onChange={(e) => handleRoomChange(Number(e.target.value))}
                  className="border px-3 py-1 rounded outline-none focus:ring-1 focus:ring-green-500 bg-white"
                >
                  {Array.from({ length: availableRooms + 1 }, (_, i) => (
                    <option key={i} value={i}>{i} Phòng</option>
                  ))}
                </select>
              </div>

              {rooms.map((r, index) => {
                const currentTotalInRoom = r.adults + r.children;
                return (
                  <div key={index} className="p-4 border-t bg-white">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-bold text-green-700 uppercase tracking-wider italic border-l-4 border-green-600 pl-2">
                        Cấu hình Phòng {index + 1}
                        </p>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Sức chứa: {currentTotalInRoom} / {capacity} người
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Người lớn</label>
                        <select
                          value={r.adults}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const newRooms = [...rooms];
                            newRooms[index].adults = val;
                            setRooms(newRooms);
                          }}
                          className="w-full border rounded p-1.5 outline-none focus:border-green-500"
                        >
                          {Array.from({ length: maxAdultsPerRoom }, (_, i) => {
                            const num = i + 1;
                            const isDisabled = (num + r.children) > capacity;
                            return <option key={num} value={num} disabled={isDisabled}>{num} {isDisabled ? '(Vượt mức)' : ''}</option>;
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Trẻ em</label>
                        <select
                          value={r.children}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const newRooms = [...rooms];
                            newRooms[index].children = val;
                            setRooms(newRooms);
                          }}
                          className="w-full border rounded p-1.5 outline-none focus:border-green-500"
                        >
                          {Array.from({ length: maxChildrenPerRoom + 1 }, (_, i) => {
                            const num = i;
                            const isDisabled = (num + r.adults) > capacity;
                            return <option key={num} value={num} disabled={isDisabled}>{num} {isDisabled ? '(Vượt mức)' : ''}</option>;
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Em bé</label>
                        <select
                          value={r.infant}
                          onChange={(e) => {
                            const newRooms = [...rooms];
                            newRooms[index].infant = Number(e.target.value);
                            setRooms(newRooms);
                          }}
                          className="w-full border rounded p-1.5 outline-none focus:border-green-500"
                        >
                          {[0, 1, 2].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 h-fit sticky top-6">
            <div className="text-center pb-2 border-b border-gray-200">
              <span className="text-3xl font-black text-[#b18a5d]">{formatPrice(basePrice)}</span>
              <span className="text-gray-400 text-sm ml-1 uppercase"> VND / đêm</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ngày nhận phòng</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border border-gray-200 px-3 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-green-500/20 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ngày trả phòng</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border border-gray-200 px-3 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-green-500/20 outline-none" />
              </div>
              <div className="bg-blue-50 py-1.5 rounded-lg text-center text-blue-600 font-bold text-[11px] uppercase tracking-wide">
                Thời gian: {nights} Đêm
              </div>
            </div>

            <div>
              <p className="font-bold text-gray-700 text-sm mb-3">Dịch vụ bổ sung</p>
              <div className="space-y-1 max-h-52 overflow-y-auto text-sm pr-2 custom-scrollbar">
                {services.map((s) => (
                  <label key={s.id} className="flex justify-between items-center py-2 px-1 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-white transition-colors rounded">
                    <span className="flex items-center text-gray-600">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(s.id)}
                        onChange={() => toggleService(s.id)}
                        className="mr-3 w-4 h-4 accent-green-600 rounded"
                      />
                      {s.name}
                    </span>
                    <span className="text-gray-400 font-medium text-[11px]">{formatPrice(s.price)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed pt-4 text-sm space-y-2.5">
              <div className="flex justify-between text-gray-500">
                <span>Tiền phòng ({roomCount} x {nights} đ):</span>
                <span className="font-bold text-gray-800">{formatPrice(basePrice * roomCount * nights)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Phí dịch vụ:</span>
                <span className="font-bold text-gray-800">{formatPrice(serviceTotal)}</span>
              </div>

              <div className="flex justify-between items-center font-black text-[#b18a5d] text-2xl border-t-2 border-gray-200 mt-4 pt-4">
                <span className="text-sm text-gray-800 uppercase tracking-tighter">Tổng cộng</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* BUTTON GROUP */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                disabled={availableRooms === 0 || roomCount === 0}
                className={`py-4 rounded-xl font-bold text-[11px] uppercase transition-all shadow-md active:scale-95 ${
                  availableRooms === 0 || roomCount === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border-2 border-green-600 text-green-700 hover:bg-green-50'
                }`}
              >
                Giữ chỗ tạm thời
              </button>
              
              <button 
                disabled={availableRooms === 0 || roomCount === 0}
                className={`py-4 rounded-xl font-bold text-[11px] uppercase transition-all shadow-lg active:scale-95 ${
                  availableRooms === 0 || roomCount === 0 
                  ? '!bg-gray-300 cursor-not-allowed text-gray-500 shadow-none' 
                  : '!bg-green-600 text-white hover:bg-green-700 shadow-green-100'
                }`}
              >
                {availableRooms === 0 ? "Hết phòng" : "Đặt phòng ngay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};