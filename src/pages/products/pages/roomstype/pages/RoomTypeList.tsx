import React from 'react';
import { RoomCard } from '../components/RoomCard';
import { useRoomTypes } from '../hooks/roomTypeHook';

const RoomList: React.FC = () => {
  const { rooms, loading, error } = useRoomTypes();

  if (loading) return <div className="text-center py-10 italic">Đang tải danh sách phòng...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Lỗi: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Chọn loại phòng</h1>
        <p className="text-gray-500 text-sm">Vui lòng chọn phòng phù hợp với nhu cầu của bạn</p>
      </header>

      <div className="flex flex-col">
        {rooms.length > 0 ? (
          rooms.map(room => (
            <RoomCard key={room.room_type_id} room={room} />
          ))
        ) : (
          <div className="text-center py-20 text-gray-400">Không tìm thấy loại phòng nào.</div>
        )}
      </div>
    </div>
  );
};

export default RoomList;