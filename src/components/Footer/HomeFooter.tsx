import { Button, Input } from "antd";
import {
    FacebookOutlined,
    InstagramOutlined,
    TwitterOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
} from "@ant-design/icons";

import logoHome from "../../assets/logo.png";

export function HomeFooter() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10">

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 items-start text-left">
                    <div>
                        <div className="flex items-center gap-2">
                            <img src={logoHome} className="h-10 w-10 object-contain" />
                            <span className="text-lg font-semibold">VietStay</span>
                        </div>

                        <p className="mt-3 text-sm text-slate-600">
                            Đặt phòng khách sạn thoải mái trên khắp Việt Nam với giá tốt nhất.
                        </p>

                        <div className="mt-4 flex gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 cursor-pointer hover:bg-emerald-100 hover:text-emerald-600 transition">
                                <FacebookOutlined />
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 cursor-pointer hover:bg-emerald-100 hover:text-emerald-600 transition">
                                <InstagramOutlined />
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 cursor-pointer hover:bg-emerald-100 hover:text-emerald-600 transition">
                                <TwitterOutlined />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900">Liên kết nhanh</h3>

                        <ul className="mt-3 space-y-2 text-sm text-slate-600">
                            <li className="hover:text-emerald-600 cursor-pointer">Trang chủ</li>
                            <li className="hover:text-emerald-600 cursor-pointer">Phòng</li>
                            <li className="hover:text-emerald-600 cursor-pointer">Đặt phòng</li>
                            <li className="hover:text-emerald-600 cursor-pointer">Khuyến mãi</li>
                            <li className="hover:text-emerald-600 cursor-pointer">Liên hệ</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900">Hỗ trợ khách hàng</h3>

                        <ul className="mt-3 space-y-2 text-sm text-slate-600">
                            <li className="hover:text-emerald-600 cursor-pointer">Trung tâm trợ giúp</li>
                            <li className="hover:text-emerald-600 cursor-pointer">Câu hỏi thường gặp</li>
                            <li className="hover:text-emerald-600 cursor-pointer">Điều khoản và điều kiện</li>
                            <li className="hover:text-emerald-600 cursor-pointer">Chính sách bảo mật</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900">Thông tin liên hệ</h3>

                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                            <div className="flex gap-2">
                                <EnvironmentOutlined />
                                <span>123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</span>
                            </div>

                            <div className="flex gap-2">
                                <PhoneOutlined />
                                <span>+84 123 456 7890</span>
                            </div>

                            <div className="flex gap-2">
                                <MailOutlined />
                                <span>info@vietstay.com</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="text-sm font-semibold text-slate-900">
                                Đăng ký nhận bản tin
                            </div>

                            <div className="mt-2 flex gap-2">
                                <Input placeholder="Email của bạn" />
                                <Button
                                    type="primary"
                                    className="!bg-emerald-600 hover:!bg-emerald-700"
                                >
                                    Gửi
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="my-6 border-t border-slate-200" />

                <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-500 md:flex-row">
                    <div>© {new Date().getFullYear()} VietStay. Tất cả quyền được bảo lưu.</div>
                </div>

            </div>
        </footer>
    );
}