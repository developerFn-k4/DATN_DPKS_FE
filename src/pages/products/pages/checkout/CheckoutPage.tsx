import { useState } from "react";
import { Card, Steps, Divider, Radio, message, Spin } from "antd";
import {
  CreditCardOutlined,
  SafetyOutlined,
  BankOutlined,
  HomeOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import { HomeHeader } from "../../../../components/Header/HomeHeader";
import { HomeFooter } from "../../../../components/Footer/HomeFooter";
import { paymentService, type PaymentMethod } from "../../../../services/payment/paymentService";
import "./style.less";

const steps = [
  { title: "Bạn chọn" },
  { title: "Chi tiết về bạn" },
  { title: "Hoàn tất đặt phòng" },
];

const METHOD_LABELS: Record<PaymentMethod, string> = {
  vnpay: "Thanh toán qua VNPay",
  momo: "Thanh toán qua MoMo",
  cash: "Thanh toán tiền mặt tại khách sạn",
};

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingIdParam = searchParams.get("bookingId");
  const bookingId = bookingIdParam ? parseInt(bookingIdParam, 10) : null;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("vnpay");
  const [loading, setLoading] = useState(false);

  const handleCompleteBooking = async () => {
    if (!bookingId || isNaN(bookingId)) {
      message.error("Không tìm thấy mã đặt phòng. Vui lòng quay lại và thử lại.");
      return;
    }

    try {
      setLoading(true);
      const response = await paymentService.checkout(bookingId, paymentMethod);

      if (!response.success && !response.payment_url) {
        message.error(response.message || "Thanh toán thất bại. Vui lòng thử lại.");
        return;
      }

      if (paymentMethod === "cash") {
        // Cash: server confirms immediately, redirect to result page
        message.success("Đặt phòng thành công!");
        navigate(`/payment-return?method=cash&booking_id=${bookingId}&status=success`);
        return;
      }

      // vnpay / momo: redirect to gateway URL
      if (response.payment_url) {
        message.loading("Đang chuyển đến cổng thanh toán...", 1.5);
        window.location.href = response.payment_url;
      } else {
        message.error(response.message || "Không nhận được URL thanh toán từ máy chủ.");
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || err.message || "Có lỗi xảy ra khi thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingId || isNaN(bookingId)) {
    return (
      <div className="checkout-page">
        <HomeHeader />
        <div className="py-20 text-center text-red-500">
          Thiếu mã đặt phòng. Vui lòng quay lại trang đặt phòng.
        </div>
        <HomeFooter />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <HomeHeader />

      <div className="bg-white border-b">
        <div className="py-6 checkout-container">
          <Steps current={2} items={steps} className="checkout-steps" />
        </div>
      </div>

      <div className="py-8 bg-slate-50">
        <div className="checkout-container max-w-2xl mx-auto">
          <Card className="checkout-card">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CreditCardOutlined />
              Chọn phương thức thanh toán
            </h2>

            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full"
            >
              <div className="space-y-3">
                {/* VNPay */}
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
                  <div className="ml-6 p-3 border border-blue-200 bg-blue-50 rounded-lg text-sm text-slate-600">
                    Hỗ trợ thẻ ATM nội địa, Visa/Mastercard và ví VNPay. Bảo mật 100%.
                  </div>
                )}

                <Divider className="my-2" />

                {/* MoMo */}
                <Radio value="momo" className="w-full">
                  <div className="flex items-center gap-2">
                    <WalletOutlined className="text-lg text-pink-500" />
                    <span className="font-medium">Thanh toán qua MoMo</span>
                  </div>
                </Radio>
                {paymentMethod === "momo" && (
                  <div className="ml-6 p-3 border border-pink-200 bg-pink-50 rounded-lg text-sm text-slate-600">
                    Quét mã QR hoặc liên kết ví MoMo để thanh toán nhanh chóng.
                  </div>
                )}

                <Divider className="my-2" />

                {/* Cash */}
                <Radio value="cash" className="w-full">
                  <div className="flex items-center gap-2">
                    <HomeOutlined className="text-lg text-green-600" />
                    <span className="font-medium">Thanh toán tiền mặt tại khách sạn</span>
                  </div>
                </Radio>
                {paymentMethod === "cash" && (
                  <div className="ml-6 p-3 border border-green-200 bg-green-50 rounded-lg text-sm text-slate-600">
                    Thanh toán trực tiếp khi nhận phòng. Không cần thẻ ngân hàng.
                  </div>
                )}
              </div>
            </Radio.Group>

            <Divider />

            <button
              type="button"
              onClick={handleCompleteBooking}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base transition-colors"
            >
              {loading ? (
                <><Spin size="small" /> Đang xử lý...</>
              ) : (
                <><SafetyOutlined /> {METHOD_LABELS[paymentMethod]}</>
              )}
            </button>

            <p className="mt-4 text-xs text-center text-slate-500">
              Mã đặt phòng: <strong>#{bookingId}</strong>
            </p>
          </Card>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
}
