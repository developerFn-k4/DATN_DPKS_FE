import { useState } from "react";
import { HomeHeader } from "../../components/Header/HomeHeader";
import { HomeFooter } from "../../components/Footer/HomeFooter";
import { Input, Select, Checkbox, Button, Card } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";

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

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Side - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <UserOutlined className="text-emerald-600" />
                Liên hệ đặt chỗ
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Thông tin này dùng để xác nhận và giữ chỗ (sẽ không chia sẻ với bất kỳ ai)
              </p>

              <div className="space-y-4">
                {/* Guest Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tên tôi *
                  </label>
                  <Input
                    size="large"
                    placeholder="Nguyen Van A (VD)"
                    prefix={<UserOutlined className="text-slate-400" />}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    như trên CMND/Hộ chiếu/CCCD (Không dấu)
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  <p className="text-xs text-slate-500 mt-1">
                    vd: +84 912 345 6789 | Để chỗ nghỉ có thể liên hệ với bạn
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
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
            <Card className="rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Thông tin khách hàng
              </h2>
              <p className="text-sm text-slate-600 mb-4">
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
            <Card className="rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Yêu cầu đặc biệt
              </h2>
              <p className="text-sm text-slate-600 mb-4">
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
            <Card className="rounded-2xl shadow-sm bg-blue-50 border-blue-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Chính sách chỗ ở
              </h2>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">📋 Gửi khách hàng</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Bạn có thể nhận phòng hoặc gửi yêu cầu thêm thông tin bất cứ lúc nào. 
                    Người dùng có không quá 3 lần gửi về các thông tin như tài khoản 1 năm.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">⏰ Giờ nhận/trả phòng</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>Nhận phòng từ: {bookingDetails.checkInTime}</li>
                    <li>Trả phòng trước: {bookingDetails.checkOutTime}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">💳 Điều khoản thanh toán</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Nội dung này có thể khác tùy theo sự điều chỉnh của chính sách của chủ khách sạn. 
                    Đối với khách sạn sẽ đưa ra giá công khai VNĐ 2.000.000+(20,000đ)/đêm/phòng.
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-2">
                    Bạy hãy nhập mã đặt chỗ khi nhận trước khi đến VNĐ 2.000.000+(20,000đ)/đêm/phòng
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-2">
                    Tại nhận đê đặt cơ sở in của thẻ VNĐ 2.000.000+(20,000đ)/đêm/phòng
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">ℹ️ Thông tin khác</h3>
                  <p className="text-slate-700 leading-relaxed">
                    4G tốc độ Internet cao tốc lên tới chấp nhận là không về quận VNĐ 
                    2.000.000+(20,000đ)/đêm/phòng
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-2">
                    Giờ vận tác Internet và việc hạn giáp trong còng suất Salinski
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-300">
                <Button type="link" className="text-blue-600 p-0 h-auto">
                  Đọc tất cả →
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Side - Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="rounded-2xl shadow-lg border-2 border-emerald-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Chi tiết giá
                </h2>

                {/* Room Details */}
                <div className="space-y-3 pb-4 border-b border-slate-200">
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

                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-slate-600">
                      {bookingDetails.nights} đêm • {bookingDetails.guests}
                    </span>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
                    <p className="text-xs text-green-700">
                      ✓ Được xác nhận nếu phòng còn tồn kho – Số có thể xuất được trước
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <p className="text-xs text-blue-700">
                      ℹ️ Giá tạm tính trước khi áp dụng các giảm giá
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 py-4 border-b border-slate-200">
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
                  <div className="flex justify-between items-baseline mb-4">
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

                  <p className="text-xs text-slate-500 text-center mt-3">
                    Bằng việc tiếp tục, tôi đồng ý về các điều khoản sử dụng, chính sách bảo mật. 
                    Nhấn "Đăng ký", các yêu cầu về điều khoản và dịch vụ sẽ được xác nhận.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Promotion Banner */}
        <Card className="rounded-2xl shadow-sm mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎉</div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 mb-2">
                Tạo nên những kỷ ức đáng nhớ với các hoạt động nay!
              </h3>
              <p className="text-sm text-slate-700 mb-3">
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
