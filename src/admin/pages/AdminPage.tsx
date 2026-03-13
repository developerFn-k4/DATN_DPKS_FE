import React from "react";
import Sidebar from "../component/sidebar/Sidebar";
import HeaderAdmin from "../component/header/HeaderAdmin";
import { Outlet } from "react-router-dom";

const AdminPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <HeaderAdmin />

        <div className="flex-1 p-6">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default AdminPage;