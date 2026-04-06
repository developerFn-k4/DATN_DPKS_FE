import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoomDetailComponent } from "../../pages/products/pages/roomdetail/components/RoomDetailComponent";
import type { RoomTypeL } from "../../pages/products/services/roomTypeService";

const HomePopular = () => {
  const [rooms, setRooms] = useState<RoomTypeL[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomTypeL | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://vietstay.ngrok.dev/api/rooms/room-types")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.room_types.slice(0, 3)); // chỉ lấy 3 phòng
      });
  }, []);

  const formatPrice = (p: string) => Number(p).toLocaleString("vi-VN");

  return (
    <section className="w-full px-6 md:px-12 py-20 bg-white">

      {/* header */}
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl font-bold">Gợi ý cho bạn</h2>
        <button
          onClick={() => navigate("/rooms")}
          className="text-blue-600 font-bold hover:underline"
        >
          Xem tất cả →
        </button>
      </div>

      {/* grid 3 phòng, căn giữa */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center">

        {rooms.map((room) => (
          <div
            key={room.room_type_id}
            onClick={() => {
              setSelectedRoom(room);
              setIsDetailOpen(true);
            }}
            className="group cursor-pointer w-full max-w-sm bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* image */}
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={room.images?.[4] || room.images?.[0]}
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-30 transition-opacity" />
            </div>

            {/* info */}
            <div className="p-4 flex flex-col justify-between">
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#029618] truncate">
                {room.name}
              </h3>

              <div className="mt-2 text-gray-500 text-sm">
                📏 {room.area}m² • 👥 {room.capacity} người
              </div>

              <div className="mt-3">
                <div className="text-[#b18a5d] text-xl font-black">
                  {formatPrice(room.base_price)}
                </div>
                <div className="text-[#b18a5d] text-xs font-bold">
                  {room.currency}
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* modal detail */}
      {isDetailOpen && selectedRoom && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsDetailOpen(false)}
        >
          <div
            className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <RoomDetailComponent
              room={selectedRoom}
              onClose={() => setIsDetailOpen(false)}
            />
          </div>
        </div>
      )}

    </section>
  );
};

export default HomePopular;