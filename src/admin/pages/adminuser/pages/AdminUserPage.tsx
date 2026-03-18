import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminUserTable from "../components/AdminUserTable";
import AdminUserModal from "../components/AdminUserModal";
import { useAdminUsers } from "../hooks/AdminUserHook";
import toast from "react-hot-toast";

const AdminUserPage: React.FC = () => {
  const { users, handleDelete, handleToggleStatus, handleCreate, handleUpdate } = useAdminUsers();
  const navigate = useNavigate();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const openCreateModal = () => {
    setEditingUser(null);
    setModalVisible(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;

    try {
      await handleDelete(id);
      toast.success("Xóa người dùng thành công!");
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      if (currentUser?.id === id) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/admin");
      }
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };

  return (
    <div className="p-6">
      <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Quản Lý Người Dùng</h2>
        <button
          onClick={openCreateModal}
          className="px-2 py-2 !bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          + Tạo Thêm
        </button>
      </div>

      <AdminUserTable
        users={users}
        onDelete={handleDeleteUser}
        onToggle={handleToggleStatus}
        onEdit={openEditModal}
      />

      <AdminUserModal
        visible={modalVisible}
        editingUser={editingUser}
        onClose={() => {
          setModalVisible(false);
          setEditingUser(null);
        }}
       
      />
    </div>
  );
};

export default AdminUserPage;