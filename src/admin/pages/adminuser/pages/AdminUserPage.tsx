import React from "react";
import AdminUserTable from "../components/AdminUserTable";
import { useAdminUsers } from "../hooks/AdminUserHook";

const AdminUserPage: React.FC = () => {
  const { users, handleToggleStatus } = useAdminUsers();

  return (
    <div className="p-6">
      <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between mb-4 rounded-t-2xl shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">Quản Lý Người Dùng</h2>
      </div>

      <AdminUserTable 
        users={users} 
        onToggle={handleToggleStatus} 
      />
    </div>
  );
};

export default AdminUserPage;