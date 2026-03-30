import React, { useState } from "react";
import RoomTypeModal from "../components/RoomTypeModal";
import { Toaster } from "react-hot-toast";
import { EditOutlined, DeleteOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";
import { useRoomType } from "../hooks/RoomType";

const QuanLyRoomTypePage = () => {
  const { roomTypes, loading, createRoomType, updateRoomType, deleteRoomType } = useRoomType();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const handleSave = async (data: FormData) => {
  const targetId = selected?.room_type_id || selected?.id;
  
  try {
    if (selected && targetId) {
      // Đợi hàm update chạy xong
      const success = await updateRoomType(targetId, data);
      if (success) {
        setModalOpen(false); // Đóng modal khi "thành công" (kể cả lỗi 500 giả)
      }
    } else {
      await createRoomType(data);
      setModalOpen(false);
    }
  } catch (err) {
    console.error("Lỗi thực sự:", err);
  }
};

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Quản Lý Loại Phòng</h1>
          <p className="text-sm text-gray-400">Danh sách các hạng phòng đang kinh doanh</p>
        </div>
        <button 
          onClick={() => { setSelected(null); setModalOpen(true); }} 
          className="!bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-indigo-200 hover:scale-105 transition-all font-bold flex items-center gap-2"
        >
          <PlusOutlined /> Thêm loại phòng mới
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-gray-100">
              <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">ID</th>
              <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Thông tin loại phòng</th>
              <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Thư viện ảnh</th>
              <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Giá cơ bản</th>
              <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Quy cách</th>
              <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
              <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {roomTypes.map(rt => {
              const displayId = rt.room_type_id || (rt as any).id;
              return (
                <tr key={displayId} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-5 text-sm font-bold text-slate-400">#{displayId}</td>
                  <td className="p-5">
                    <div className="font-black text-slate-700 text-base">{rt.name}</div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase">{rt.bed_type}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex -space-x-4">
                      {rt.images && rt.images.length > 0 ? (
                        rt.images.slice(0, 4).map((img) => {
                          // --- ĐOẠN SỬA ---
                          const finalImageUrl = img.image_url.startsWith("http") 
                            ? img.image_url 
                            : `https://vietstay.ngrok.dev/storage/${img.image_url}`;
                          // ----------------

                          return (
                            <img
                              key={img.id}
                              src={finalImageUrl}
                              alt="thumb"
                              className="h-12 w-12 rounded-2xl ring-4 ring-white object-cover shadow-lg hover:-translate-y-1 transition-transform cursor-pointer"
                              onError={(e) => { 
                                (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Error"; 
                              }}
                            />
                          );
                        })
                      ) : (
                        <div className="h-12 w-12 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                          <PictureOutlined />
                        </div>
                      )}
                      {rt.images && rt.images.length > 4 && (
                        <div className="h-12 w-12 rounded-2xl bg-slate-800 text-white text-[10px] flex items-center justify-center ring-4 ring-white font-bold">
                          +{rt.images.length - 4}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-5 font-black text-orange-500 text-base">
                    {Number(rt.base_price).toLocaleString()} <span className="text-[10px] text-gray-400">VND</span>
                  </td>
                  <td className="p-5">
                    <div className="text-sm text-slate-600 font-bold">👤 {rt.capacity} người</div>
                    <div className="text-[11px] text-slate-400 font-medium">📏 {rt.area} m²</div>
                  </td>
                  <td className="p-5">
                    <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-tighter ${
                      rt.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {rt.status === 'active' ? '● Hoạt động' : '○ Tạm ngưng'}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setSelected(rt); setModalOpen(true); }} className="p-3 !bg-amber-300 text-amber-600 rounded-2xl hover:!bg-amber-500 hover:text-white transition-all shadow-sm"><EditOutlined /></button>
                      <button onClick={() => deleteRoomType(displayId)} className="p-3 !bg-rose-300 text-rose-600 rounded-2xl hover:!bg-rose-500 hover:text-white transition-all shadow-sm"><DeleteOutlined /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <RoomTypeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} initialData={selected} onSave={handleSave} />
    </div>
  );
};

export default QuanLyRoomTypePage;