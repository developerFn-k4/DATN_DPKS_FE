import React from 'react';
import { 
  FiGrid, FiHome, FiCalendar, FiUsers, 
  FiCreditCard, FiBarChart2, FiSettings 
} from 'react-icons/fi';
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <FiGrid />, label: 'Bảng điều khiển', path: ''},
    { icon: <FiHome />, label: 'Quản lý phòng', path: '' },
    { icon: <FiCalendar />, label: 'Quản lý đặt phòng', path: '' },
    { icon: <FiUsers />, label: 'Khách hàng', path: '' },
    { icon: <FiCreditCard />, label: 'Thanh toán', path: '' },
    { icon: <FiBarChart2 />, label: 'Báo cáo', path: '' },
    { icon: <FiSettings />, label: 'Cài đặt', path: '' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <h1 className="text-base font-black text-emerald-600 tracking-tight"  style={{ textShadow: "0 3px 8px rgba(16,185,129,0.5)" }}>VietStay</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Hệ thống quản trị</p>
      </div>

   <nav className="flex-1 px-4 space-y-1">
  {menuItems.map((item, index) => (
    <NavLink
      key={index}
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
          isActive
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 font-bold"
            : "text-gray-500 hover:bg-gray-50"
        }`
      }
    >
      <span className="text-lg">{item.icon}</span>
      <span className="text-sm">{item.label}</span>
    </NavLink>
  ))}
</nav>

      <div className="p-4 m-4 bg-emerald-600 rounded-2xl text-white">
        <p className="text-xs font-bold">Cần hỗ trợ?</p>
        <p className="text-[10px] opacity-80 mt-1">Liên hệ đội ngũ CSKH</p>
        <button className="w-full mt-1 py-1 bg-white text-emerald-600 text-xs font-black rounded-lg">
          Gửi hỗ trợ
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;