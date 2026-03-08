import React from "react";
import { Card, Skeleton, Button, Tag } from "antd";
import { UserOutlined, ArrowRightOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface OtherRoomsProps {
  rooms: any[];
  loading: boolean;
}

export const OtherRoomsSection: React.FC<OtherRoomsProps> = ({ rooms, loading }) => {
  const navigate = useNavigate();

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800">Các lựa chọn phòng khác</h3>
        <p className="text-sm text-slate-500">Danh sách các loại phòng còn trống tại khách sạn</p>
      </div>

      <div className="flex flex-col gap-4"> {/* Chuyển từ Grid sang Flex Column */}
        {loading ? (
          [1, 2].map((item) => (
            <Card key={item} className="rounded-2xl border-none shadow-sm">
              <div className="flex gap-4">
                <Skeleton.Image className="!w-48 !h-32" active />
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </Card>
          ))
        ) : (
          rooms?.map((room) => (
            <Card
              key={room.id}
              hoverable
              className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              bodyStyle={{ padding: 0 }} // Xóa padding mặc định để layout sát biên
              onClick={() => {
                navigate(`/room/${room.id}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Ảnh bên trái */}
                <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                  <img
                    alt={room.name}
                    src={room.image}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Nội dung ở giữa */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                        {room.name}
                      </h4>
                      <Tag color="success" className="border-none bg-emerald-50 text-emerald-600 font-medium m-0">
                        Còn phòng
                      </Tag>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><UserOutlined /> {room.capacity} Khách</span>
                      <span className="flex items-center gap-1"><CheckCircleOutlined className="text-emerald-500" /> Hoàn huỷ miễn phí</span>
                    </div>
                    <ul className="mt-3 text-[11px] text-slate-400 space-y-1">
                        <li>• Không hút thuốc</li>
                        <li>• Wifi tốc độ cao</li>
                    </ul>
                  </div>
                </div>

                {/* Cột giá bên phải */}
                <div className="md:w-1/4 p-5 bg-slate-50/50 border-l border-slate-100 flex flex-col justify-center items-end text-right">
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Giá mỗi đêm</div>
                  <div className="text-xl font-black text-orange-500 my-1">
                    {Number(room.base_price).toLocaleString()} <span className="text-xs font-normal">VND</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-4">Chưa bao gồm thuế & phí</div>
                  <Button 
                    type="primary" 
                    className="!bg-emerald-600 !border-none !rounded-lg font-bold w-full md:w-auto"
                  >
                    Chọn phòng <ArrowRightOutlined />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </section>
  );
};