import React, { useState } from "react";
import { useRoom } from "../hooks/adminRoomHook";
import type { Room } from "../../../services/roomService";
import RoomTable from "../components/roomTable";
import RoomModal from "../components/roomModal";
import { Toaster } from "react-hot-toast";

const QuanLyRoomPage: React.FC = () => {
  // 1. Lấy thêm roomTypes từ custom hook
  const { rooms, roomTypes, loading, createRoom, updateRoom, deleteRoom } = useRoom();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedRoom(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRoom(null);
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedRoom) {
        await updateRoom(selectedRoom.id, data);
      } else {
        await createRoom(data);
      }
      handleCloseModal();
    } catch (error: any) {
      console.error("Lỗi API:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Quản Lý Phòng
          </h2>
        
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 !bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 active:scale-95 font-semibold"
        >
          <span className="text-xl">+</span> Thêm phòng mới
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
               <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-100 border-t-green-500"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="h-2 w-2 !bg-green-500 rounded-full animate-pulse"></div>
               </div>
            </div>
            <p className="mt-6 text-gray-400 font-medium animate-pulse text-sm uppercase tracking-widest">
              Đang đồng bộ dữ liệu...
            </p>
          </div>
        ) : (
          <div className="p-2">
            <RoomTable
              data={rooms}
              onDelete={deleteRoom}
              onEdit={handleEdit}
            />
          </div>
        )}
      </div>

      {/* Modal Section */}
      <RoomModal
        // Sử dụng key dựa trên cả ID phòng và trạng thái mở để reset form hoàn toàn mỗi khi mở modal
        key={isModalOpen ? (selectedRoom ? `edit-${selectedRoom.id}` : 'add-new') : 'closed'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedRoom}
        onSave={handleSave}
        roomTypes={roomTypes} // TRUYỀN DANH SÁCH LOẠI PHÒNG VÀO ĐÂY
      />
    </div>
  );
};

export default QuanLyRoomPage;