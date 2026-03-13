import { useState, useEffect, useCallback } from "react";
import { roomService, type Room } from "../../../services/roomService";
import toast from "react-hot-toast";

export const useRoom = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roomService.getAll();
      const actualData = res?.data || res;
      
      if (Array.isArray(actualData)) {
        setRooms(actualData);
      } else {
        setRooms([]);
      }
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const createRoom = async (formData: FormData) => {
    const tId = toast.loading("Đang khởi tạo phòng...");
    try {
      await roomService.create(formData);
      await fetchRooms(); 
      toast.success("Thêm phòng thành công!", { id: tId });
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi trùng số phòng hoặc dữ liệu trống!";
      toast.error(msg, { id: tId });
      throw error;
    }
  };

  const updateRoom = async (id: number, formData: FormData) => {
    const tId = toast.loading("Đang lưu thay đổi...");
    try {
      await roomService.update(id, formData);
      await fetchRooms();
      toast.success("Cập nhật thành công!", { id: tId });
    } catch (error: any) {
      const msg = error.response?.data?.message || "Cập nhật thất bại!";
      toast.error(msg, { id: tId });
      throw error;
    }
  };

  const deleteRoom = async (id: number) => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa phòng này không?");
    if (!isConfirm) return;

    const tId = toast.loading("Đang xóa...");
    try {
      await roomService.delete(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      toast.success("Đã xóa xong", { id: tId });
    } catch (error) {
      toast.error("Lỗi khi xóa dữ liệu!", { id: tId });
    }
  };

  return {
    rooms,
    loading,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};