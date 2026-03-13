import React, { useState } from "react";
import { useRoom } from "../hooks/adminRoomHook";
import type { Room } from "../../../services/roomService";
import RoomTable from "../components/roomTable";
import RoomModal from "../components/roomModal";
import { Toaster } from "react-hot-toast";

const QuanLyRoomPage: React.FC = () => {
  const { rooms, loading, createRoom, updateRoom, deleteRoom } = useRoom();
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

  // Giữ nguyên logic giao diện, "data" bây giờ sẽ là FormData nhận từ RoomModal
  const handleSave = async (data: any) => {
    try {
      if (selectedRoom) {
        // Gửi FormData qua updateRoom
        await updateRoom(selectedRoom.id, data);
      } else {
        // Gửi FormData qua createRoom
        await createRoom(data);
      }

      handleCloseModal();
    } catch (error: any) {
      // Log lỗi chi tiết từ server nếu có
      console.error("Lỗi API:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản Lý Phòng</h2>
        <button
          onClick={handleAddNew}
          className="px-5 py-2 !bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-sm"
        >
          + Thêm phòng
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="flex flex-col items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-500">Đang tải dữ liệu sạch...</p>
          </div>
        ) : (
          <RoomTable
            data={rooms}
            onDelete={deleteRoom}
            onEdit={handleEdit}
          />
        )}
      </div>

      <RoomModal
        // Key giúp reset hoàn toàn state của modal mỗi khi đóng/mở
        key={isModalOpen ? (selectedRoom ? `edit-${selectedRoom.id}` : 'add-new') : 'closed'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedRoom}
        onSave={handleSave}
      />
    </div>
  );
};

export default QuanLyRoomPage;