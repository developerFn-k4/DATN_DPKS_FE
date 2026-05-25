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
  const { profile, updateProfile, updateAvatar, changePassword } = useProfile();
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
    { key: "2", icon: <BookOutlined />, label: <Link to="/my-bookings">Lịch sử đơn hàng</Link> },
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
        <div className="flex items-center justify-between w-full px-6 py-5 mx-auto md:px-12">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img src={logoHome} className="object-contain w-40 h-auto" alt="Logo" />
          </Link>

          <nav className="items-center hidden gap-10 text-[15px] font-medium text-white/90 md:flex">
            <Link to="/" className="transition-colors hover:text-yellow-400">Trang Chủ</Link>
            <Link to="/rooms" className="transition-colors hover:text-yellow-400">Loại Phòng</Link>
            <Link className="transition-colors hover:text-yellow-400" to="/deals">Ưu Đãi</Link>
            <Link className="transition-colors hover:text-yellow-400" to="/lienhe">Liên Hệ</Link>
          </nav>

          <div className="flex items-center gap-4 shrink-0">
{profile ? (
              <Dropdown menu={{ items }} placement="bottomRight">
                {/* Dịch vào Nav bằng cách giảm margin hoặc để trong flex container sát Nav */}
                <div className="flex items-center gap-3 px-1 py-1 pr-4 transition-all border rounded-full shadow-lg cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/20">

                  {/* 1. CHO ẢNH TO RA: Dùng size={40} hoặc size="large" */}
                  <Avatar
                    size={42}
                    src={avatarUrl}
                    icon={!profile?.avatar && <UserOutlined />}
                    className="border-2 shadow-sm border-emerald-400/50"
                  />

                  {/* 2. DỊCH VÀO: Chữ và ảnh cách nhau gap-3 là vừa đẹp */}
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-white/60 uppercase tracking-widest leading-none mb-1">Thành viên</span>
                    <span className="text-sm font-bold leading-none text-black">
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
        destroyOnHidden
        styles={{
          body: { padding: 0, overflow: 'hidden', borderRadius: '32px' },
          mask: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.4)' }
        }}
      >
        {/* Wrapper cuộn trang nếu màn hình nhỏ */}
        <div className="max-h-[85vh] overflow-y-auto bg-gray-50/50 p-6 md:p-10">

          {/* --- PHẦN 1: HEADER AVATAR (Giao diện cũ của bạn) --- */}
          <div className="!bg-gray-600 text-black p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 mb-8 relative overflow-hidden">
            <div className="relative z-10 group">
              <div className="w-32 h-32 overflow-hidden border-4 rounded-full shadow-xl border-emerald-50 !bg-gray-300">
                <img
                  src={getAvatarUrl(profile?.avatar) || `https://ui-avatars.com/api/?name=${profile?.name}&background=random`}
                  className="object-cover w-full h-full"
alt="Profile"
                />
              </div>
              <label className="absolute p-2 text-black transition-all border-2 border-white rounded-full shadow-lg cursor-pointer bottom-1 right-1 bg-emerald-600 hover:bg-emerald-700">
                <CameraOutlined />
                <input type="file" className="hidden" onChange={(e) => {
                  if (e.target.files?.[0]) updateAvatar(e.target.files[0]);
                }} accept="image/*" />
              </label>
            </div>

            <div className="z-10 flex-1 text-center md:text-left">
              <h1 className="mb-1 text-2xl font-bold text-gray-900">{profile?.name}</h1>
              <p className="font-medium text-gray-500">{profile?.email}</p>
              <div className="inline-block px-3 py-1 mt-2 text-xs font-bold uppercase rounded-full bg-emerald-100 text-emerald-700">
                {profile?.role || 'Thành viên'}
              </div>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-emerald-100/50 blur-3xl -z-0 opacity-40"></div>
          </div>

          {/* --- PHẦN 2: GRID CHỨA FORM VÀ THẺ THÀNH VIÊN --- */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* CỘT TRÁI: FORM */}
            <div className="lg:col-span-2">
              {profile && (
                <ProfileForm
                  initialData={profile}
                  onSave={updateProfile}
                  onUpdateAvatar={updateAvatar}
                  onChangePassword={changePassword}
                />
              )}
            </div>

            {/* CỘT PHẢI: THẺ THÀNH VIÊN (Giao diện đen xịn của bạn) */}
            <div className="space-y-6">
              <div className="bg-slate-900 p-7 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-10">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">VietStay Member</span>
                    <UserOutlined className="text-2xl opacity-20" />
                  </div>
                  <div>
                    <span className="text-[10px] opacity-40 uppercase tracking-widest block mb-1">Chủ thẻ</span>
                    <p className="text-lg font-semibold tracking-wide uppercase">{profile?.name}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] opacity-40 uppercase tracking-widest block mb-1">Số điện thoại</span>
                      <p className="font-mono text-emerald-400">{profile?.phone || '---- --- ---'}</p>
                    </div>
                    <p className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">CLASSIC</p>
                  </div>
                </div>
<div className="absolute w-40 h-40 rounded-full -bottom-10 -right-10 bg-emerald-500/10 blur-3xl"></div>
              </div>

              <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm">
                <h4 className="mb-2 font-bold text-gray-800">Hỗ trợ nhanh</h4>
                <p className="text-xs leading-relaxed text-gray-500">
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