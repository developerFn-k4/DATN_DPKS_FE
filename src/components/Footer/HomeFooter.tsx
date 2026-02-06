import React from "react";
import { Button, Divider, Input } from "antd";

export function HomeFooter() {
    return (
        <footer id="footer" className="border-t border-slate-200/70 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid gap-6 md:grid-cols-3 items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-lime-400" />
                            <div>
                                <div className="text-sm font-semibold">VietStay</div>
                                <div className="text-xs text-slate-500">Fresh spring booking experience</div>
                            </div>
                        </div>
                        
                    </div>

                    <div className="text-sm text-slate-600">
                        <div className="font-semibold text-slate-900">Liên kết</div>
                        <div className="mt-3 space-y-2">
                            <a className="block hover:text-slate-900" href="#deals">Ưu đãi</a>
                            <a className="block hover:text-slate-900" href="#popular">Gợi ý khách sạn</a>
                            <a className="block hover:text-slate-900" href="#why">Vì sao chọn</a>
                        </div>
                    </div>

                    <div className="text-sm text-slate-600">
                        <div className="font-semibold text-slate-900">Nhận tin ưu đãi</div>
                        <div className="mt-3 flex gap-2">
                            <Input placeholder="Email của bạn" />
                            <Button type="primary" className="!bg-emerald-600 hover:!bg-emerald-700">
                                Gửi
                            </Button>
                        </div>
                        <div className="mt-2 text-xs text-slate-500">Không spam. Huỷ bất cứ lúc nào.</div>
                    </div>
                </div>

                <Divider className="my-8" />

                <div className="flex flex-col items-start justify-between gap-3 text-xs text-slate-500 md:flex-row md:items-center">
                    <div>© {new Date().getFullYear()} VietStay. All rights reserved.</div>
                    <div className="flex gap-3">
                        <a className="hover:text-slate-700" href="#">Privacy</a>
                        <a className="hover:text-slate-700" href="#">Terms</a>
                        <a className="hover:text-slate-700" href="#">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
