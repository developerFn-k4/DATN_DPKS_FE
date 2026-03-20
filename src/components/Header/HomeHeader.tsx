import { Avatar, Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, LogoutOutlined, ProfileOutlined, BookOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import logoHome from "../../assets/logo.png";

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
    { key: "1", icon: <ProfileOutlined />, label: <Link to="#">Thông tin cá nhân</Link> },
    { key: "2", icon: <BookOutlined />, label: <Link to="#">Đơn đặt phòng</Link> },
    { type: "divider" },
    { key: "3", icon: <LogoutOutlined />, label: <span onClick={logout}>Đăng xuất</span> },
  ];

  return (
    <header className="relative top-0 left-0 z-50 w-full transition-all duration-300 bg-transparent">
      <div className="flex items-center justify-between w-full px-6 md:px-12 py-5 mx-auto">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex items-center gap-2">
            <img src={logoHome} className="h-auto w-40 object-contain" />
          </div>
        </Link>

        <nav className="items-center hidden gap-10 text-[15px] font-medium text-white/90 md:flex">
          <Link to="/" className="hover:text-yellow-400 transition-colors">Trang Chủ</Link>
          <Link to="/rooms" className="hover:text-yellow-400 transition-colors">Loại Phòng</Link>
          <Link className="hover:text-yellow-400 transition-colors" to="/deals">Ưu Đãi</Link>
          <Link className="hover:text-yellow-400 transition-colors" to="/popular">Phổ Biến</Link>
          <Link className="hover:text-yellow-400 transition-colors" to="/lienhe">Liên Hệ</Link>
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <Dropdown menu={{ items }} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md py-1.5 px-4 rounded-full transition-all border border-white/20">
                <span className="text-sm text-white font-medium">Chào, {user.name || "User"}</span>
                <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: "#ef4444" }} />
              </div>
            </Dropdown>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button type="text" className="text-white hover:!text-yellow-400 font-semibold border-none shadow-none">Đăng nhập</Button>
              </Link>
              <Link to="/auth">
                <Button className="!bg-emerald-600 !text-white !border-emerald-600 hover:!bg-emerald-700 hover:!text-white backdrop-blur-md rounded-lg font-bold px-6">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}