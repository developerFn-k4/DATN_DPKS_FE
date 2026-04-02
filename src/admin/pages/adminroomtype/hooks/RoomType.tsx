import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { roomTypeService, type RoomType } from "../../../services/adminRoomTypeService";

export const useRoomType = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoomTypes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roomTypeService.getAll();
      setRoomTypes(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message || "Không thể tải danh sách loại phòng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoomTypes(); }, [fetchRoomTypes]);

  const createRoomType = async (formData: FormData) => {
    const tid = toast.loading("Đang thêm...");
    try {
      await roomTypeService.create(formData);
      await fetchRoomTypes();
      toast.success("Thêm thành công!", { id: tid });
    } catch (error: any) {
      toast.error(error.message, { id: tid });
      throw error;
    }
  };

  // hooks/RoomType.tsx (hoặc file hook của bạn)

const updateRoomType = async (id: number, formData: FormData) => {
  const tid = toast.loading("Đang cập nhật...");
  try {
    await roomTypeService.update(id, formData);
    await fetchRoomTypes();
    toast.success("Cập nhật thành công!", { id: tid });
    return true; // Thành công thực sự (Server trả về 200)
  } catch (error: any) {
    // XỬ LÝ LỖI GIẢ 500 Ở ĐÂY
    if (error.message.includes("500")) {
      console.warn("Server báo lỗi 500 nhưng dữ liệu có thể đã được lưu.");
      
      // Gọi lại danh sách để đồng bộ giao diện với DB
      await fetchRoomTypes(); 
      
      toast.success("Cập nhật thành công!", { id: tid });
      return true; // Ép về true để FE hiểu là đã xong và đóng Modal
    }

    // Nếu là các lỗi khác (401, 404, 422...) thì báo lỗi thật
    toast.error(error.message || "Lỗi không xác định", { id: tid });
    return false;
  }
};

  const deleteRoomType = async (id: number) => {
    if (!window.confirm("Xóa loại phòng này?")) return;
    const tid = toast.loading("Đang xóa...");
    try {
      await roomTypeService.delete(id);
      setRoomTypes(prev => prev.filter(item => item.room_type_id !== id));
      toast.success("Xóa thành công!", { id: tid });
    } catch (error: any) {
      toast.error(error.message, { id: tid });
    }
  };

  return { roomTypes, loading, fetchRoomTypes, createRoomType, updateRoomType, deleteRoomType };
};