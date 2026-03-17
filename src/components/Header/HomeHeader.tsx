
import { Avatar, Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  BookOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
// import ProfileModal from "./ProfileModal";
export function HomeHeader() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      icon: <ProfileOutlined />,
      label: <Link to="#">Thông tin cá nhân</Link>,
    },
    {
      key: "2",
      icon: <BookOutlined />,
      label: <Link to="#">Đơn đặt phòng</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      icon: <LogoutOutlined />,
      label: <span onClick={logout}>Đăng xuất</span>,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex items-center justify-between max-w-6xl px-4 py-3 mx-auto">

        <Link to="/" className="flex items-center gap-3">
          
          <div className="flex flex-col items-center">
    <img 
      src={logo} 
      alt="VietStay Logo" 
      className="object-contain h-auto w-35"
      style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
    />
    <div className="text-xs text-emerald-700 mt-[-25px]">Hotel booking</div>
  </div>
        </Link>
        <nav className="items-center hidden gap-5 text-sm text-slate-600 md:flex">
          <Link to="/" className="hover:text-slate-900">
            Trang chủ
          </Link>
          <Link to="/rooms" className="hover:text-slate-900">
            Danh sách phòng
          </Link>
          <a className="hover:text-slate-900" href="#deals">
            Ưu đãi
          </a>
          <a className="hover:text-slate-900" href="#popular">
            Phổ biến
          </a>
          <a className="hover:text-slate-900" href="#footer">
            Liên hệ
          </a>
        </nav>

        <div className="flex items-center gap-3">

          {user ? (
            <Dropdown menu={{ items }} placement="bottomRight">

              <div className="flex items-center gap-2 cursor-pointer">

                <span className="text-sm">
                  Chào, {user.name || "User"}
                </span>

                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#10b981" }}
                />

              </div>

            </Dropdown>
          ) : (
            <>
              <Link to="/auth">
                <Button className="hidden border-none shadow-none md:inline-flex hover:text-emerald-600">Đăng nhập</Button>
              </Link>

              <Link to="/auth">
                <Button type="primary" className="!bg-emerald-600 hover:!bg-emerald-700">Đăng ký</Button>
              </Link>
            </>
          )}

        </div>
      </div>

      {/* <ProfileModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        profile={profile}
      /> */}
    </header>
  );
}