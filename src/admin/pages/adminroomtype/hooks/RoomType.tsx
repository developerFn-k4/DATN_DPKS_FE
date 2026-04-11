import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { roomTypeService, type RoomType } from '../../../services/adminRoomTypeService';

export const useRoomType = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);

  // Tải danh sách loại phòng từ API
  const fetchRoomTypes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roomTypeService.getAll();
      setRoomTypes(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Không thể tải danh sách loại phòng';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  // Thêm loại phòng mới
  const createRoomType = async (formData: FormData): Promise<boolean> => {
    const tid = toast.loading('Đang thêm...');
    try {
      await roomTypeService.create(formData);
      await fetchRoomTypes();
      toast.success('Thêm loại phòng thành công!', { id: tid });
      return true;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Thêm thất bại';
      toast.error(msg, { id: tid });
      return false;
    }
  };

  // Cập nhật loại phòng
  const updateRoomType = async (id: number | string, formData: FormData): Promise<boolean> => {
    const tid = toast.loading('Đang cập nhật...');
    try {
      await roomTypeService.update(id, formData);
      await fetchRoomTypes();
      toast.success('Cập nhật thành công!', { id: tid });
      return true;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Cập nhật thất bại';
      toast.error(msg, { id: tid });
      return false;
    }
  };

  // Xóa loại phòng (soft delete) - có xác nhận
  const deleteRoomType = async (id: number | string): Promise<boolean> => {
    if (!window.confirm('Bạn có chắc muốn xóa loại phòng này?')) return false;
    const tid = toast.loading('Đang xóa...');
    try {
      await roomTypeService.delete(id);
      await fetchRoomTypes();
      toast.success('Xóa thành công!', { id: tid });
      return true;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Xóa thất bại';
      toast.error(msg, { id: tid });
      return false;
    }
  };

  // Khôi phục loại phòng đã xóa
  const restoreRoomType = async (id: number | string): Promise<boolean> => {
    const tid = toast.loading('Đang khôi phục...');
    try {
      await roomTypeService.restore(id);
      await fetchRoomTypes();
      toast.success('Khôi phục thành công!', { id: tid });
      return true;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Khôi phục thất bại';
      toast.error(msg, { id: tid });
      return false;
    }
  };

  return {
    roomTypes,
    loading,
    fetchRoomTypes,
    createRoomType,
    updateRoomType,
    deleteRoomType,
    restoreRoomType,
  };
};
