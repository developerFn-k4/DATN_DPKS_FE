import React from "react";
import { useNavigate } from "react-router-dom";
import type { Room } from "../../../services/roomService";
import Tooltip from "antd/es/tooltip";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";

interface Props {
  data: Room[];
  onDelete: (id: number) => void;
  onEdit: (room: Room) => void;
}

const renderStatus = (status: Room["status"]) => {
  const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
  switch (status) {
    case "maintenance": return <span className={`${base} bg-yellow-100 text-yellow-800`}>Bảo trì</span>;
    case "occupied": return <span className={`${base} bg-blue-100 text-blue-800`}>Đang sử dụng</span>;
    case "booked": return <span className={`${base} bg-purple-100 text-purple-800`}>Đã đặt</span>;
    case "reserved": return <span className={`${base} bg-red-100 text-red-600`}>Giữ chỗ</span>;
    case "unavailable": return <span className={`${base} bg-gray-200 text-gray-600`}>Không khả dụng</span>;
    default: return <span className={`${base} bg-green-100 text-green-800`}>Sẵn sàng</span>;
  }
};

const RoomTable: React.FC<Props> = ({ data, onDelete, onEdit }) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white rounded-2xl shadow-md border border-gray-100">
        <thead className="bg-green-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">ID</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Số Phòng</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Loại Phòng</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Tầng</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Trạng Thái</th>
            <th className="px-6 py-4 text-center text-sm font-bold text-gray-600">Hành Động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((room) => (
            <tr key={room.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-500">#{room.id}</td>
              <td className="px-6 py-4 text-sm font-bold text-gray-800">{room.room_number}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{room.room_type?.name ?? "N/A"}</td>
              <td className="px-6 py-4 text-sm text-gray-600">Tầng {room.floor}</td>
              <td className="px-6 py-4 text-sm">{renderStatus(room.status)}</td>
              <td className="px-6 py-4 text-sm">
                <div className="flex justify-center gap-3">
                  <Tooltip title="Xem chi tiết">
                    <button onClick={() => navigate(`/admin/rooms/${room.id}`)} className="p-2 rounded-lg !bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm"><EyeOutlined /></button>
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <button onClick={() => onEdit(room)} className="p-2 rounded-lg !bg-yellow-500 text-white hover:bg-yellow-600 transition shadow-sm"><EditOutlined /></button>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <button onClick={() => onDelete(room.id)} className="p-2 rounded-lg !bg-red-500 text-white hover:bg-red-600 transition shadow-sm"><DeleteOutlined /></button>
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