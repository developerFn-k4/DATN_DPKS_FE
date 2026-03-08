import React from "react";
import { Form, Input, Button, Tabs, Checkbox, Divider, ConfigProvider, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { useLogin, useRegister } from "../../../hooks/auth/useRegister";
import { useNavigate } from "react-router-dom";

type LoginValues = {
    email: string;
    password: string;
    remember?: boolean;
};

type RegisterValues = {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
    acceptPolicy: boolean;
};

export default function AuthPage() {
    const [msg, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const { login, loading: loginLoading, error: loginError } = useLogin();
    const onLogin = async (values: LoginValues) => {
        const res = await login({
            email: values.email,
            password: values.password,
        });

        if (res) {
            msg.success(res.message ?? "Đăng nhập thành công");

            // chuyển sang trang chủ
            navigate("/");
        } else {
            msg.error(loginError ?? "Đăng nhập thất bại");
        }
    };


    const { register, error } = useRegister();
    const onRegister = async (values: RegisterValues) => {
        const res = await register({
            name: values.fullName,
            email: values.email,
            password: values.password,
            password_confirmation: values.confirmPassword,
        });

        if (res) msg.success(res.message ?? `Tạo tài khoản thành công: ${values.email}`);
        else msg.error(error ?? "Tạo tài khoản thất bại");
    };
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#22c55e",
                    borderRadius: 14,
                    fontSize: 14,
                },
                components: {
                    Button: { controlHeight: 44 },
                    Input: { controlHeight: 44 },
                },
            }}
        >
            {contextHolder}

            <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-sky-50 to-pink-50">

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
                    <div className="absolute top-24 -right-24 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
                    <div className="absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl" />

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.6),transparent_35%),radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.55),transparent_40%)]" />
                </div>

                <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
                    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">

                        <div className="hidden lg:flex">
                            <div className="w-full rounded-3xl border border-white/60 bg-white/40 p-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                                <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-white shadow-sm">
                                    <span className="text-lg font-semibold">VietStay</span>
                                    <span className="text-xs opacity-90">Hotel</span>
                                </div>

                                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">
                                    Chào mừng bạn trở lại
                                </h1>
                                <p className="mt-3 text-slate-700">
                                    Đặt phòng nhanh • Ưu đãi theo mùa • Trải nghiệm tươi mới như mùa xuân.
                                </p>

                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    {[
                                        { t: "Check-in nhanh", d: "Tự động lưu thông tin" },
                                        { t: "Ưu đãi độc quyền", d: "Voucher & tích điểm" },
                                        { t: "Hỗ trợ 24/7", d: "Chat & hotline" },
                                        { t: "Bảo mật tốt", d: "Chuẩn hoá an toàn" },
                                    ].map((it) => (
                                        <div
                                            key={it.t}
                                            className="rounded-2xl border border-white/70 bg-white/50 p-4 shadow-sm backdrop-blur"
                                        >
                                            <div className="text-sm font-semibold text-slate-900">{it.t}</div>
                                            <div className="mt-1 text-xs text-slate-600">{it.d}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-sky-500 p-5 text-white">
                                    <div className="text-sm font-semibold">Mẹo nhỏ</div>
                                    <div className="mt-1 text-sm opacity-95">
                                        Đăng nhập để xem giá tốt nhất theo ngày và nhận ưu đãi mùa xuân 🌿
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-8">
                                <div className="mb-4">
                                    <div className="text-2xl font-semibold text-slate-900">Tài khoản</div>
                                    <div className="mt-1 text-sm text-slate-600">
                                        Đăng nhập hoặc tạo tài khoản để đặt phòng dễ dàng.
                                    </div>
                                </div>

                                <Tabs
                                    defaultActiveKey="login"
                                    items={[
                                        {
                                            key: "login",
                                            label: "Đăng nhập",
                                            children: (
                                                <>
                                                    <Form<LoginValues>
                                                        layout="vertical"
                                                        onFinish={onLogin}
                                                        requiredMark={false}
                                                        initialValues={{ remember: true }}
                                                    >
                                                        <Form.Item
                                                            label={<span className="text-slate-700">Email</span>}
                                                            name="email"
                                                            rules={[
                                                                { required: true, message: "Vui lòng nhập email" },
                                                                { type: "email", message: "Email không hợp lệ" },
                                                            ]}
                                                        >
                                                            <Input
                                                                prefix={<MailOutlined className="text-slate-400" />}
                                                                placeholder="you@example.com"
                                                                className="rounded-xl"
                                                            />
                                                        </Form.Item>

                                                        <Form.Item
                                                            label={<span className="text-slate-700">Mật khẩu</span>}
                                                            name="password"
                                                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                                                        >
                                                            <Input.Password
                                                                prefix={<LockOutlined className="text-slate-400" />}
                                                                placeholder="••••••••"
                                                                className="rounded-xl"
                                                            />
                                                        </Form.Item>

                                                        <div className="mb-4 flex items-center justify-between">
                                                            <Form.Item name="remember" valuePropName="checked" className="mb-0">
                                                                <Checkbox className="text-slate-700">Ghi nhớ</Checkbox>
                                                            </Form.Item>
                                                            <button
                                                                type="button"
                                                                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                                                                onClick={() => msg.info("Demo: bạn có thể mở modal Quên mật khẩu")}
                                                            >
                                                                Quên mật khẩu?
                                                            </button>
                                                        </div>

                                                        <Button
                                                            htmlType="submit"
                                                            type="primary"
                                                            loading={loginLoading}
                                                            className="w-full rounded-xl font-semibold"
                                                        >
                                                            Đăng nhập
                                                        </Button>

                                                        <Divider className="my-5 text-slate-400">hoặc</Divider>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <Button className="rounded-xl" onClick={() => msg.info("Demo: Google SSO")}>
                                                                Google
                                                            </Button>
                                                            <Button className="rounded-xl" onClick={() => msg.info("Demo: Facebook SSO")}>
                                                                Facebook
                                                            </Button>
                                                        </div>
                                                    </Form>

                                                    <div className="mt-5 text-center text-sm text-slate-600">
                                                        Bằng cách đăng nhập, bạn đồng ý với{" "}
                                                        <span className="font-medium text-slate-800">Điều khoản</span> và{" "}
                                                        <span className="font-medium text-slate-800">Chính sách</span>.
                                                    </div>
                                                </>
                                            ),
                                        },
                                        {
                                            key: "register",
                                            label: "Đăng ký",
                                            children: (
                                                <>
                                                    <Form<RegisterValues>
                                                        layout="vertical"
                                                        onFinish={onRegister}
                                                        requiredMark={false}
                                                    >
                                                        <Form.Item
                                                            label={<span className="text-slate-700">Họ và tên</span>}
                                                            name="fullName"
                                                            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                                                        >
                                                            <Input
                                                                prefix={<UserOutlined className="text-slate-400" />}
                                                                placeholder="Nguyễn Văn A"
                                                                className="rounded-xl"
                                                            />
                                                        </Form.Item>

                                                        <Form.Item
                                                            label={<span className="text-slate-700">Email</span>}
                                                            name="email"
                                                            rules={[
                                                                { required: true, message: "Vui lòng nhập email" },
                                                                { type: "email", message: "Email không hợp lệ" },
                                                            ]}
                                                        >
                                                            <Input
                                                                prefix={<MailOutlined className="text-slate-400" />}
                                                                placeholder="you@example.com"
                                                                className="rounded-xl"
                                                            />
                                                        </Form.Item>

                                                        <Form.Item
                                                            label={<span className="text-slate-700">Số điện thoại (tuỳ chọn)</span>}
                                                            name="phone"
                                                        >
                                                            <Input
                                                                prefix={<PhoneOutlined className="text-slate-400" />}
                                                                placeholder="09xxxxxxxx"
                                                                className="rounded-xl"
                                                            />
                                                        </Form.Item>

                                                        <Form.Item
                                                            label={<span className="text-slate-700">Mật khẩu</span>}
                                                            name="password"
                                                            rules={[
                                                                { required: true, message: "Vui lòng nhập mật khẩu" },
                                                                { min: 6, message: "Tối thiểu 6 ký tự" },
                                                            ]}
                                                            hasFeedback
                                                        >
                                                            <Input.Password
                                                                prefix={<LockOutlined className="text-slate-400" />}
                                                                placeholder="••••••••"
                                                                className="rounded-xl"
                                                            />
                                                        </Form.Item>

                                                        <Form.Item
                                                            label={<span className="text-slate-700">Nhập lại mật khẩu</span>}
                                                            name="confirmPassword"
                                                            dependencies={["password"]}
                                                            hasFeedback
                                                            rules={[
                                                                { required: true, message: "Vui lòng nhập lại mật khẩu" },
                                                                ({ getFieldValue }) => ({
                                                                    validator(_, value) {
                                                                        if (!value || getFieldValue("password") === value) return Promise.resolve();
                                                                        return Promise.reject(new Error("Mật khẩu không khớp"));
                                                                    },
                                                                }),
                                                            ]}
                                                        >
                                                            <Input.Password
                                                                prefix={<LockOutlined className="text-slate-400" />}
                                                                placeholder="••••••••"
                                                                className="rounded-xl"
                                                            />
                                                        </Form.Item>

                                                        <Form.Item
                                                            name="acceptPolicy"
                                                            valuePropName="checked"
                                                            rules={[
                                                                {
                                                                    validator(_, v) {
                                                                        return v ? Promise.resolve() : Promise.reject(new Error("Bạn cần đồng ý điều khoản"));
                                                                    },
                                                                },
                                                            ]}
                                                        >
                                                            <Checkbox className="text-slate-700">
                                                                Tôi đồng ý với <span className="font-medium text-slate-800">Điều khoản</span> &{" "}
                                                                <span className="font-medium text-slate-800">Chính sách</span>
                                                            </Checkbox>
                                                        </Form.Item>

                                                        <Button
                                                            htmlType="submit"
                                                            type="primary"
                                                            className="w-full rounded-xl font-semibold"
                                                        >
                                                            Tạo tài khoản
                                                        </Button>
                                                    </Form>

                                                    <div className="mt-5 text-center text-sm text-slate-600">
                                                        Đăng ký xong bạn có thể đăng nhập ngay và đặt phòng 🌸
                                                    </div>
                                                </>
                                            ),
                                        },
                                    ]}
                                />


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
}
