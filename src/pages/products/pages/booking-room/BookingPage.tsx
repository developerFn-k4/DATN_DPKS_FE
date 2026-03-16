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
      <div className="min-h-screen flex flex-col">
        <HomeHeader />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Không tìm thấy thông tin đặt phòng
            </h2>
            <p className="text-slate-500 mb-6">
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 via-white to-white">
      <HomeHeader />

      <main className="flex-grow max-w-5xl mx-auto px-4 py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Đăng ký đặt phòng</h1>
          <p className="text-slate-500 mb-8">
            Vui lòng điền đầy đủ thông tin bên dưới để hoàn tất đặt phòng
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form bên trái */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg rounded-2xl border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Thông tin khách hàng</h3>
                
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
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold text-base"
                    >
                      {loading ? "Đang xử lý..." : "Đăng ký"}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>

            {/* Thông tin đặt phòng bên phải */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg rounded-2xl border-slate-200 sticky top-24">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Chi tiết đặt phòng</h3>
                
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

                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600">Giá phòng/đêm:</span>
                    <span className="font-semibold text-slate-700">
                      {parseFloat(price).toLocaleString()} ₫
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600">Số đêm:</span>
                    <span className="font-semibold text-slate-700">× {nights}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-800">Tổng cộng:</span>
                      <span className="text-xl font-bold text-emerald-600">
                        {totalPrice.toLocaleString()} ₫
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <p className="text-xs text-emerald-700">
                    ✓ Miễn phí hủy phòng trong vòng 24h
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">
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