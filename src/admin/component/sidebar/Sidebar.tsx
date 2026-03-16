import React from 'react';
import { 
  FiGrid, FiHome, FiStar, 
  FiCreditCard, FiBarChart2, FiSettings
} from 'react-icons/fi';
import { NavLink } from "react-router-dom";
import logo from '../../../assets/logo.png';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <FiGrid />, label: 'Dashboard', path: '/admin' },
    { icon: <FiHome />, label: 'Quản lý phòng', path: '/admin/qlroom' },
    { icon: <FiStar />, label: 'Quản lý đánh giá', path: '/admin/reviews' },
    { icon: <FiCreditCard />, label: 'Quản lý thanh toán', path: '/admin/payments' },
    { icon: <FiBarChart2 />, label: 'Thống kê', path: '' },
    { icon: <FiSettings />, label: 'Cài đặt', path: '' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="px-10 pt-8 pb-8 flex flex-col items-center">
        <img 
          src={logo} 
          alt="VietStay Logo" 
          className="w-52 h-auto object-contain mb-2 drop-shadow-md"
        />
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center border-t border-gray-50 pt-2 w-full">
          Hệ thống quản trị
        </p>
      </div>

   <nav className="flex-1 px-4 space-y-1">
  {menuItems.map((item, index) => (
    item.path ? (
      <NavLink
        key={index}
        to={item.path}
        end={item.path === '/admin'}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive
              ? "bg-emerald-600 text-white shadow-md font-semibold"
              : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
          }`
        }
      >
        <span className="text-lg">{item.icon}</span>
        <span className="text-sm">{item.label}</span>
      </NavLink>
    ) : (
      <div
        key={index}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 cursor-not-allowed"
      >
        <span className="text-lg">{item.icon}</span>
        <span className="text-sm">{item.label}</span>
      </div>
    )
  ))}
</nav>

      
    </aside>
  );
};

export default Sidebar;