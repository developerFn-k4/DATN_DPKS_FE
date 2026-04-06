import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import { Avatar, Progress, Rate, Input } from "antd";
import type { RoomTypeL } from "../../../services/roomTypeService";

const { TextArea } = Input;

interface Props {
  room: RoomTypeL & { 
    total_reviews?: number; 
    average_rate?: number;
    extra_adult_price?: string;
  };
  onClose?: () => void;
}

export const RoomDetailComponent: React.FC<Props> = ({ room, onClose }) => {
  const navigate = useNavigate();

  // --- DỮ LIỆU TỪ API ---
  const availableRooms = room.available_rooms || 0;
  const maxAdultsPerRoom = room.max_adults || 2;
  const maxChildrenPerRoom = room.max_children || 0;
  const capacity = Number(room.capacity) || 2;
  const extraAdultPrice = Number(room.extra_adult_price) || 200000;

  // --- DANH SÁCH DỊCH VỤ TĨNH (CỦA BẠN) ---
  const staticServices = [
    { id: 1, name: "Ăn sáng", price: 100000 },
    { id: 2, name: "Đưa đón sân bay", price: 300000 },
    { id: 3, name: "Giặt ủi", price: 50000 },
    { id: 4, name: "Spa & Massage", price: 400000 },
    { id: 5, name: "Giường phụ", price: 200000 },
    { id: 6, name: "Thuê xe máy", price: 150000 },
    { id: 7, name: "Thuê xe ô tô", price: 800000 },
    { id: 8, name: "Dọn phòng", price: 50000 },
  ];

  // Gộp dịch vụ tĩnh và dịch vụ từ API (nếu có)
  const apiServices = room.services?.map(s => ({
    id: s.id || s.service_id,
    name: s.name,
    price: Number(s.price)
  })) || [];

  const allServices = [...staticServices, ...apiServices];

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
    setRooms(Array.from({ length: value }, () => ({ adults: 1, children: 0, infant: 0 })));
  };

  const toggleService = (id: number) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Tính phụ thu (Dựa trên logic Vượt mức của bạn)
  const extraChargeTotal = rooms.reduce((acc, r) => {
    const overshoot = (r.adults + r.children) - capacity;
    return acc + (overshoot > 0 ? overshoot * extraAdultPrice : 0);
  }, 0) * nights;

  // Tính tổng dịch vụ
  const serviceTotal = selectedServices.reduce((total, id) => {
    const service = allServices.find((s) => s.id === id);
    return total + (service?.price || 0) * roomCount * nights;
  }, 0);

  const total = (basePrice * roomCount * nights) + serviceTotal + extraChargeTotal;

  const handleBooking = () => {
    const bookingData = {
      roomId: room.room_type_id,
      roomName: room.name,
      checkIn, checkOut, nights, roomCount,
      guestConfig: rooms,
      selectedServices: allServices.filter(s => selectedServices.includes(s.id)),
      totalPrice: total
    };
    navigate("/booking", { state: bookingData });
    if (onClose) onClose();
  };

  return (
    <div className="bg-white w-full max-w-6xl mx-auto relative shadow-xl rounded-lg overflow-hidden border">
      {onClose && (
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black text-2xl z-50">✕</button>
      )}

      <div className="p-6 md:p-10">
        <h2 className="text-4xl font-black mb-6">{room.name}</h2>

        {/* GALLERY */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {room.images?.map((img, index) => (
            <img key={index} src={img} className="w-full h-40 object-cover rounded-sm" alt="room" />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* TIỆN NGHI */}
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

            {/* CHỌN PHÒNG & LOGIC VƯỢT MỨC */}
            <div className="border rounded overflow-hidden shadow-sm">
              <div className="bg-gray-100 p-3 flex justify-between items-center">
                <span className="font-bold text-gray-700">{roomCount} / {availableRooms} Phòng còn trống</span>
                <select value={roomCount} onChange={(e) => handleRoomChange(Number(e.target.value))} className="border px-3 py-1 rounded outline-none bg-white">
                  {Array.from({ length: availableRooms + 1 }, (_, i) => <option key={i} value={i}>{i} Phòng</option>)}
                </select>
              </div>

              {rooms.map((r, index) => (
                <div key={index} className="p-4 border-t bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-green-700 uppercase tracking-wider italic border-l-4 border-green-600 pl-2">Cấu hình Phòng {index + 1}</p>
                    <span className="text-xs font-medium text-gray-500">Sức chứa: {r.adults + r.children} / {capacity}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Người lớn</label>
                      <select value={r.adults} onChange={(e) => { const n = [...rooms]; n[index].adults = Number(e.target.value); setRooms(n); }} className="w-full border rounded p-1.5 outline-none">
                        {Array.from({ length: maxAdultsPerRoom }, (_, i) => {
                          const num = i + 1;
                          const isDisabled = (num + r.children) > capacity + 1;
                          return <option key={num} value={num} disabled={isDisabled}>{num} {(num + r.children) > capacity ? '(Vượt mức)' : ''}</option>
                        })}
                      </select>
                    </div>
                    {/* Render tương tự cho Trẻ em và Em bé như code cũ của bạn */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Trẻ em</label>
                      <select value={r.children} onChange={(e) => { const n = [...rooms]; n[index].children = Number(e.target.value); setRooms(n); }} className="w-full border rounded p-1.5 outline-none">
                        {Array.from({ length: maxChildrenPerRoom + 1 }, (_, i) => {
                          const num = i;
                          const isDisabled = (num + r.adults) > capacity + 1;
                          return <option key={num} value={num} disabled={isDisabled}>{num} {(num + r.adults) > capacity ? '(Vượt mức)' : ''}</option>
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Em bé</label>
                      <select value={r.infant} onChange={(e) => { const n = [...rooms]; n[index].infant = Number(e.target.value); setRooms(n); }} className="w-full border rounded p-1.5 outline-none">
                        {[0, 1, 2].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ĐÁNH GIÁ & COMMENT */}
            <div className="pt-8 border-t border-gray-100">
                <h4 className="font-bold text-xl mb-6 text-gray-800">Xếp hạng và đánh giá</h4>
                <div className="flex flex-col md:flex-row gap-10 items-center mb-8">
                    <div className="text-center">
                        <div className="text-6xl font-black text-gray-800">{room.average_rate || 5}</div>
                        <Rate disabled defaultValue={room.average_rate || 5} allowHalf className="text-xs text-yellow-500 my-2" />
                        <div className="text-xs text-gray-400">{room.total_reviews || 0} nhận xét</div>
                    </div>
                    <div className="flex-1 space-y-1.5 w-full">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                <span className="w-2">{star}</span>
                                <Progress percent={star === 5 ? 80 : 10} showInfo={false} strokeColor="#059669" trailColor="#f3f4f6" size="small" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar icon={<UserOutlined />} className="bg-white text-gray-400" />
                        <Rate defaultValue={5} className="text-sm" />
                    </div>
                    <TextArea rows={3} placeholder="Viết nhận xét..." className="rounded-xl border-none shadow-sm mb-3" />
                    <div className="flex justify-end"><button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm"><SendOutlined /> Gửi</button></div>
                </div>
            </div>
          </div>

          {/* SIDEBAR TỔNG TIỀN (BAO GỒM CẢ STATIC VÀ API SERVICES) */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 h-fit sticky top-6">
            <div className="text-center pb-2 border-b border-gray-200">
              <span className="text-3xl font-black text-[#b18a5d]">{formatPrice(basePrice)}</span>
              <span className="text-gray-400 text-sm ml-1 uppercase"> VND / đêm</span>
            </div>

            {/* Ngày tháng giữ nguyên */}
            <div className="space-y-3">
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border px-3 py-2 rounded-lg" />
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border px-3 py-2 rounded-lg" />
              <div className="bg-blue-50 py-1.5 rounded-lg text-center text-blue-600 font-bold text-[11px]">Thời gian: {nights} Đêm</div>
            </div>

            {/* DỊCH VỤ BỔ SUNG (GỘP CẢ HAI) */}
            <div>
              <p className="font-bold text-gray-700 text-sm mb-3">Dịch vụ bổ sung</p>
              <div className="space-y-1 max-h-60 overflow-y-auto text-sm pr-2 custom-scrollbar">
                {allServices.map((s) => (
                  <label key={s.id} className="flex justify-between items-center py-2 px-1 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-white transition-colors rounded">
                    <span className="flex items-center text-gray-600">
                      <input type="checkbox" checked={selectedServices.includes(s.id)} onChange={() => toggleService(s.id)} className="mr-3 w-4 h-4 accent-green-600 rounded" />
                      {s.name}
                    </span>
                    <span className="text-gray-400 font-medium text-[11px]">{formatPrice(s.price)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed pt-4 text-sm space-y-2.5">
              <div className="flex justify-between text-gray-500">
                <span>Tiền phòng:</span>
                <span className="font-bold text-gray-800">{formatPrice(basePrice * roomCount * nights)}</span>
              </div>
              {extraChargeTotal > 0 && (
                <div className="flex justify-between text-orange-600 italic">
                  <span>Phụ thu vượt người:</span>
                  <span className="font-bold">+{formatPrice(extraChargeTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Phí dịch vụ:</span>
                <span className="font-bold text-gray-800">{formatPrice(serviceTotal)}</span>
              </div>
              <div className="flex justify-between items-center font-black text-[#b18a5d] text-2xl border-t-2 border-gray-200 mt-4 pt-4">
                <span className="text-sm text-gray-800 uppercase">Tổng cộng</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button onClick={handleBooking} disabled={availableRooms === 0 || roomCount === 0} className="w-full py-4 rounded-xl font-bold !bg-green-600 text-white hover:bg-green-700">
              {availableRooms === 0 ? "Hết phòng" : "Đặt phòng ngay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};