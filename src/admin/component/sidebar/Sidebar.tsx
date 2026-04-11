import React from 'react';
import {
  FiGrid, FiHome, FiCalendar, FiUsers,
  FiCreditCard, FiBarChart2, FiSettings,
  FiFileText, FiPackage, FiStar, FiLayers,
} from 'react-icons/fi';
import { NavLink } from "react-router-dom";
import logo from '../../../assets/logo.png';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <FiGrid />, label: 'Dashboard', path: '/admin'},
    { icon: <FiLayers />, label: 'Quản lý loại phòng', path: '/admin/roomtype' },
    { icon: <FiHome />, label: 'Quản lý phòng', path: '/admin/qlroom' },
    { icon: <FiCalendar />, label: 'Quản lý đặt phòng', path: '/admin/bookings' },
    { icon: <FiFileText />, label: 'Quản lý Đơn đặt phòng', path: '/admin/orders' },
    { icon: <FiCreditCard />, label: 'Quản lý thanh toán', path: '/admin/payments' },
    { icon: <FiStar />, label: 'Quản lý đánh giá', path: '/admin/reviews' },  
    { icon: <FiUsers />, label: 'Quản lý Người dùng', path: '/admin/qluser' },
    { icon: <FiBarChart2 />, label: 'Thống kê', path: '/admin/thong-ke' },
    { icon: <FiHome />,    label: 'Quản lý tài sản',  path: '/admin/tai-san' },
    { icon: <FiPackage />, label: 'Quản lý dịch vụ',  path: '/admin/dich-vu' },
    { icon: <FiSettings />, label: 'Cài đặt', path: '' },
  ];

  return (
    <aside className="sticky top-0 flex flex-col h-screen bg-white border-r border-gray-100 w-5xl">
      <div className="flex flex-col items-center px-10 pt-8 pb-8">
        <img 
          src={logo} 
          alt="VietStay Logo" 
          className="object-contain h-auto mb-2 w-52"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
        />
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center border-t border-gray-50 pt-2 w-full">
          Hệ thống quản trị
        </p>
      </div>

   <nav className="flex-1 px-4 space-y-1">
  {menuItems.map((item, index) => (
    <NavLink
      key={index}
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
          isActive
            ? " text-white shadow-lg shadow-emerald-100 font-bold"
            : "text-gray-500 hover:bg-gray-50"
        }`
      }
    >
      <span className="text-lg">{item.icon}</span>
      <span className="text-sm">{item.label}</span>
    </NavLink>
  ))}
</nav>

      
    </aside>
  );
};

export default Sidebar;