import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePopular = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://vietstay.ngrok.dev/api/rooms/room-types")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.room_types.slice(0, 4));
      });
  }, []);

  const formatPrice = (p: string) => {
    return Number(p).toLocaleString("vi-VN");
  };

  return (
    <section className="w-full px-6 md:px-12 py-20 bg-white">
      
      {/* header */}
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl font-bold">
          Gợi ý cho bạn
        </h2>

        <button
          onClick={() => navigate("/rooms")}
          className="text-blue-600 font-bold hover:underline"
        >
          Xem tất cả →
        </button>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {rooms.map((room) => (
          <div
            key={room.room_type_id}
            onClick={() => navigate(`/room/${room.room_type_id}`)}
            className="group cursor-pointer"
          >

            {/* image */}
            <div className="relative h-72 overflow-hidden rounded-2xl shadow-lg">
              <img
                src={room.images?.[0]}
                className="w-full h-full object-cover 
                group-hover:scale-110 transition duration-500"
              />

              {/* hover overlay */}
              <div className="absolute inset-0 bg-black/10 
              opacity-0 group-hover:opacity-100 transition"/>
            </div>

            {/* info */}
            <h3 className="font-bold text-lg mt-3 
            group-hover:text-[#029618] transition">
              {room.name}
            </h3>

            <div className="text-emerald-600 font-bold text-xl">
              {formatPrice(room.base_price)} đ
            </div>

            <div className="text-sm text-gray-500">
              {room.capacity} người • {room.area}m²
            </div>

          </div>
        ))}

      </div>
    </section>
  );
};

export default HomePopular;