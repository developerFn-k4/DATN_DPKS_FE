import React from "react";
import { Button } from "antd";

export function HomeHeader() {
    return (
        <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-lime-400 shadow-sm" />
                    <div className="leading-tight">
                        <div className="text-sm font-semibold">VietStay</div>
                        <div className="text-xs text-slate-500">Hotel booking • Fresh vibes</div>
                    </div>
                </div>

                <nav className="hidden items-center gap-5 text-sm text-slate-600 md:flex">
                    <a className="hover:text-slate-900" href="#deals">Ưu đãi</a>
                    <a className="hover:text-slate-900" href="#popular">Phổ biến</a>
                    <a className="hover:text-slate-900" href="#why">Vì sao chọn</a>
                    <a className="hover:text-slate-900" href="#footer">Liên hệ</a>
                </nav>

                <div className="flex items-center gap-2">
                    <Button type="default" className="hidden md:inline-flex">
                        Đăng nhập
                    </Button>
                    <Button type="primary" className="!bg-emerald-600 hover:!bg-emerald-700">
                        Đăng ký
                    </Button>
                </div>
            </div>
        </header>
    );
}
