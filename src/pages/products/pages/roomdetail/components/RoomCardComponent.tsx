import React from "react";
import { Card, Skeleton, Tag, Button } from "antd";
import { UserOutlined, ArrowRightOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// Khai báo Interface để tránh lỗi TypeScript "loading"
interface OtherRoomsProps {
  rooms: any[];
  loading: boolean;
}

export const OtherRoomsSection: React.FC<OtherRoomsProps> = ({ rooms, loading }) => {
  const navigate = useNavigate();

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800">Các loại phòng khác tại đây</h3>
        <p className="text-sm text-slate-500">Khám phá thêm các lựa chọn nghỉ dưỡng tuyệt vời khác</p>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          // Hiển thị 2 khung xương khi loading
          [1, 2].map((i) => (
            <Card key={i} className="rounded-2xl border-none shadow-sm h-40">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Card>
          ))
        ) : (
          rooms?.map((room) => (
            <Card
              key={room.id}
              hoverable
              className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              styles={{ body: { padding: 0 } }} // Ant Design v5 dùng styles.body
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
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <UserOutlined /> {room.capacity} Người
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircleOutlined /> Hoàn huỷ miễn phí
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                       <Tag color="default" className="text-[10px] border-none bg-slate-100 italic">Wifi miễn phí</Tag>
                       <Tag color="default" className="text-[10px] border-none bg-slate-100 italic">Bữa sáng</Tag>
                    </div>
                  </div>
                </div>

                {/* Giá bên phải */}
                <div className="md:w-1/4 p-5 bg-slate-50 border-l border-slate-100 flex flex-col justify-center items-end">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Giá mỗi đêm từ</div>
                  <div className="text-xl font-black text-orange-500 my-1">
                    {Number(room.base_price).toLocaleString()} <small className="text-xs font-normal">VND</small>
                  </div>
                  <Button 
                    type="primary" 
                    className="!bg-emerald-600 !border-none !rounded-lg !h-10 font-bold mt-2"
                  >
                    Chọn phòng
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