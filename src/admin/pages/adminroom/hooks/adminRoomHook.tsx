import { useState, useEffect, useCallback } from "react";
import { roomService, type Room } from "../../../services/roomService";
import toast from "react-hot-toast";

export const useRoom = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]); // Danh sách để hiển thị tên loại phòng
  const [loading, setLoading] = useState(false);

  // Hàm tải dữ liệu tổng hợp
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Chạy song song 2 API để tối ưu tốc độ
      const [roomsRes, typesRes] = await Promise.all([
        roomService.getAll(),
        roomService.getRoomTypes() // Giả sử service của bạn đã có hàm này
      ]);

      // Xử lý dữ liệu phòng (Tương thích với cấu trúc bọc data hoặc mảng thuần)
      const roomsData = roomsRes?.data ?? roomsRes ?? [];
      setRooms(Array.isArray(roomsData) ? roomsData : []);

      // Xử lý dữ liệu loại phòng
      const typesData = typesRes?.data ?? typesRes ?? [];
      setRoomTypes(Array.isArray(typesData) ? typesData : []);

    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error(error.message || "Không thể tải dữ liệu hệ thống");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Tạo phòng mới
  const createRoom = async (formData: FormData) => {
    const toastId = toast.loading("Đang tạo phòng...");
    try {
      await roomService.create(formData);
      await fetchData(); // Refresh lại toàn bộ để đảm bảo dữ liệu mới nhất
      toast.success("Thêm phòng thành công!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Thêm phòng thất bại!", { id: toastId });
      throw error;
    }
  };

  // Cập nhật phòng
  const updateRoom = async (id: number, formData: FormData) => {
    const toastId = toast.loading("Đang cập nhật...");
    try {
      await roomService.update(id, formData);
      await fetchData(); // Refresh dữ liệu
      toast.success("Cập nhật thành công!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thất bại!", { id: toastId });
      throw error;
    }
  };

  // Xóa phòng
  const deleteRoom = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa phòng này?")) return;
    const toastId = toast.loading("Đang xóa...");
    try {
      await roomService.delete(id);
      // Xóa trực tiếp trên State để giao diện phản hồi ngay lập tức (Optimistic UI)
      setRooms((prev) => prev.filter((r) => r.id !== id));
      toast.success("Xóa thành công!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Xóa thất bại!", { id: toastId });
    }
  };

  return {
    rooms,
    roomTypes, // Trả về để Modal sử dụng
    loading,
    fetchRooms: fetchData, // Đổi tên hàm cho đúng mục đích
    createRoom,
    updateRoom,
    deleteRoom,
  };
};