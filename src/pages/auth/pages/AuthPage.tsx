import logoHome from "../../../assets/logo.png";
import {
  Form,
  Input,
  Button,
  Tabs,
  Checkbox,
  ConfigProvider,
  message,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useLogin, useRegister } from "../../../hooks/auth/useRegister";

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
  const { register, error: registerError } = useRegister();

  const onLogin = async (values: LoginValues) => {
    const res = await login({
      email: values.email,
      password: values.password,
    });

    if (res) {
      msg.success(res.message ?? "Đăng nhập thành công");
      navigate("/");
    } else {
      msg.error(loginError ?? "Đăng nhập thất bại");
    }
  };

  const onRegister = async (values: RegisterValues) => {
    const res = await register({
      name: values.fullName,
      email: values.email,
      password: values.password,
      password_confirmation: values.confirmPassword,
    });

    if (res) {
      msg.success(res.message ?? `Tạo tài khoản thành công: ${values.email}`);
    } else {
      msg.error(registerError ?? "Tạo tài khoản thất bại");
    }
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

      <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-pink-50">
        <div className="relative flex items-center justify-center max-w-6xl min-h-screen px-4 py-10 mx-auto">
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">

            {/* LEFT SIDE */}
            <div className="hidden lg:flex">
              <div className="w-full rounded-3xl border border-white/60 bg-white/40 p-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">

                <div className="flex justify-center">
                  <img
                    src={logoHome}
                    alt="VietStay"
                    className="h-[60px] w-[100px]"
                  />
                </div>

                <h1 className="mt-6 text-4xl font-semibold text-slate-900">
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
                    <div
                      key={it.t}
                      className="p-4 border rounded-2xl border-white/70 bg-white/50"
                    >
                      <div className="text-sm font-semibold text-slate-900">
                        {it.t}
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        {it.d}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md p-6 border shadow-lg rounded-3xl border-white/60 bg-white/55 backdrop-blur-xl sm:p-8">

                <div className="mb-4">
                  <div className="text-2xl font-semibold text-slate-900">
                    Tài khoản
                  </div>
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
                        <Form<LoginValues>
                          layout="vertical"
                          onFinish={onLogin}
                          initialValues={{ remember: true }}
                        >
                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                              { required: true, message: "Vui lòng nhập email" },
                              { type: "email", message: "Email không hợp lệ" },
                            ]}
                          >
                            <Input
                              prefix={<MailOutlined />}
                              placeholder="you@example.com"
                            />
                          </Form.Item>

                          <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                              { required: true, message: "Vui lòng nhập mật khẩu" },
                            ]}
                          >
                            <Input.Password
                              prefix={<LockOutlined />}
                              placeholder="••••••••"
                            />
                          </Form.Item>

                          <Form.Item
                            name="remember"
                            valuePropName="checked"
                          >
                            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                          </Form.Item>

                          <Button
                            htmlType="submit"
                            type="primary"
                            loading={loginLoading}
                            className="w-full"
                          >
                            Đăng nhập
                          </Button>
                        </Form>
                      ),
                    },
                    {
                      key: "register",
                      label: "Đăng ký",
                      children: (
                        <Form<RegisterValues>
                          layout="vertical"
                          onFinish={onRegister}
                        >
                          <Form.Item
                            name="fullName"
                            label="Họ và tên"
                            rules={[
                              { required: true, message: "Vui lòng nhập tên" },
                            ]}
                          >
                            <Input prefix={<UserOutlined />} />
                          </Form.Item>

                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                              { required: true, message: "Vui lòng nhập email" },
                              { type: "email", message: "Email không hợp lệ" },
                            ]}
                          >
                            <Input prefix={<MailOutlined />} />
                          </Form.Item>

                          <Form.Item name="phone" label="Số điện thoại">
                            <Input prefix={<PhoneOutlined />} />
                          </Form.Item>

                          <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                              { required: true, message: "Nhập mật khẩu" },
                              { min: 6, message: "Tối thiểu 6 ký tự" },
                            ]}
                          >
                            <Input.Password prefix={<LockOutlined />} />
                          </Form.Item>

                          <Form.Item
                            name="confirmPassword"
                            label="Nhập lại mật khẩu"
                            dependencies={["password"]}
                            rules={[
                              { required: true, message: "Nhập lại mật khẩu" },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || getFieldValue("password") === value)
                                    return Promise.resolve();
                                  return Promise.reject(
                                    new Error("Mật khẩu không khớp")
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password prefix={<LockOutlined />} />
                          </Form.Item>

                          <Form.Item
                            name="acceptPolicy"
                            valuePropName="checked"
                            rules={[
                              {
                                validator(_, v) {
                                  return v
                                    ? Promise.resolve()
                                    : Promise.reject(
                                        new Error("Bạn cần đồng ý điều khoản")
                                      );
                                },
                              },
                            ]}
                          >
                            <Checkbox>
                              Tôi đồng ý với điều khoản và chính sách
                            </Checkbox>
                          </Form.Item>

                          <Button
                            htmlType="submit"
                            type="primary"
                            className="w-full"
                          >
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