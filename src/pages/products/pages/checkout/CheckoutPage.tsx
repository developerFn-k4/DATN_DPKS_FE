import { useState } from "react";
import { Input, Checkbox, Button, Card, Steps, Divider, Radio, message } from "antd";
import { 
  CreditCardOutlined, 
  SafetyOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
  BankOutlined
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { HomeHeader } from "../../../../components/Header/HomeHeader";
import { HomeFooter } from "../../../../components/Footer/HomeFooter";
import { createVNPayPayment } from "../../../../services/payment/vnpayService";
import "./style.less";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "32"; // Default to 32 for testing
  
  const [currentStep] = useState(1);
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("pay-at-hotel");
  const [loading, setLoading] = useState(false);

  // Dữ liệu mẫu cho đặt phòng
  const bookingData = {
    hotelName: "Hanoi La Château Hotel & Spa",
    hotelAddress: "23-25 Phố Hàng Trống, Quận Hoàn Kiếm, Hà Nội, Việt Nam",
    hotelRating: 8.8,
    hotelReviews: "137 đánh giá",
    roomType: "Deluxe Double or Twin Room",
    checkInDate: "Thứ Tư, 14 tháng 4 2025",
    checkOutDate: "Thứ Năm, 15 tháng 4 2025",
    checkInTime: "14:00 - 20:00",
    checkOutTime: "00:00 - 12:00",
    nights: 1,
    guests: "2 người lớn",
    originalPrice: 3780319,
    discount: 801593,
    subtotal: 2978726,
    taxesAndFees: 225046,
    total: 2978726
  };

  const handleCompleteBooking = async () => {
    // Validate payment method
    if (paymentMethod === "vnpay") {
      try {
        setLoading(true);
        const response = await createVNPayPayment(parseInt(bookingId));
        
        if (response.payment_url) {
          // Open VNPay payment URL in new tab
          window.open(response.payment_url, '_blank');
          message.success("Đang chuyển đến trang thanh toán VNPay...");
        } else {
          message.error(response.message || "Không thể tạo thanh toán VNPay");
        }
      } catch (error) {
        console.error("Error creating VNPay payment:", error);
        message.error("Có lỗi xảy ra khi tạo thanh toán VNPay");
      } finally {
        setLoading(false);
      }
    } else {
      // Handle other payment methods
      console.log("Completing booking...", {
        cardholderName,
        cardNumber,
        expiryDate,
        cvv,
        agreeMarketing,
        paymentMethod
      });
      // Xử lý logic hoàn tất đặt phòng
      message.success("Đặt phòng thành công!");
    }
  };

  const steps = [
    { title: 'Bạn chọn' },
    { title: 'Chi tiết về bạn' },
    { title: 'Hoàn tất đặt phòng' }
  ];

  return (
    <div className="checkout-page">
      {/* Header */}
      <HomeHeader />

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="py-6 checkout-container">
          <Steps
            current={currentStep}
            items={steps}
            className="checkout-steps"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 bg-slate-50">
        <div className="checkout-container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Hotel Info Card */}
              <Card className="mb-6 checkout-card">
                <div className="flex gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop" 
                    alt={bookingData.hotelName}
                    className="object-cover rounded-lg w-30 h-25"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://acihome.vn/uploads/15/thiet-ke-khach-san-hien-dai-co-cac-ban-cong-view-bien-sieu-dep-seaside-mirage-hotel-1.JPG";
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded">
                        {bookingData.hotelRating}
                      </span>
                      <span className="text-sm text-slate-600">
                        Tuyệt vời · {bookingData.hotelReviews}
                      </span>
                    </div>
                    <h2 className="mb-1 text-xl font-bold text-slate-800">
                      {bookingData.hotelName}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {bookingData.hotelAddress}
                    </p>
                  </div>
                </div>

                <Divider />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Nhận phòng</p>
                    <p className="text-sm text-slate-600">{bookingData.checkInDate}</p>
                    <p className="text-xs text-slate-500">{bookingData.checkInTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Trả phòng</p>
                    <p className="text-sm text-slate-600">{bookingData.checkOutDate}</p>
                    <p className="text-xs text-slate-500">{bookingData.checkOutTime}</p>
                  </div>
                </div>

                <div className="p-3 mt-4 rounded bg-slate-50">
                  <p className="text-sm text-slate-700">
                    Tổng thời gian lưu trú: <strong>{bookingData.nights} đêm</strong> • {bookingData.guests}
                  </p>
                </div>
              </Card>

              {/* Payment at Hotel Notice */}
              <Card className="mb-6 border-green-200 checkout-card bg-green-50">
                <h3 className="flex items-center gap-2 mb-3 text-lg font-bold text-slate-800">
                  <CheckCircleFilled className="text-green-600" />
                  Thanh toán khi đến nghỉ
                </h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Thẻ Ghi nợ được bạn sử dụng để hoàn thành đặt chỗ chỉ nhằm quỹ đặt 
                  chỗ này. Chúng tôi sẽ giữ chỗ của bạn và chỗ nghỉ sẽ thu thanh toán 
                  trực tiếp.
                </p>
              </Card>

              {/* Payment Method */}
              <Card className="mb-6 checkout-card">
                <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-800">
                  <CreditCardOutlined />
                  Phương thức thanh toán
                </h3>

                <Radio.Group 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full"
                >
                  <div className="space-y-3">
                    {/* VNPay Payment */}
                    <Radio value="vnpay" className="w-full">
                      <div className="flex items-center gap-2">
                        <BankOutlined className="text-lg text-blue-600" />
                        <span className="font-medium">Thanh toán qua VNPay</span>
                        <span className="px-2 py-0.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded">
                          Khuyến nghị
                        </span>
                      </div>
                    </Radio>

                    {paymentMethod === "vnpay" && (
                      <div className="p-4 ml-6 border rounded-lg border-blue-200 bg-blue-50">
                        <div className="flex items-start gap-3">
                          <BankOutlined className="mt-1 text-2xl text-blue-600" />
                          <div>
                            <p className="mb-2 font-semibold text-slate-800">
                              Thanh toán an toàn qua VNPay
                            </p>
                            <ul className="space-y-1 text-sm text-slate-600">
                              <li>• Hỗ trợ thẻ ATM nội địa, thẻ Visa/Mastercard</li>
                              <li>• Thanh toán qua ví điện tử VNPay</li>
                              <li>• Bảo mật 100% với công nghệ mã hóa</li>
                              <li>• Xử lý thanh toán nhanh chóng</li>
                            </ul>
                            <div className="flex gap-2 mt-3">
                              <img 
                                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png" 
                                alt="VNPay"
                                className="h-8"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Divider className="my-3" />

                    {/* Credit/Debit Card Payment */}
                    <Radio value="pay-at-hotel" className="w-full">
                      <div className="flex items-center gap-2">
                        <CreditCardOutlined className="text-lg" />
                        <span className="font-medium">Thẻ tín dụng/ghi nợ</span>
                      </div>
                    </Radio>

                    {paymentMethod === "pay-at-hotel" && (
                      <div className="p-4 ml-6 space-y-4 border rounded-lg border-slate-200 bg-slate-50">
                        <div className="flex gap-2">
                          <div className="px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded">VISA</div>
                          <div className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded">MASTERCARD</div>
                          <div className="px-3 py-1 text-xs font-bold text-white bg-blue-700 rounded">JCB</div>
                          <div className="px-3 py-1 text-xs font-bold text-white bg-green-600 rounded">DEBIT</div>
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-slate-700">
                            Tên chủ thẻ <span className="text-red-500">*</span>
                          </label>
                          <Input
                            size="large"
                            placeholder="Huỳ Nguyễn"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            className="checkout-input"
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-slate-700">
                            Số thẻ <span className="text-red-500">*</span>
                          </label>
                          <Input
                            size="large"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            maxLength={19}
                            className="checkout-input"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                              Ngày hết hạn <span className="text-red-500">*</span>
                              <InfoCircleOutlined className="ml-1 text-slate-400" />
                            </label>
                            <Input
                              size="large"
                              placeholder="MM / YY"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(e.target.value)}
                              maxLength={7}
                              className="checkout-input"
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                              CVV <span className="text-red-500">*</span>
                              <InfoCircleOutlined className="ml-1 text-slate-400" />
                            </label>
                            <Input
                              size="large"
                              placeholder="123"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              maxLength={4}
                              type="password"
                              className="checkout-input"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Radio.Group>

                <div className="p-4 mt-4 border rounded-lg border-blue-200 bg-blue-50">
                  <Checkbox
                    checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                    className="text-sm"
                  >
                    <span className="text-slate-700">
                      Tôi đồng ý nhận email marketing từ Booking.com, bao gồm khuyến mãi, đề xuất 
                      được cá nhân hóa, lời khen thưởng, trải nghiệm du lịch và các cập nhật về 
                      sản phẩm và dịch vụ của Booking.com.
                    </span>
                  </Checkbox>
                </div>

                <p className="mt-4 text-xs text-slate-600">
                  Về dữ liệu cá nhận của bạn, xin vui lòng tham khảo{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    chính sách về quyền riêng tư
                  </a>
                  {" "}và{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    cookie
                  </a>
                  . Về phương thức thanh toán, xin vui lòng xem{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    điều khoản và điều kiện chung
                  </a>
                  {" "}của chúng tôi.
                </p>
              </Card>

              {/* Complete Booking Button */}
              <Button
                type="primary"
                size="large"
                block
                onClick={handleCompleteBooking}
                loading={loading}
                disabled={loading}
                className="checkout-submit-btn"
                icon={<SafetyOutlined />}
              >
                {paymentMethod === "vnpay" 
                  ? "Thanh toán qua VNPay" 
                  : "Hoàn tất đặt phòng"}
              </Button>

              <p className="mt-4 text-sm text-center text-slate-600">
                Có câu hỏi về đặt phòng này của bạn?{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Các câu hỏi được gửi phát sinh về đặt chỗ
                </a>
              </p>
            </div>

            {/* Right Column - Price Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="checkout-card checkout-price-card">
                  <h3 className="mb-4 text-lg font-bold text-slate-800">
                    Tóm tắt giá
                  </h3>

                  <Divider className="my-4" />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Giá gốc</span>
                      <span className="line-through text-slate-500">
                        VND {bookingData.originalPrice.toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Bao gồm VND 22.546 phí giảm giá</span>
                      <span className="text-red-600">
                        -VND {bookingData.discount.toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">8 % Thuế GTT</span>
                      <span className="text-slate-800">
                        VND {bookingData.taxesAndFees.toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-base font-bold text-slate-800">Tổng cộng</span>
                    <span className="text-2xl font-bold text-slate-900">
                      VND {bookingData.total.toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <p className="mb-4 text-xs text-slate-600">
                    Đã bao gồm thuế và phí một lần
                  </p>

                  <div className="p-3 border rounded-lg border-slate-200 bg-slate-50">
                    <p className="mb-2 text-sm font-semibold text-slate-800">
                      Thông tin giá
                    </p>
                    <ul className="space-y-1 text-xs text-slate-600">
                      <li>• Bao gồm VND 22.546 phí giảm các phí giữ lại</li>
                      <li>• 8% Thuế VAT</li>
                    </ul>
                  </div>

                  <Divider className="my-4" />

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Ảo địa lợi phí về thêm không?
                    </h4>
                    <p className="text-xs text-slate-600">
                      Nội dung này có nhiều định hướng hơn khi ấn vào phí trước khi thanh toán xác
                    </p>
                  </div>

                  <Divider className="my-4" />

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Chi phí khi lựa hệ bao nhiêu?
                    </h4>
                    <p className="text-xs text-slate-600">
                      Ảo đề cập trước 7 ngày trước ba đề về càng đặc biệt của chọn từ không có thính
                    </p>
                  </div>

                  <Divider className="my-4" />

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Chi tiết thanh toán của bạn
                    </h4>
                    <p className="text-xs text-slate-600">
                      Việc thanh toán sẽ được xử lấy nghỉ cụ thử dịch sàn định sử dịch vụ cùng 
                      Booking.com
                    </p>
                    <p className="text-xs font-medium text-slate-800">
                      VND {bookingData.total.toLocaleString('vi-VN')}
                    </p>
                  </div>

                  <Divider className="my-4" />

                  <div className="p-3 border rounded-lg border-yellow-200 bg-yellow-50">
                    <p className="text-xs text-yellow-800">
                      ⚠️ Bạn có mã khuyến mãi ra không?
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
}
