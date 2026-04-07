import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  TeamOutlined,
  StarFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { HomeHeader } from "../../../../components/Header/HomeHeader";
import { HomeFooter } from "../../../../components/Footer/HomeFooter";
import { createBooking } from "../../../../services/bookings/booking.service";

interface GuestConfig {
  adults: number;
  children: number;
  infant: number;
}

interface ServiceItem {
  id: number;
  name: string;
  price: number;
}

interface LocationState {
  roomId: number;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomCount: number;
  guestConfig: GuestConfig[];
  selectedServices: ServiceItem[];
  totalPrice: number;
}

const formatPrice = (p: number) =>
  new Intl.NumberFormat("vi-VN").format(p) + " ₫";

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const state = location.state as LocationState;

  if (!state || !state.roomId) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <HomeHeader />
        <div className="flex items-center justify-center grow p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">🏨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Chưa chọn phòng
            </h2>
            <p className="text-gray-400 mb-8">
              Vui lòng chọn phòng và thời gian lưu trú trước khi đặt phòng.
            </p>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/")}
              className="bg-emerald-600! hover:bg-emerald-700! border-none h-12 px-8 rounded-xl font-semibold"
            >
              Quay về trang chủ
            </Button>
          </motion.div>
        </div>
        <HomeFooter />
      </div>
    );
  }

  const {
    roomId,
    roomName,
    checkIn,
    checkOut,
    nights,
    roomCount,
    guestConfig,
    selectedServices,
    totalPrice,
  } = state;

  const checkInDate = dayjs(checkIn);
  const checkOutDate = dayjs(checkOut);

  const totalAdults = guestConfig.reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = guestConfig.reduce((sum, r) => sum + r.children, 0);
  const totalGuests = totalAdults + totalChildren;

  const baseRoomPrice = totalPrice - selectedServices.reduce((s, sv) => s + sv.price * roomCount * nights, 0);

  const handleSubmit = async (values: { name: string; email: string; phone: string }) => {
    try {
      setLoading(true);

      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        check_in: checkIn,
        check_out: checkOut,
        rooms: [
          {
            room_type_id: roomId,
            quantity: roomCount,
            adults: totalAdults,
            children: totalChildren,
          },
        ],
        services: selectedServices.map((s) => ({
          service_id: s.id,
          quantity: roomCount,
        })),
      };

      const response = await createBooking(payload);

      if (response.success) {
        message.success({
          content: "Đặt phòng thành công!",
          duration: 2,
          style: { marginTop: "20vh" },
        });
        setTimeout(() => navigate("/"), 1800);
      } else {
        message.error(response.message || "Đặt phòng thất bại!");
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || error.message || "Có lỗi xảy ra khi đặt phòng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HomeHeader />

      {/* Hero bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors text-sm"
          >
            <ArrowLeftOutlined />
            Quay lại
          </button>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-emerald-600 font-semibold">Chọn phòng</span>
            <span>→</span>
            <span className="font-semibold text-gray-800">Thông tin đặt phòng</span>
            <span>→</span>
            <span>Xác nhận</span>
          </div>
        </div>
      </div>

      <main className="grow w-full max-w-6xl px-4 py-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Hoàn tất đặt phòng</h1>
          <p className="text-gray-400 text-sm mb-8">
            Điền thông tin bên dưới để xác nhận đặt phòng của bạn
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* LEFT — Form + summary */}
            <div className="lg:col-span-3 space-y-6">

              {/* Room summary card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-4">
                  <p className="text-emerald-100 text-xs uppercase tracking-widest font-medium mb-1">Phòng đã chọn</p>
                  <h3 className="text-white text-xl font-bold">{roomName}</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <CalendarOutlined className="text-emerald-500 text-xl mb-2 block" />
                      <p className="text-[11px] text-gray-400 uppercase font-medium mb-0.5">Nhận phòng</p>
                      <p className="font-bold text-gray-800 text-sm">{checkInDate.format("DD/MM/YYYY")}</p>
                      <p className="text-xs text-gray-400">{checkInDate.format("dddd")}</p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200 border-dashed">
                      <div className="text-2xl font-black text-emerald-600">{nights}</div>
                      <p className="text-[11px] text-emerald-500 uppercase font-medium">đêm lưu trú</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <CalendarOutlined className="text-red-400 text-xl mb-2 block" />
                      <p className="text-[11px] text-gray-400 uppercase font-medium mb-0.5">Trả phòng</p>
                      <p className="font-bold text-gray-800 text-sm">{checkOutDate.format("DD/MM/YYYY")}</p>
                      <p className="text-xs text-gray-400">{checkOutDate.format("dddd")}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <span className="text-blue-500 text-xs font-bold">{roomCount}</span>
                      </div>
                      <span>Phòng</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <TeamOutlined className="text-purple-500" />
                      <span>{totalGuests} khách</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-400 text-xs">{totalAdults} người lớn{totalChildren > 0 ? `, ${totalChildren} trẻ em` : ""}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <StarFilled className="text-yellow-400 text-xs" />
                      <StarFilled className="text-yellow-400 text-xs" />
                      <StarFilled className="text-yellow-400 text-xs" />
                      <StarFilled className="text-yellow-400 text-xs" />
                      <StarFilled className="text-yellow-400 text-xs" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Services summary (if any) */}
              {selectedServices.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-emerald-500 rounded-full inline-block"></span>
                    Dịch vụ bổ sung đã chọn
                  </h4>
                  <div className="space-y-2">
                    {selectedServices.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between py-2 px-3 bg-emerald-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircleFilled className="text-emerald-500 text-sm" />
                          <span className="text-gray-700 text-sm">{s.name}</span>
                        </div>
                        <span className="text-emerald-700 font-semibold text-sm">
                          {formatPrice(s.price)} / đêm
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guest info form */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
                  Thông tin liên hệ
                </h3>
                <p className="text-gray-400 text-sm mb-6 ml-4">
                  Chúng tôi sẽ gửi xác nhận đặt phòng tới địa chỉ email của bạn
                </p>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  requiredMark={false}
                  size="large"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <Form.Item
                      label={<span className="text-gray-600 font-medium text-sm">Họ và tên</span>}
                      name="name"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ tên!" },
                        { min: 3, message: "Họ tên phải có ít nhất 3 ký tự!" },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-gray-300" />}
                        placeholder="Nguyễn Văn A"
                        className="rounded-xl border-gray-200 hover:border-emerald-400 focus:border-emerald-500"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="text-gray-600 font-medium text-sm">Số điện thoại</span>}
                      name="phone"
                      rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại!" },
                        { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải có 10 chữ số!" },
                      ]}
                    >
                      <Input
                        prefix={<PhoneOutlined className="text-gray-300" />}
                        placeholder="0987 654 321"
                        className="rounded-xl border-gray-200 hover:border-emerald-400 focus:border-emerald-500"
                        maxLength={10}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    label={<span className="text-gray-600 font-medium text-sm">Địa chỉ email</span>}
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="text-gray-300" />}
                      placeholder="email@example.com"
                      className="rounded-xl border-gray-200 hover:border-emerald-400 focus:border-emerald-500"
                    />
                  </Form.Item>

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                    <p className="text-amber-700 text-xs font-medium">
                      📌 Lưu ý: Email xác nhận đặt phòng sẽ được gửi trong vòng 5 phút. Vui lòng kiểm tra hòm thư của bạn.
                    </p>
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full h-13 text-base font-bold rounded-xl bg-emerald-600! hover:bg-emerald-700! border-none shadow-lg shadow-emerald-100"
                    style={{ height: 52 }}
                  >
                    {loading ? "Đang xử lý đặt phòng..." : "Xác nhận đặt phòng →"}
                  </Button>
                </Form>
              </div>
            </div>

            {/* RIGHT — Sticky price summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Tóm tắt chi phí</p>
                    <p className="text-gray-600 text-sm">{roomName}</p>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        Tiền phòng ({roomCount} phòng × {nights} đêm)
                      </span>
                      <span className="font-semibold text-gray-800">
                        {formatPrice(baseRoomPrice > 0 ? baseRoomPrice : totalPrice - selectedServices.reduce((s, sv) => s + sv.price, 0))}
                      </span>
                    </div>

                    {selectedServices.map((s) => (
                      <div key={s.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">{s.name}</span>
                        <span className="text-gray-600">
                          {formatPrice(s.price * roomCount * nights)}
                        </span>
                      </div>
                    ))}

                    <div className="pt-4 mt-2 border-t-2 border-dashed border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">Tổng thanh toán</span>
                        <span className="text-2xl font-black text-emerald-600">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1 text-right">Đã bao gồm thuế & phí</p>
                    </div>
                  </div>
                </div>

                {/* Policies */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Chính sách</p>
                  {[
                    { icon: "✅", text: "Miễn phí hủy phòng trước 24h" },
                    { icon: "💳", text: "Thanh toán linh hoạt khi nhận phòng" },
                    { icon: "🔒", text: "Thông tin được bảo mật tuyệt đối" },
                    { icon: "📞", text: "Hỗ trợ 24/7 qua hotline" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-gray-600 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Trust badges */}
                <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 text-center">
                  <p className="text-emerald-700 font-bold text-sm mb-1">ViEtStay đảm bảo</p>
                  <p className="text-emerald-600 text-xs">
                    Hơn 10,000+ khách hàng hài lòng đã đặt phòng qua hệ thống của chúng tôi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <HomeFooter />
    </div>
  );
}
