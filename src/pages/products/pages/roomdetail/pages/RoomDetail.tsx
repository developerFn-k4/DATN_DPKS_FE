import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Tag, Divider, Row, Col, Skeleton } from "antd";
import { 
  EnvironmentOutlined, 
  StarFilled, 
  WifiOutlined, 
  CoffeeOutlined, 
  CheckCircleOutlined,
  UserOutlined,
  ExpandOutlined
} from "@ant-design/icons";

// Import Components & Hooks
import { useRoomHook } from "../hooks/RoomHook";
import { RoomGallery, RoomSidebar } from "../components/RoomDetailComponent";
import { HomeHeader } from "../../../../../components/Header/HomeHeader";
import { HomeFooter } from "../../../../../components/Footer/HomeFooter";

// Import Style
import "../style.less";
import { OtherRoomsSection } from "../components/RoomCardComponent";

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Gọi Hook lấy dữ liệu
  const { roomData, otherRooms, loading } = useRoomHook(id || "6");

  // Màn hình Loading
  if (loading && !roomData) {
    return (
      <div className="min-h-screen bg-white">
        <HomeHeader />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Skeleton active avatar paragraph={{ rows: 12 }} />
        </div>
        <HomeFooter />
      </div>
    );
  }

  // Trường hợp không có dữ liệu
  if (!roomData) {
    return (
      <div className="min-h-screen bg-[#f7f9fa]">
        <HomeHeader />
        <div className="p-20 text-center flex flex-col items-center gap-4">
          <div className="text-red-500 text-lg font-bold">Không tìm thấy thông tin phòng!</div>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg cursor-pointer"
          >
            Quay lại trang chủ
          </button>
        </div>
        <HomeFooter />
      </div>
    );
  }

  return (
    <div className="room-detail-container bg-[#f7f9fa]">
      <HomeHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        
        {/* Section 1: Tiêu đề (Sửa name -> room_number dựa trên log API của bạn) */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Tag color="blue" className="rounded-sm border-none px-2 font-bold uppercase text-[10px]">
              {roomData.status === 'available' ? 'Phòng trống' : 'Phòng khách sạn'}
            </Tag>
            <div className="flex gap-0.5 text-[10px] text-yellow-400">
              {[...Array(5)].map((_, i) => <StarFilled key={i} />)}
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            {roomData.hotel?.name || "VietStay Hotel"} - Phòng {roomData.room_number || roomData.name}
          </h1>
          <div className="mt-2 flex items-center gap-1.5 text-slate-500">
            <EnvironmentOutlined className="text-blue-500" />
            <span className="text-sm font-medium">
                {roomData.hotel?.address || `Tầng ${roomData.floor}, VietStay Hotel`}
            </span>
          </div>
        </section>

        {/* Section 2: Gallery Ảnh (Đã sửa map images) */}
        <RoomGallery 
          images={
            roomData?.room_images && roomData.room_images.length > 0
              ? roomData.room_images.map((img: any) => img.image_url)
              : ["https://placehold.co/1200x800?text=VietStay+Room"]
          } 
        />

        {/* Section 3: Bố cục 2 cột */}
        <Row gutter={[24, 24]} className="mt-8">
          <Col xs={24} lg={16}>
            <div className="space-y-6">
              
              <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                <h3 className="mb-5 text-lg font-bold text-slate-800">Tiện nghi phổ biến</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <WifiOutlined />
                    </div>
                    <span className="text-sm font-medium">WiFi miễn phí</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CoffeeOutlined />
                    </div>
                    <span className="text-sm font-medium">Bữa sáng</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CheckCircleOutlined />
                    </div>
                    <span className="text-sm font-medium">Điều hòa</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <ExpandOutlined />
                    </div>
                    <span className="text-sm font-medium">Tầng {roomData.floor}</span>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-none shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-800">Chi tiết phòng</h3>
                <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line italic border-l-4 border-emerald-400 pl-4 bg-slate-50 py-4 rounded-r-lg">
                  "{roomData.description || `Chào mừng bạn đến với phòng ${roomData.room_number}. Một không gian nghỉ dưỡng tuyệt vời tại VietStay.`}"
                </p>
                <Divider className="my-6" />
                <div className="flex flex-wrap gap-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Loại giường</span>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <CheckCircleOutlined className="text-emerald-500" /> {roomData.bed_type || "Giường đôi Queen"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sức chứa</span>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <UserOutlined className="text-emerald-500" /> {roomData.capacity || 2} Khách
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Col>

          {/* Cột phải: Sidebar (Sửa giá lấy từ base_price hoặc giá trị mặc định) */}
          <Col xs={24} lg={8}>
            <RoomSidebar price={roomData.base_price || "1200000"} />
          </Col>
        </Row>

        <Divider className="my-12 border-slate-200" />
        <OtherRoomsSection rooms={otherRooms} loading={loading} />

      </main>

      <HomeFooter />
    </div>
  );
};

export default RoomDetail;