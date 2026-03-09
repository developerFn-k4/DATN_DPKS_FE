import { Button, Input } from "antd";

import logoHome from "../../assets/logo.png";

export function HomeFooter() {
    return (
        <footer id="footer" className="border-t border-slate-200/70 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex h-18 w-18 items-center justify-center" role="button">
                            <img
                                src={logoHome}
                                alt="VietStay"
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </div>

                    <div>© {new Date().getFullYear()} VietStay. All rights reserved.</div>

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

            </div>
        </footer>
    );
}
