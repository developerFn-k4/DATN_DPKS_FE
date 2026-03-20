import { SyncOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";
import React from "react";

interface Props {
  users: any[];
  onToggle: (id: number) => void;
}

const AdminUserTable: React.FC<Props> = ({ users, onToggle }) => {
  return (
    <div className="overflow-x-auto w-full">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Tên</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Đổi Trạng Thái</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3 text-sm align-middle">{user.id}</td>
                <td className="px-4 py-3 text-sm font-medium align-middle">{user.name}</td>
                <td className="px-4 py-3 text-sm align-middle">{user.email}</td>
                <td className="px-4 py-3 text-sm align-middle">{user.role}</td>
                <td className="px-4 py-3 text-sm align-middle">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-sm align-middle text-center">
                  <Tooltip title="Nhấp để đổi trạng thái">
                    <button
                      onClick={() => onToggle(user.id)}
                      className="p-2 rounded-xl !bg-blue-500 text-white hover:bg-blue-600 transition inline-flex items-center justify-center mx-auto"
                    >
                      <SyncOutlined />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserTable;