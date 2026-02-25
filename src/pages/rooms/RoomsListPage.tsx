import { useState } from "react";
import { HomeHeader } from "../../components/Header/HomeHeader";
import { HomeFooter } from "../../components/Footer/HomeFooter";
import { RoomCard } from "../../components/RoomCard";
import { sampleRooms } from "../../services/data";
import { Select } from "antd";

const { Option } = Select;

export default function RoomsListPage() {
  const [filterCity, setFilterCity] = useState<string>("all");

  const filteredRooms =
    filterCity === "all"
      ? sampleRooms
      : sampleRooms.filter((room) => room.city === filterCity);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50">
      <HomeHeader />

      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            Danh sách phòng
          </h1>
          <p className="mt-2 text-slate-600">
            Khám phá các phòng nghỉ tuyệt vời cho chuyến du lịch của bạn
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700">
            Lọc theo địa điểm:
          </span>
          <Select
            value={filterCity}
            onChange={setFilterCity}
            className="w-48"
            size="large"
          >
            <Option value="all">Tất cả</Option>
            <Option value="Đà Nẵng">Đà Nẵng</Option>
            <Option value="Đà Lạt">Đà Lạt</Option>
            <Option value="Phú Quốc">Phú Quốc</Option>
          </Select>
          <span className="text-sm text-slate-500">
            ({filteredRooms.length} phòng)
          </span>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-slate-500">
              Không tìm thấy phòng nào phù hợp
            </p>
          </div>
        )}
      </main>

      <HomeFooter />
    </div>
  );
}
