import { Card } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { RoomItem } from "../../types/types";

interface RoomCardProps {
  room: RoomItem;
}

export function RoomCard({ room }: RoomCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate('/booking');
  };

  return (
    <Card
      hoverable
      cover={
        <div className="relative overflow-hidden">
          <img
            alt={room.name}
            src={room.image}
            className="h-56 w-full object-cover transition-transform duration-300 hover:scale-110"
          />
          {room.label && (
            <div
              className={`absolute right-3 top-3 rounded-lg px-3 py-1 text-xs font-medium text-white ${room.labelColor}`}
            >
              {room.label}
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
              <button 
                onClick={handleViewDetails}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Xem chi tiết
              </button>
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
