import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useAdminRoom } from '../hooks/adminRoomHook';
import { roomService } from '../../../services/roomService';
import RoomTable from '../components/roomTable';
import RoomModal from '../components/roomModal';

const QuanLyRoomPage: React.FC = () => {
  const { rooms, loading, refresh, handleDelete } = useAdminRoom();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleOpenEdit = (id: number) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleSave = async (values: any) => {
    try {
      await roomService.saveRoom(editingId, values);
      message.success(editingId ? "Cập nhật thành công" : "Thêm mới thành công");
      setIsModalOpen(false);
      refresh();
    } catch (error) {
      message.error("Lưu thông tin thất bại");
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản lý danh sách phòng</h2>
        <Button type="primary" onClick={() => { setEditingId(null); setIsModalOpen(true); }}>
          + Thêm phòng
        </Button>
      </div>

      <RoomTable 
        data={rooms} 
        loading={loading} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
      />

      {/* Modal này sẽ nhận editingId để fetch chi tiết phòng nếu cần */}
      <RoomModal 
        open={isModalOpen} 
        id={editingId} 
        onCancel={() => setIsModalOpen(false)} 
        onSave={handleSave} 
      />
    </div>
  );
};

export default QuanLyRoomPage;