import React, { useState } from "react";
import { Avatar, Button, Descriptions, Dropdown, Modal, type MenuProps } from "antd";
import { Link } from "react-router-dom";
import { useAuth, useMe } from "../../hooks/auth/useRegister";
import ProfileModal from "./ProfileModal";
import logoHome from "../../assets/logo.png";

export function HomeHeader() {
  const { user, isLogin, logout } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);
  const { user: profile, fetchMe } = useMe();
  const openUserProfile = async () => {
    await fetchMe();
    setOpenProfile(true);
  };
  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "Thông tin tài khoản",
      onClick: openUserProfile,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: logout,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center" role="button">
            <img
              src={logoHome}
              alt="VietStay"
              className="h-[60px] w-[100px] "
            />
          </div>
        </div>

        <nav className="hidden items-center gap-5 text-sm text-slate-600 md:flex">
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

        <div className="flex items-center gap-2">
          {isLogin ? (
            <Dropdown menu={{ items }} placement="bottomRight">
              <div className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-1 hover:bg-slate-100">
                <Avatar size={32}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <span className="hidden text-sm font-medium md:block">
                  {user?.name}
                </span>
              </div>
            </Dropdown>
          ) : (
            <>
              <Link to="/auth">
                <Button type="default" className="hidden md:inline-flex">
                  Đăng nhập
                </Button>
              </Link>

              <Link to="/auth">
                <Button
                  type="primary"
                  className="!bg-emerald-600 hover:!bg-emerald-700"
                >
                  Đăng ký
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <ProfileModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        profile={profile}
      />
    </header>
  );
}
