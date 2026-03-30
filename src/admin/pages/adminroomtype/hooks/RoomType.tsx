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

  const updateRoomType = async (id: number, formData: FormData) => {
    const tid = toast.loading("Đang cập nhật...");
    try {
      await roomTypeService.update(id, formData);
      await fetchRoomTypes();
      toast.success("Cập nhật thành công!", { id: tid });
    } catch (error: any) {
      toast.error(error.message, { id: tid });
      throw error;
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