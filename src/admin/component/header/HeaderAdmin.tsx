import React from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiChevronDown, FiLogOut, FiHome } from "react-icons/fi";

const HeaderAdmin = () => {

  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user") || "null") || {
      name: "Quản trị viên",
      role: "Administrator",
    };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
    window.location.reload();
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      icon: <FiHome />,
      label: (
        <span onClick={() => navigate("/")}>
          Về trang chủ
        </span>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      icon: <FiLogOut />,
      label: (
        <span onClick={logout}>
          Đăng xuất
        </span>
      ),
    },
  ];

  return (
    <header className="h-20 w-5xl bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">

      <div className="relative w-1/3 group">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-emerald-600 transition-colors">
          <FiSearch size={18} />
        </span>

        <input
          type="text"
          className="block w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
          placeholder="Tìm kiếm đặt phòng, mã giao dịch, khách hàng..."
        />
      </div>

      <div className="flex items-center space-x-6">

        <div className="hidden lg:block border-r pr-6 border-gray-100">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Hệ thống
          </span>
          <p className="text-sm font-black">VIETSTAY</p>
        </div>

        <button className="relative p-2.5 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
          <FiBell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <Dropdown menu={{ items }} placement="bottomRight">

          <div className="flex items-center gap-3 pl-2 cursor-pointer group">

            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                {user.name}
              </p>

              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-tighter">
                {user.role}
              </p>
            </div>

            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200 ring-2 ring-white overflow-hidden">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`
                  }
                  alt="avatar"
                />
              </div>

              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <FiChevronDown className="text-gray-400 group-hover:text-emerald-600 transition-transform group-hover:translate-y-0.5" />

          </div>

        </Dropdown>

      </div>
    </header>
  );
};

export default HeaderAdmin;