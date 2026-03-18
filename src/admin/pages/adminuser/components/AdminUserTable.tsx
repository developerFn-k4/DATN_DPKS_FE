import { DeleteOutlined, EditOutlined, SyncOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";
import React from "react";

interface Props {
  users: any[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (user: any) => void;
}

const AdminUserTable: React.FC<Props> = ({
  users,
  onDelete,
  onToggle,
  onEdit,
}) => {
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
              <th className="px-4 py-3 text-left text-sm font-semibold">Hành Động</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3 text-sm align-middle">
                  {user.id}
                </td>

                <td className="px-4 py-3 text-sm font-medium align-middle">
                  {user.name}
                </td>

                <td className="px-4 py-3 text-sm align-middle">
                  {user.email}
                </td>

                <td className="px-4 py-3 text-sm align-middle">
                  {user.role}
                </td>

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

                <td className="px-4 py-3 text-sm align-middle">
                  <div className="flex gap-2">
                    <Tooltip title="Đổi trạng thái">
                      <button
                        onClick={() => onToggle(user.id)}
                        className="p-2 rounded-xl !bg-blue-500 text-white hover:bg-blue-600 transition flex items-center justify-center"
                      >
                        <SyncOutlined />
                      </button>
                    </Tooltip>

                    <Tooltip title="Chỉnh sửa">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 rounded-xl !bg-yellow-500 text-white hover:bg-yellow-600 transition flex items-center justify-center"
                      >
                        <EditOutlined />
                      </button>
                    </Tooltip>

                    <Tooltip title="Xóa">
                      <button
                        onClick={() => onDelete(user.id)}
                        className="p-2 rounded-xl !bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center"
                      >
                        <DeleteOutlined />
                      </button>
                    </Tooltip>
                  </div>
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