import { useState, useEffect } from "react";
import { Select, Spin, message } from "antd";
import { HomeHeader } from "../../../../components/Header/HomeHeader";
import { HomeFooter } from "../../../../components/Footer/HomeFooter";
import { HomeBanner } from "../../../../components/HomeLayout/HomeBanner";
import type { ApiRoom, ApiRoomsResponse, RoomItem } from "../../../../types/types";
import { API_BASE_URL, API_STORAGE_URL, ENDPOINTS } from "../../../../services/endpoints/common";
import { RoomCard } from "../../../../components/RoomCard";

const { Option } = Select;

// Helper function to convert API data to RoomItem format
const convertApiRoomToRoomItem = (apiRoom: ApiRoom): RoomItem => {
  const price = parseFloat(apiRoom.price || apiRoom.room_type.base_price);
  
  // Determine label and color based on price range
  let label = "";
  let labelColor = "";
  if (price >= 3000000) {
    label = "Luxury";
    labelColor = "bg-amber-600";
  } else if (price >= 2000000) {
    label = "VIP";
    labelColor = "bg-rose-600";
  } else if (price >= 1500000) {
    label = "Suite";
    labelColor = "bg-emerald-600";
  } else if (price >= 1000000) {
    label = "Premium";
    labelColor = "bg-purple-600";
  }

  // Convert images từ API
  const images = apiRoom.images && apiRoom.images.length > 0
    ? apiRoom.images.map(img => `${API_STORAGE_URL}/${img.image_url}`)
    : [];

  // Fallback image nếu không có ảnh từ API
  const fallbackImage = `https://images.unsplash.com/photo-${1582719508461 + apiRoom.id}?w=800`;
  const mainImage = images.length > 0 ? images[0] : fallbackImage;

  return {
    id: apiRoom.id,
    name: `${apiRoom.room_type.name} - Phòng ${apiRoom.room_number}`,
    city: `Tầng ${apiRoom.floor}`,
    type: apiRoom.room_type.description,
    features: [
      `${apiRoom.room_type.capacity} người`,
      apiRoom.room_type.bed_type,
      apiRoom.status === "available" ? "Có sẵn" : "Đã đặt",
    ],
    price: price,
    image: mainImage,
    images: images.length > 0 ? images : [fallbackImage],
    label,
    labelColor,
  };
};

export default function RoomsListPage() {
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ROOMS}`);
      const data: ApiRoomsResponse = await response.json();
      
      if (data.success && data.data) {
        const convertedRooms = data.data.map(convertApiRoomToRoomItem);
        setRooms(convertedRooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      message.error("Không thể tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms =
    filterStatus === "all"
      ? rooms
      : rooms.filter((room) => 
          filterStatus === "available" 
            ? room.features.includes("Có sẵn")
            : !room.features.includes("Có sẵn")
        );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50">
      <HomeHeader />
      <HomeBanner />

      <main className="px-4 py-12 mx-auto max-w-7xl">
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
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm font-medium text-slate-700">
            Lọc theo trạng thái:
          </span>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            className="w-48"
            size="large"
          >
            <Option value="all">Tất cả</Option>
            <Option value="available">Có sẵn</Option>
            <Option value="booked">Đã đặt</Option>
          </Select>
          <span className="text-sm text-slate-500">
            ({filteredRooms.length} phòng)
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <Spin size="large" tip="Đang tải danh sách phòng..." />
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}

        {!loading && filteredRooms.length === 0 && (
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
