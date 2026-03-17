import React, { useState } from "react";
import logoHome from "../../../assets/logo.png";
import {
  Form,
  Input,
  Button,
  Tabs,
  Checkbox,
  ConfigProvider,
  message as antdMessage,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useLogin, useRegister } from "../../../hooks/auth/useRegister";

const api = axios.create({
  baseURL: "https://vietstay.ngrok.dev/api",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

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
  const [msg, contextHolder] = antdMessage.useMessage();
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const onLogin = async (values: LoginValues) => {
    setLoginLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data));
      msg.success(res.data.message ?? "Đăng nhập thành công!");

      const userRole = res.data?.role || res.data?.user?.role;
      userRole === "admin" ? navigate("/admin") : navigate("/");
    } catch (error: any) {
      msg.error(error.response?.data?.message ?? "Đăng nhập thất bại");
    } finally {
      setLoginLoading(false);
    }
  };

  const onRegister = async (values: RegisterValues) => {
    setRegisterLoading(true);
    try {
      await api.post("/auth/register", {
        name: values.fullName,
        email: values.email,
        password: values.password,
        password_confirmation: values.confirmPassword,
      });
      msg.success("Đăng ký thành công! Hãy đăng nhập.");
      setActiveTab( "login" );
    } catch (error: any) {
      msg.error(error.response?.data?.message ?? "Đăng ký thất bại");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#22c55e", borderRadius: 14, fontSize: 14 },
        components: { Button: { controlHeight: 44 }, Input: { controlHeight: 44 } },
      }}
    >
      {contextHolder}

      <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-pink-50">
        <div className="relative flex items-center justify-center max-w-6xl min-h-screen px-4 py-10 mx-auto">
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">

            <div className="hidden lg:flex">
              <div className="w-full rounded-3xl border border-white/60 bg-white/40 p-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                <div className="flex justify-center">
                  <img src={logoHome} alt="VietStay" className="h-auto w-70" />
                </div>

                <h1 className="mt-[-40px] text-2xl font-semibold text-slate-900">
                  Chào mừng bạn trở lại
                </h1>

                <p className="mt-3 text-slate-700">
                  Đặt phòng nhanh • Ưu đãi theo mùa • Trải nghiệm tươi mới.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    { t: "Check-in nhanh", d: "Tự động lưu thông tin" },
                    { t: "Ưu đãi độc quyền", d: "Voucher & tích điểm" },
                    { t: "Hỗ trợ 24/7", d: "Chat & hotline" },
                    { t: "Bảo mật tốt", d: "Chuẩn hoá an toàn" },
                  ].map((it) => (
                    <div key={it.t} className="p-4 border rounded-2xl border-white/70 bg-white/50">
                      <div className="text-sm font-semibold text-slate-900">{it.t}</div>
                      <div className="mt-1 text-xs text-slate-600">{it.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md p-6 border shadow-lg rounded-3xl border-white/60 bg-white/55 backdrop-blur-xl sm:p-8">
                <div className="mb-4">
                  <div className="text-2xl font-semibold text-slate-900">Tài khoản</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Đăng nhập hoặc tạo tài khoản để đặt phòng.
                  </div>
                </div>

                <Tabs
                  defaultActiveKey="login"
                  items={[
                    {
                      key: "login",
                      label: "Đăng nhập",
                      children: (
                        <Form<LoginValues> layout="vertical" onFinish={onLogin} initialValues={{ remember: true }}>
                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                              { required: true, message: "Vui lòng nhập email" },
                              { type: "email", message: "Email không hợp lệ" },
                            ]}
                          >
                            <Input prefix={<MailOutlined />} placeholder="you@example.com" />
                          </Form.Item>

                          <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                              { required: true, message: "Vui lòng nhập mật khẩu" },
                              { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
                            ]}
                          >
                            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                          </Form.Item>

                          <Form.Item name="remember" valuePropName="checked">
                            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                          </Form.Item>

                          <Button htmlType="submit" type="primary" className="w-full" loading={loginLoading}>
                            Đăng nhập
                          </Button>
                        </Form>
                      ),
                    },
                    {
                      key: "register",
                      label: "Đăng ký",
                      children: (
                        <Form<RegisterValues> layout="vertical" onFinish={onRegister}>
                          <Form.Item
                            name="fullName"
                            label="Họ và tên"
                            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                          >
                            <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                          </Form.Item>

                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                              { required: true, message: "Vui lòng nhập email" },
                              { type: "email", message: "Email không hợp lệ" },
                            ]}
                          >
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                          </Form.Item>

                          <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                              {
                                pattern: /^\d{9,12}$/,
                                message: "Số điện thoại không hợp lệ",
                              },
                            ]}
                          >
                            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                          </Form.Item>

                          <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                              { required: true, message: "Vui lòng nhập mật khẩu" },
                              { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
                            ]}
                          >
                            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                          </Form.Item>

                          <Form.Item
                            name="confirmPassword"
                            label="Nhập lại mật khẩu"
                            dependencies={["password"]}
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
                            <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
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
                            <Checkbox>Tôi đồng ý với điều khoản và chính sách</Checkbox>
                          </Form.Item>

                          <Button htmlType="submit" type="primary" className="w-full" loading={registerLoading}>
                            Tạo tài khoản
                          </Button>
                        </Form>
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

function setActiveTab(arg0: string) {
  throw new Error("Function not implemented.");
}
