import React, { useState } from "react";
import RoomTypeModal from "../components/RoomTypeModal";
import { Toaster } from "react-hot-toast";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRoomType } from "../hooks/RoomType";

const QuanLyRoomTypePage = () => {
  const { roomTypes, loading, createRoomType, updateRoomType, deleteRoomType } = useRoomType();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const handleSave = async (data: FormData) => {
    if (selected) await updateRoomType(selected.room_type_id, data);
    else await createRoomType(data);
    setModalOpen(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Loại Phòng</h1>
        <button onClick={() => { setSelected(null); setModalOpen(true); }} className="!bg-green-500 text-white px-4 py-2 rounded-xl shadow-md">+ Thêm loại phòng</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Tên loại</th>
              <th className="p-4">Ảnh</th>
              <th className="p-4">Giá (VND)</th>
              <th className="p-4">Sức chứa</th>
              <th className="p-4">Diện tích</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
                  <tbody>
                      {roomTypes.map(rt => (
                          <tr key={rt.room_type_id} className="border-b hover:bg-gray-50 transition-colors">
                              <td className="p-4 text-sm text-gray-500">{rt.room_type_id || (rt as any).id}</td>
                              <td className="p-4">
                                  <div className="font-bold text-slate-700">{rt.name}</div>
                                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">{rt.bed_type}</div>
                              </td>

                              {/* PHẦN HIỂN THỊ ẢNH MỚI BỔ SUNG */}
                              <td className="p-4">
                                  <div className="flex -space-x-3 overflow-hidden">
                                      {rt.images && rt.images.length > 0 ? (
                                          rt.images.map((img) => (
                                              <img
                                                  key={img.id}
                                                  src={`https://vietstay.ngrok.dev/storage/${img.image_url}`}
                                                  alt="room-type"
                                                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-sm hover:scale-110 transition-transform cursor-pointer"
                                                  onError={(e) => {
                                                      (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Error";
                                                  }}
                                              />
                                          ))
                                      ) : (
                                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-dashed border-gray-300">
                                              <span className="text-[9px] text-gray-400">No ảnh</span>
                                          </div>
                                      )}
                                  </div>
                              </td>

                              <td className="p-4 text-orange-600 font-bold">
                                  {Number(rt.base_price).toLocaleString()}đ
                              </td>
                              <td className="p-4 text-sm text-gray-600">
                                  👤 {rt.capacity} người
                              </td>
                              <td className="p-4 text-sm text-gray-600">
                                  📏 {rt.area}m²
                              </td>
                              <td className="p-4">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${rt.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                      }`}>
                                      {rt.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                                  </span>
                              </td>
                              <td className="p-4 flex gap-2">
                                  <button
                                      onClick={() => { setSelected(rt); setModalOpen(true); }}
                                      className="p-2 !bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition shadow-sm"
                                  >
                                      <EditOutlined />
                                  </button>
                                  <button
                                      onClick={() => deleteRoomType(rt.room_type_id)}
                                      className="p-2 !bg-red-500 text-white rounded-xl hover:bg-red-600 transition shadow-sm"
                                  >
                                      <DeleteOutlined />
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
        </table>
      </div>

      <RoomTypeModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        initialData={selected} 
        onSave={handleSave} 
      />
    </div>
  );
};
export default QuanLyRoomTypePage;