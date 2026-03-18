import { useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  toggleUserStatus,
  createUser,
  updateUser,
} from "../../../services/adminUserService";
import { toast } from "react-toastify";

export const useAdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data?.data || data || []);
    } catch (error) {
      console.error("Lấy danh sách thất bại:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any): Promise<boolean> => {
  try {
    const res = await createUser(data);
    if (res) {
      await fetchUsers();
      toast.success("Tạo người dùng thành công!");
      return true;
    }
    toast.error("Không thể tạo người dùng!");
    return false;
  } catch (error) {
    toast.error("Đã có lỗi xảy ra khi tạo người dùng!");
    return false;
  }
};

const handleUpdate = async (id: number, data: any): Promise<boolean> => {
  try {
    const res = await updateUser(id, data);
    if (res) {
      await fetchUsers();
      toast.success("Cập nhật người dùng thành công!");
      return true;
    }
    toast.error("Không thể cập nhật người dùng!");
    return false;
  } catch (error) {
    toast.error("Đã có lỗi xảy ra khi cập nhật!");
    return false;
  }
};

const handleDelete = async (id: number) => {
  if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
  try {
    await deleteUser(id);
    await fetchUsers();
    toast.success("Xóa người dùng thành công!");
  } catch (error) {
    toast.error("Xóa thất bại!");
  }
};

const handleToggleStatus = async (id: number) => {
  try {
    await toggleUserStatus(id);
    await fetchUsers();
    toast.success("Đổi trạng thái thành công!");
  } catch (error) {
    toast.error("Đổi trạng thái thất bại!");
  }
};
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    handleDelete,
    handleToggleStatus,
    fetchUsers,
    handleCreate,
    handleUpdate,
  };
};