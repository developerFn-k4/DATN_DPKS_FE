import React from "react";
import { Spin, Tag, Descriptions, Divider, Card, Alert } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircleFilled, CloseCircleFilled, HomeFilled, UnorderedListOutlined } from "@ant-design/icons";
import { usePaymentReturn } from "../hooks/UserVNPayReturn";
import { HomeFooter } from "../../../../../components/Footer/HomeFooter";
import { HomeHeader } from "../../../../../components/Header/HomeHeader";

const METHOD_LABEL: Record<string, string> = {
  vnpay: "VNPay",
  momo: "MoMo",
  cash: "Tiền mặt",
};

const PaymentReturnPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loading, success, data, error } = usePaymentReturn(params);

  if (loading) {
    return (
      <>
        <HomeHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spin size="large" tip="Đang xác thực giao dịch..." />
        </div>
        <HomeFooter />
      </>
    );
  }

  return (
    <>
      <HomeHeader />
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Status banner */}
        <div className={`rounded-2xl p-8 text-center mb-8 shadow-md ${success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          {success ? (
            <CheckCircleFilled className="text-6xl text-green-500 mb-4 block" />
          ) : (
            <CloseCircleFilled className="text-6xl text-red-400 mb-4 block" />
          )}
          <h1 className={`text-2xl font-black mb-2 ${success ? "text-green-700" : "text-red-600"}`}>
            {success ? "Thanh toán thành công!" : "Thanh toán thất bại"}
          </h1>
          <p className="text-slate-500 text-sm">
            {success
              ? "Hệ thống đã xác nhận thanh toán của bạn. Chúng tôi sẽ gửi email xác nhận đặt phòng sớm nhất."
              : "Giao dịch không thành công. Vui lòng kiểm tra lại hoặc thử phương thức thanh toán khác."}
          </p>

          {error && (
            <Alert message={error} type="warning" showIcon className="mt-4 text-left" />
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
            >
              <HomeFilled /> Về trang chủ
            </button>
            <button
              type="button"
              onClick={() => navigate("/my-bookings")}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-green-600 text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors"
            >
              <UnorderedListOutlined /> Xem đơn đặt phòng
            </button>
            {!success && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Thử lại
              </button>
            )}
          </div>
        </div>

        {/* Transaction detail */}
        {data && (
          <Card
            className="rounded-2xl shadow-sm"
            title={<span className="font-bold text-slate-700">Chi tiết giao dịch</span>}
          >
            <Descriptions bordered column={1} labelStyle={{ fontWeight: 600, width: 200 }}>
              {data.order_id && (
                <Descriptions.Item label="Mã đơn hàng">
                  <span className="font-bold text-blue-600">{data.order_id}</span>
                </Descriptions.Item>
              )}
              {data.booking_id && (
                <Descriptions.Item label="Mã đặt phòng">#{data.booking_id}</Descriptions.Item>
              )}
              {data.amount !== undefined && (
                <Descriptions.Item label="Số tiền thanh toán">
                  <span className="text-lg font-bold text-red-600">
                    {Number(data.amount).toLocaleString("vi-VN")} VND
                  </span>
                </Descriptions.Item>
              )}
              {data.method && (
                <Descriptions.Item label="Phương thức">
                  <Tag color="blue">{METHOD_LABEL[data.method] ?? data.method}</Tag>
                </Descriptions.Item>
              )}
              {data.transaction_id && (
                <Descriptions.Item label="Mã giao dịch">{data.transaction_id}</Descriptions.Item>
              )}
              {data.bank && (
                <Descriptions.Item label="Ngân hàng">
                  <Tag color="geekblue">{data.bank}</Tag>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Trạng thái">
                {success ? (
                  <Tag color="success">Thành công</Tag>
                ) : (
                  <Tag color="error">{data.message || "Thất bại"}</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>

            {/* Booking info */}
            {data.booking && (
              <>
                <Divider orientation="left">Thông tin đặt phòng</Divider>
                <Descriptions bordered column={1} labelStyle={{ fontWeight: 600, width: 200 }}>
                  <Descriptions.Item label="Khách hàng">{data.booking.name}</Descriptions.Item>
                  {data.booking.room_name && (
                    <Descriptions.Item label="Loại phòng">{data.booking.room_name}</Descriptions.Item>
                  )}
                  <Descriptions.Item label="Nhận phòng">
                    <Tag color="orange">{data.booking.check_in}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trả phòng">
                    <Tag color="orange">{data.booking.check_out}</Tag>
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}
          </Card>
        )}
      </div>
      <HomeFooter />
    </>
  );
};

export default PaymentReturnPage;
