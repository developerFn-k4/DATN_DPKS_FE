import { useState } from "react";
import { Input, Select, Checkbox, Button, Card } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { HomeHeader } from "../../../../components/Header/HomeHeader";
import { HomeFooter } from "../../../../components/Footer/HomeFooter";

const { Option } = Select;
const { TextArea } = Input;

export default function BookingPage() {
  const [guestName, setGuestName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+84");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isGuest, setIsGuest] = useState(true);
  const [specialRequests, setSpecialRequests] = useState("");

  // Dữ liệu mẫu cho booking
  const bookingDetails = {
    roomName: "Deluxe - Room Only",
    quantity: 1,
    checkIn: "Thứ Tư, 11 tháng 03",
    checkOut: "Thứ Năm, 12 tháng 03",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    nights: 1,
    guests: "2 khách",
    roomPrice: 1200000,
    taxes: 216000,
  };

  const totalPrice = bookingDetails.roomPrice + bookingDetails.taxes;

  const handleSubmit = () => {
    console.log({
      guestName,
      phone: phoneCode + phoneNumber,
      email,
      isGuest,
      specialRequests,
    });
    // Handle booking submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <HomeHeader />

      <main className="px-4 py-8 mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Side - Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Contact Information */}
            <Card className="shadow-sm rounded-2xl">
              <h2 className="flex items-center gap-2 mb-4 text-xl font-bold text-slate-800">
                <UserOutlined className="text-emerald-600" />
                Liên hệ đặt chỗ
              </h2>
              <p className="mb-6 text-sm text-slate-600">
                Thông tin này dùng để xác nhận và giữ chỗ (sẽ không chia sẻ với bất kỳ ai)
              </p>

              <div className="space-y-4">
                {/* Guest Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Tên tôi *
                  </label>
                  <Input
                    size="large"
                    placeholder="Nguyen Van A (VD)"
                    prefix={<UserOutlined className="text-slate-400" />}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    như trên CMND/Hộ chiếu/CCCD (Không dấu)
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Điện thoại di động
                  </label>
                  <div className="flex gap-2">
                    <Select
                      size="large"
                      value={phoneCode}
                      onChange={setPhoneCode}
                      className="w-28"
                    >
                      <Option value="+84">🇻🇳 +84</Option>
                      <Option value="+1">🇺🇸 +1</Option>
                      <Option value="+86">🇨🇳 +86</Option>
                    </Select>
                    <Input
                      size="large"
                      placeholder="912 345 6789"
                      prefix={<PhoneOutlined className="text-slate-400" />}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    vd: +84 912 345 6789 | Để chỗ nghỉ có thể liên hệ với bạn
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Email *
                  </label>
                  <Input
                    size="large"
                    type="email"
                    placeholder="VD: email@example.com"
                    prefix={<MailOutlined className="text-slate-400" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Guest Information */}
            <Card className="shadow-sm rounded-2xl">
              <h2 className="mb-4 text-xl font-bold text-slate-800">
                Thông tin khách hàng
              </h2>
              <p className="mb-4 text-sm text-slate-600">
                Ai đang nhận phòng? Hãy điền chi tiết đầy đủ của khách đang sử dụng
              </p>
              <Checkbox
                checked={isGuest}
                onChange={(e) => setIsGuest(e.target.checked)}
                className="text-sm"
              >
                Tôi là người đặt chính mình (Tôi là khách sử dụng hạng phòng này)
              </Checkbox>
            </Card>

            {/* Special Requests */}
            <Card className="shadow-sm rounded-2xl">
              <h2 className="mb-4 text-xl font-bold text-slate-800">
                Yêu cầu đặc biệt
              </h2>
              <p className="mb-4 text-sm text-slate-600">
                Bạn có gì muốn nhắn nhủ với chỗ nghỉ? Viết thoải mái nhé (không bắt buộc!)
              </p>
              <TextArea
                rows={4}
                placeholder="Vd: Muốn phòng tầng cao, view đẹp..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                maxLength={500}
                showCount
              />
            </Card>

            {/* Policies */}
            <Card className="border-blue-200 shadow-sm rounded-2xl bg-blue-50">
              <h2 className="mb-4 text-lg font-bold text-slate-800">
                Chính sách chỗ ở
              </h2>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="mb-2 font-semibold text-slate-800">📋 Gửi khách hàng</h3>
                  <p className="leading-relaxed text-slate-700">
                    Bạn có thể nhận phòng hoặc gửi yêu cầu thêm thông tin bất cứ lúc nào. 
                    Người dùng có không quá 3 lần gửi về các thông tin như tài khoản 1 năm.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-slate-800">⏰ Giờ nhận/trả phòng</h3>
                  <ul className="space-y-1 list-disc list-inside text-slate-700">
                    <li>Nhận phòng từ: {bookingDetails.checkInTime}</li>
                    <li>Trả phòng trước: {bookingDetails.checkOutTime}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-slate-800">💳 Điều khoản thanh toán</h3>
                  <p className="leading-relaxed text-slate-700">
                    Nội dung này có thể khác tùy theo sự điều chỉnh của chính sách của chủ khách sạn. 
                    Đối với khách sạn sẽ đưa ra giá công khai VNĐ 2.000.000+(20,000đ)/đêm/phòng.
                  </p>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    Bạy hãy nhập mã đặt chỗ khi nhận trước khi đến VNĐ 2.000.000+(20,000đ)/đêm/phòng
                  </p>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    Tại nhận đê đặt cơ sở in của thẻ VNĐ 2.000.000+(20,000đ)/đêm/phòng
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-slate-800">ℹ️ Thông tin khác</h3>
                  <p className="leading-relaxed text-slate-700">
                    4G tốc độ Internet cao tốc lên tới chấp nhận là không về quận VNĐ 
                    2.000.000+(20,000đ)/đêm/phòng
                  </p>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    Giờ vận tác Internet và việc hạn giáp trong còng suất Salinski
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-blue-300">
                <Button type="link" className="h-auto p-0 text-blue-600">
                  Đọc tất cả →
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Side - Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-2 shadow-lg rounded-2xl border-emerald-100">
                <h2 className="mb-4 text-lg font-bold text-slate-800">
                  Chi tiết giá
                </h2>

                {/* Room Details */}
                <div className="pb-4 space-y-3 border-b border-slate-200">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      ({bookingDetails.quantity}x) {bookingDetails.roomName}
                    </p>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Check-in</span>
                    <span className="font-medium text-slate-800">
                      {bookingDetails.checkIn}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Giờ: </span>
                    <span className="font-medium text-slate-800">
                      {bookingDetails.checkInTime}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Check-out</span>
                    <span className="font-medium text-slate-800">
                      {bookingDetails.checkOut}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Giờ: </span>
                    <span className="font-medium text-slate-800">
                      {bookingDetails.checkOutTime}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 text-sm">
                    <span className="text-slate-600">
                      {bookingDetails.nights} đêm • {bookingDetails.guests}
                    </span>
                  </div>

                  <div className="p-2 mt-2 border border-green-200 rounded-lg bg-green-50">
                    <p className="text-xs text-green-700">
                      ✓ Được xác nhận nếu phòng còn tồn kho – Số có thể xuất được trước
                    </p>
                  </div>

                  <div className="p-2 border border-blue-200 rounded-lg bg-blue-50">
                    <p className="text-xs text-blue-700">
                      ℹ️ Giá tạm tính trước khi áp dụng các giảm giá
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="py-4 space-y-3 border-b border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Giá phòng</span>
                    <span className="text-slate-800">
                      {bookingDetails.roomPrice.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Thuế và phí</span>
                    <span className="text-slate-800">
                      {bookingDetails.taxes.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-sm text-slate-600">Tổng cộng</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">
                        {totalPrice.toLocaleString("vi-VN")} VNĐ
                      </div>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    block
                    className="!bg-emerald-600 hover:!bg-emerald-700 !h-12 !text-base font-semibold"
                    onClick={handleSubmit}
                  >
                    Đăng ký
                  </Button>

                  <p className="mt-3 text-xs text-center text-slate-500">
                    Bằng việc tiếp tục, tôi đồng ý về các điều khoản sử dụng, chính sách bảo mật. 
                    Nhấn "Đăng ký", các yêu cầu về điều khoản và dịch vụ sẽ được xác nhận.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Promotion Banner */}
        <Card className="mt-6 border-yellow-200 shadow-sm rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎉</div>
            <div className="flex-1">
              <h3 className="mb-2 font-bold text-slate-800">
                Tạo nên những kỷ ức đáng nhớ với các hoạt động nay!
              </h3>
              <p className="mb-3 text-sm text-slate-700">
                Bảo Hiểu Đã Một Bước Hành Trí Đặt, Vá Và Chuyển Hộ Xe Công Hoạt, 
                Làm Công Dời Đổi Vụ Của Khách Về Mong Muốn
              </p>
              <Button type="default" className="border-orange-400 text-orange-600 hover:!border-orange-500 hover:!text-orange-700">
                Thêm vào giỏ hàng nay →
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <HomeFooter />
    </div>
  );
}