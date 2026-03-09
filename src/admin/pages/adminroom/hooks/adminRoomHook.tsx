import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { roomService } from '../../../services/roomService';

export const useAdminRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roomService.getRooms();
      // Giả sử data trả về nằm trong res.data.content hoặc res.data
      setRooms(res.data?.content || res.data);
    } catch (error) {
      message.error("Không thể tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await roomService.deleteRoom(id);
      message.success("Xóa phòng thành công");
      fetchRooms(); // Load lại danh sách
    } catch (error) {
      message.error("Xóa phòng thất bại");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, refresh: fetchRooms, handleDelete };
};