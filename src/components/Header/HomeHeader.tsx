import { Avatar, Button, Dropdown, Modal } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, LogoutOutlined, ProfileOutlined, BookOutlined, CameraOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import logoHome from "../../assets/logo.png";
import { useProfile } from "../../pages/auth/pages/user/hooks/UserHook";
import { ProfileForm } from "../../pages/auth/pages/user/components/UserComponnet";
import { useState } from "react";

export function HomeHeader() {
  const navigate = useNavigate();
  // Đồng nhất tên biến là 'profile' để tránh lỗi "đỏ"
  const { profile, updateProfile, updateAvatar } = useProfile();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const avatarUrl = profile?.avatar 
      ? (profile.avatar.startsWith('http') 
          ? profile.avatar 
          : `https://vietstay.ngrok.dev/storage/${profile.avatar}`)
      : null;
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
      // Thay đổi từ Link sang thẻ span để kích hoạt Modal tại chỗ
      label: <span onClick={() => setIsProfileOpen(true)} className="cursor-pointer">Thông tin cá nhân</span> 
    },
    { key: "2", icon: <BookOutlined />, label: <Link to="#">Đơn đặt phòng</Link> },
    { type: "divider" },
    { key: "3", icon: <LogoutOutlined />, label: <span onClick={logout} className="cursor-pointer">Đăng xuất</span> },
  ];

  const getAvatarUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) return null;
    const baseUrl = avatarPath.startsWith('http')
      ? avatarPath
      : `https://vietstay.ngrok.dev/storage/${avatarPath}`;

    // Thêm v=Date.now() để trình duyệt luôn lấy ảnh mới nhất nếu vừa đổi
    return `${baseUrl}?t=${new Date().getTime()}`;
  };
  return (
    <>
      <header className="relative top-0 left-0 z-50 w-full transition-all duration-300 bg-transparent">
        <div className="flex items-center justify-between w-full px-6 md:px-12 py-5 mx-auto">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img src={logoHome} className="h-auto w-40 object-contain" alt="Logo" />
          </Link>

          <nav className="items-center hidden gap-10 text-[15px] font-medium text-white/90 md:flex">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Trang Chủ</Link>
            <Link to="/rooms" className="hover:text-yellow-400 transition-colors">Loại Phòng</Link>
            <Link className="hover:text-yellow-400 transition-colors" to="/deals">Ưu Đãi</Link>
            <Link className="hover:text-yellow-400 transition-colors" to="/lienhe">Liên Hệ</Link>
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            {profile ? (
              <Dropdown menu={{ items }} placement="bottomRight">
                {/* Dịch vào Nav bằng cách giảm margin hoặc để trong flex container sát Nav */}
                <div className="flex items-center gap-3 cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md py-1 px-1 pr-4 rounded-full transition-all border border-white/20 shadow-lg">

                  {/* 1. CHO ẢNH TO RA: Dùng size={40} hoặc size="large" */}
                  <Avatar
                    size={42}
                    src={avatarUrl}
                    icon={!profile?.avatar && <UserOutlined />}
                    className="border-2 border-emerald-400/50 shadow-sm"
                  />

                  {/* 2. DỊCH VÀO: Chữ và ảnh cách nhau gap-3 là vừa đẹp */}
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-white/60 uppercase tracking-widest leading-none mb-1">Thành viên</span>
                    <span className="text-sm text-white font-bold leading-none">
                      {profile.name || "User"}
                    </span>
                  </div>
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
      
      <Modal
        open={isProfileOpen}
        onCancel={() => setIsProfileOpen(false)}
        footer={null}
        width={1100} // Tăng độ rộng để chứa cả 2 cột
        centered
        destroyOnClose
        bodyStyle={{ padding: 0, overflow: 'hidden', borderRadius: '32px' }}
        maskStyle={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        {/* Wrapper cuộn trang nếu màn hình nhỏ */}
        <div className="max-h-[85vh] overflow-y-auto bg-gray-50/50 p-6 md:p-10">

        <nav className="items-center hidden gap-10 text-[15px] font-medium text-white/90 md:flex">
          <Link to="/" className="hover:text-yellow-400 transition-colors">Trang Chủ</Link>
          <Link to="/rooms" className="hover:text-yellow-400 transition-colors">Loại Phòng</Link>
          <Link className="hover:text-yellow-400 transition-colors" to="/deals">Ưu Đãi</Link>
          <Link className="hover:text-yellow-400 transition-colors" to="/about">Thông Tin</Link>
          <Link className="hover:text-yellow-400 transition-colors" to="/contact">Liên Hệ</Link>
        </nav>

            <div className="flex-1 text-center md:text-left z-10">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile?.name}</h1>
              <p className="text-gray-500 font-medium">{profile?.email}</p>
              <div className="mt-2 inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">
                {profile?.role || 'Thành viên'}
              </div>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -z-0 opacity-40"></div>
          </div>

          {/* --- PHẦN 2: GRID CHỨA FORM VÀ THẺ THÀNH VIÊN --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CỘT TRÁI: FORM */}
            <div className="lg:col-span-2">
              {profile && (
                <ProfileForm
                  initialData={profile}
                  onSave={updateProfile}
                  onUpdateAvatar={updateAvatar}
                />
              )}
            </div>

            {/* CỘT PHẢI: THẺ THÀNH VIÊN (Giao diện đen xịn của bạn) */}
            <div className="space-y-6">
              <div className="bg-slate-900 p-7 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-10">
                  <div className="flex justify-between items-start">
                    <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase">VietStay Member</span>
                    <UserOutlined className="text-2xl opacity-20" />
                  </div>
                  <div>
                    <span className="text-[10px] opacity-40 uppercase tracking-widest block mb-1">Chủ thẻ</span>
                    <p className="text-lg font-semibold tracking-wide uppercase">{profile?.name}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] opacity-40 uppercase tracking-widest block mb-1">Số điện thoại</span>
                      <p className="font-mono text-emerald-400">{profile?.phone || '---- --- ---'}</p>
                    </div>
                    <p className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">CLASSIC</p>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
              </div>

              <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm">
                <h4 className="font-bold text-gray-800 mb-2">Hỗ trợ nhanh</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Mọi thay đổi về thông tin bảo mật vui lòng xác nhận qua Email đã đăng ký.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}