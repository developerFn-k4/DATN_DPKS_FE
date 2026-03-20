import { Card, Carousel } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { RoomItem } from "../../types/types";
import "./style.less";

interface RoomCardProps {
  room: RoomItem;
}

// Ảnh mặc định đẹp cho phòng
const DEFAULT_ROOM_IMAGES = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop"
];

export function RoomCard({ room }: RoomCardProps) {
  const navigate = useNavigate();

  // Kiểm tra trạng thái phòng từ features
  const isBooked = room.features.includes("Đã đặt");

  const handleViewDetails = () => {
    if (!isBooked) {
      navigate(`/room/detail/${room.id}`);
    }
  };

  // Sử dụng images từ API, hoặc fallback sang image đơn
  const displayImages = room.images && room.images.length > 0 ? room.images : [room.image];
  
  // Ảnh fallback dựa trên ID phòng
  const fallbackImage = DEFAULT_ROOM_IMAGES[room.id % DEFAULT_ROOM_IMAGES.length];

  return (
    <Card
      hoverable
      cover={
        <div className="relative overflow-hidden room-card-carousel">
          {displayImages.length > 1 ? (
            <Carousel 
              autoplay 
              autoplaySpeed={3000} 
              effect="fade"
              dots={{ className: "custom-dots" }}
            >
              {displayImages.map((img, idx) => (
                <div key={idx}>
                  <img
                    alt={`${room.name} - ${idx + 1}`}
                    src={img}
                    className="h-56 w-full object-cover room-card-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackImage;
                    }}
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <img
              alt={room.name}
              src={displayImages[0]}
              className="h-56 w-full object-cover transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImage;
              }}
            />
          )}
          {room.label && (
            <div
              className={`absolute right-3 top-3 rounded-lg px-3 py-1 text-xs font-medium text-white ${room.labelColor} z-10`}
            >
              {room.label}
            </div>
          )}
          {displayImages.length > 1 && (
            <div className="absolute left-3 top-3 rounded-lg px-2 py-1 text-xs font-medium text-white bg-black/50 z-10">
              {displayImages.length} ảnh
            </div>
          )}
        </div>
      }
      className="overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{room.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <EnvironmentOutlined />
            {room.type}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {room.features.map((feature, idx) => (
            <span
              key={idx}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
            >
              {feature}
            </span>
          ))}
        </div>

        {room.price > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm text-slate-500">Từ </span>
                <span className="text-xl font-bold text-emerald-600">
                  {room.price.toLocaleString("vi-VN")}₫
                </span>
                <span className="text-sm text-slate-500">/đêm</span>
              </div>
              {isBooked ? (
                <button 
                  disabled
                  className="rounded-lg bg-gray-400 px-4 py-2 text-sm font-medium text-white cursor-not-allowed opacity-75"
                >
                  Hết phòng
                </button>
              ) : (
                <button 
                  onClick={handleViewDetails}
                  style={{ backgroundColor: '#22c55e' }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-110"
                >
                  Xem chi tiết
                </button>
              )}
            </div>
          </div>
        )}

        {room.price === 0 && (
          <button className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-900">
            Khám phá điểm đến →
          </button>
        )}
      </div>
    </Card>
  );
}
