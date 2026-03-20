import React from "react";
import type { Room } from "../../../services/roomService";
import Tooltip from "antd/es/tooltip";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";

interface Props {
  data: Room[];
  onDelete: (id: number) => void;
  onEdit: (room: Room) => void;
}

const renderStatus = (status: Room["status"]) => {
  const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";

  switch (status) {
    case "maintenance":
      return <span className={`${base} bg-yellow-100 text-yellow-800`}>Bảo trì</span>;

    case "occupied":
      return <span className={`${base} bg-blue-100 text-blue-800`}>Đang sử dụng</span>;

    case "unavailable":
      return <span className={`${base} bg-gray-200 text-gray-600`}>Không khả dụng</span>;
    case "booked":
      return <span className={`${base} bg-purple-100 text-purple-800`}>Đã đặt</span>;
    case "reserved":
      return <span className={`${base} bg-red-300 text-red-600`}>Giữ chỗ</span>;

    default:
      return <span className={`${base} bg-green-100 text-green-800`}>Sẵn sàng</span>;
  }
};

const formatPrice = (price: number | string) => {
  return Number(price ?? 0).toLocaleString("vi-VN") + " đ";
};

const RoomTable: React.FC<Props> = ({ data, onDelete, onEdit }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white rounded-2xl shadow-md border border-gray-100">
        <thead className="bg-green-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Số Phòng</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Hình ảnh</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Loại Phòng</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Tầng</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Giá</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Ghi chú</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Trạng Thái</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Hành Động</th>
          </tr>
        </thead>

        <tbody>
          {data.map((room, index) => (
            <tr
              key={room.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-3 text-sm">{room.id}</td>

              <td className="px-4 py-3 text-sm font-medium">
                {room.room_number}
              </td>

              <td className="px-4 py-3 text-sm">
                <div className="flex -space-x-2 overflow-hidden">
                  {(room as any).images && (room as any).images.length > 0 ? (
                    (room as any).images.map((img: any) => (
                      <img
                        key={img.id}
                        src={`https://vietstay.ngrok.dev/storage/${img.image_url}`}
alt="room"
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm hover:scale-110 transition-transform cursor-pointer"
                        title="Xem ảnh"
                      />
                    ))
                  ) : (
                    <span className="text-gray-300 italic text-[10px]">Không ảnh</span>
                  )}
                </div>
              </td>

              <td className="px-4 py-3 text-sm">
                {room.room_type?.name ?? "N/A"}
              </td>

              <td className="px-4 py-3 text-sm">
                {room.floor}
              </td>

              <td className="px-4 py-3 text-sm font-medium">
                {formatPrice(room.price)}
              </td>

              <td className="px-4 py-3 text-sm text-gray-700">
                {room.note || <span className="text-gray-400 italic">Chưa có ghi chú</span>}
              </td>
              
              <td className="px-4 py-3 text-sm">
                {renderStatus(room.status)}
              </td>

            <td className="px-4 py-3 text-sm">
                <div className="flex gap-2">
                  <Tooltip title="Chỉnh sửa">
                    <button
                      onClick={() => onEdit(room)}
                      className="p-2 rounded-xl !bg-yellow-500 text-white hover:bg-yellow-600 transition flex items-center justify-center"
                    >
                      <EditOutlined />
                    </button>
                  </Tooltip>

                  <Tooltip title="Xóa">
                    <button
                      onClick={() => onDelete(room.id)}
                      className="p-2 rounded-xl !bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center"
                    >
                      <DeleteOutlined />
                    </button>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomTable;