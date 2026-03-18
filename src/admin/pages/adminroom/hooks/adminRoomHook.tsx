import { useState, useEffect, useCallback } from "react";
import { roomService, type Room } from "../../../services/roomService";
import toast from "react-hot-toast";

export const useRoom = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roomService.getAll();

      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        setRooms([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const createRoom = async (formData: FormData) => {
    const toastId = toast.loading("Đang tạo phòng...");

    try {
      await roomService.create(formData);
      await fetchRooms();
      toast.success("Thêm phòng thành công!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Thêm phòng thất bại!", { id: toastId });
      throw error;
    }
  };

  const updateRoom = async (id: number, formData: FormData) => {
    const toastId = toast.loading("Đang cập nhật...");

    try {
      await roomService.update(id, formData);
      await fetchRooms();
      toast.success("Cập nhật thành công!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thất bại!", { id: toastId });
      throw error;
    }
  };

  const deleteRoom = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa phòng này?")) return;

    const toastId = toast.loading("Đang xóa...");

    try {
      await roomService.delete(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      toast.success("Xóa thành công!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Xóa thất bại!", { id: toastId });
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
// hoàn thành