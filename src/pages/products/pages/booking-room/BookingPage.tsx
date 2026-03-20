import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Card, Descriptions } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { HomeHeader } from "../../../../components/Header/HomeHeader";
import { HomeFooter } from "../../../../components/Footer/HomeFooter";
import { createBooking } from "../../../../services/bookings/booking.service";


interface LocationState {
  room_id: number;
  room_number: string;
  room_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  price: string;
}

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const state = location.state as LocationState;

  // Redirect nếu không có state
  if (!state || !state.room_id) {
    return (
      <div className="flex flex-col min-h-screen">
        <HomeHeader />
        <div className="flex items-center justify-center flex-grow p-4">
          <Card className="w-full max-w-md text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2 className="mb-2 text-xl font-bold text-slate-800">
              Không tìm thấy thông tin đặt phòng
            </h2>
            <p className="mb-6 text-slate-500">
              Vui lòng chọn phòng và thời gian lưu trú trước khi đặt phòng.
            </p>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/")}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Quay về trang chủ
            </Button>
          </Card>
        </div>
        <HomeFooter />
      </div>
    );
  }

  const { room_id, room_number, room_name, check_in, check_out, guests, price } = state;

  // Tính số đêm
  const checkInDate = dayjs(check_in);
  const checkOutDate = dayjs(check_out);
  const nights = checkOutDate.diff(checkInDate, "day");
  const totalPrice = parseFloat(price) * nights;

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const bookingData = {
        room_id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        check_in,
        check_out,
        guests,
      };

      const response = await createBooking(bookingData);

      if (response.success) {
        message.success("Đặt phòng thành công!");
        
        // Hiển thị thông báo chi tiết
        setTimeout(() => {
          message.info(`Mã đặt phòng của bạn: #${response.booking?.id || "N/A"}`);
        }, 500);

        // Redirect về trang chủ sau 2s
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        message.error(response.message || "Đặt phòng thất bại!");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      message.error(error.message || "Có lỗi xảy ra khi đặt phòng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      <HomeHeader />

      <main className="flex-grow w-full max-w-5xl px-4 py-12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Đăng ký đặt phòng</h1>
          <p className="mb-8 text-slate-500">
            Vui lòng điền đầy đủ thông tin bên dưới để hoàn tất đặt phòng
          </p>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Form bên trái */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg rounded-2xl border-slate-200">
                <h3 className="mb-6 text-xl font-bold text-slate-800">Thông tin khách hàng</h3>
                
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  requiredMark="optional"
                >
                  <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên!" },
                      { min: 3, message: "Họ tên phải có ít nhất 3 ký tự!" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="text-slate-400" />}
                      placeholder="Nguyễn Văn A"
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="text-slate-400" />}
                      placeholder="vana@gmail.com"
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      { required: true, message: "Vui lòng nhập số điện thoại!" },
                      { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải có 10 chữ số!" },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined className="text-slate-400" />}
                      placeholder="0987654321"
                      size="large"
                      className="rounded-lg"
                      maxLength={10}
                    />
                  </Form.Item>

                  <Form.Item className="mb-0">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      className="w-full h-12 text-base font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700"
                    >
                      {loading ? "Đang xử lý..." : "Đăng ký"}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>

            {/* Thông tin đặt phòng bên phải */}
            <div className="lg:col-span-1">
              <Card className="sticky shadow-lg rounded-2xl border-slate-200 top-24">
                <h3 className="mb-4 text-lg font-bold text-slate-800">Chi tiết đặt phòng</h3>
                
                <Descriptions column={1} size="small" className="mb-4">
                  <Descriptions.Item label="Phòng">
                    <span className="font-semibold text-slate-700">
                      {room_name} - Phòng {room_number}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Nhận phòng">
                    <span className="flex items-center gap-1.5">
                      <CalendarOutlined className="text-emerald-600" />
                      {checkInDate.format("DD/MM/YYYY")}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trả phòng">
                    <span className="flex items-center gap-1.5">
                      <CalendarOutlined className="text-emerald-600" />
                      {checkOutDate.format("DD/MM/YYYY")}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số đêm">
                    <span className="font-semibold">{nights} đêm</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số khách">
                    <span className="font-semibold">{guests} người</span>
                  </Descriptions.Item>
                </Descriptions>

                <div className="pt-4 mt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600">Giá phòng/đêm:</span>
                    <span className="font-semibold text-slate-700">
                      {parseFloat(price).toLocaleString()} ₫
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600">Số đêm:</span>
                    <span className="font-semibold text-slate-700">× {nights}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-slate-800">Tổng cộng:</span>
                      <span className="text-xl font-bold text-emerald-600">
                        {totalPrice.toLocaleString()} ₫
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 mt-6 border rounded-lg bg-emerald-50 border-emerald-100">
                  <p className="text-xs text-emerald-700">
                    ✓ Miễn phí hủy phòng trong vòng 24h
                  </p>
                  <p className="mt-1 text-xs text-emerald-700">
                    ✓ Thanh toán khi nhận phòng
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>

      <HomeFooter />
    </div>
  );
}