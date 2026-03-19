import { useEffect, useState } from "react";
import { getUsers, toggleUserStatus } from "../../../services/adminUserService";
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

  const handleToggleStatus = async (id: number) => {
    try {
      const res = await toggleUserStatus(id);
      if (res) {
        await fetchUsers();
        toast.success("Đổi trạng thái thành công!");
      }
    } catch (error) {
      toast.error("Đổi trạng thái thất bại!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, handleToggleStatus, fetchUsers };
};