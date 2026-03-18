import React from "react";
import AdminUserComponent from "../components/AdminUserComponent";
import { useAdminUser } from "../hooks/AdminUserHook";

const AdminUserPage: React.FC = () => {
  const { users, loading, toggleStatus } = useAdminUser();

  return (
    <div>
      <h1 className="text-2xl font-bold p-4">Quản lý khách hàng</h1>
      <AdminUserComponent users={users} loading={loading} onToggle={toggleStatus} />
    </div>
  );
};

export default AdminUserPage;