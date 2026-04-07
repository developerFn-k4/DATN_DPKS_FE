import React, { useEffect, useState } from "react";
import { Card, Spin, Descriptions, Tag, Divider, Typography } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVNPayReturn } from "../hooks/UserVNPayReturn";
import PaymentResult from "../components/PaymentResuilt";
import { HomeFooter } from "../../../../../components/Footer/HomeFooter";
import { HomeHeader } from "../../../../../components/Header/HomeHeader";

const formatDate = (date?: string | null) => {
  if (!date) return "";
  return `${date.slice(6, 8)}/${date.slice(4, 6)}/${date.slice(0, 4)} ${date.slice(8, 10)}:${date.slice(10, 12)}`;
};

const PaymentReturnPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState<any>(null);

  const { loading, success, data } = useVNPayReturn(params);

  useEffect(() => {
    const raw = sessionStorage.getItem("vietstay_booking_info");
    if (raw) {
      try {
        setBookingInfo(JSON.parse(raw));
      } catch {
        setBookingInfo(null);
      }
    }
  }, []);

  if (loading) return <Spin fullscreen />;

  return (
    <>
      <HomeHeader />
      <div
        style={{
          maxWidth: 1100,
          margin: "60px auto",
          padding: "0 16px",
        }}
      >
        <Card
          style={{
            borderRadius: 18,
            boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
          }}
          bodyStyle={{ padding: 32 }}
        >
          <div style={{ marginBottom: 24 }}>
            <PaymentResult
              success={success}
              onHome={() => navigate("/")}
              onBooking={() => navigate("/booking")}
            />
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <Card
              type="inner"
              title="Thông tin đơn hàng"
              style={{ borderRadius: 16 }}
            >
              <Descriptions
                bordered
                column={1}
                size="middle"
                labelStyle={{ fontWeight: 600, width: 200 }}
                contentStyle={{ fontSize: 16 }}
              >
                <Descriptions.Item label="Mã giao dịch">
                  {params.get("vnp_TransactionNo") || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Mã đơn / Order Info">
                  {params.get("vnp_OrderInfo") || params.get("vnp_TxnRef") || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Mã đơn thanh toán">
                  {params.get("vnp_TxnRef") || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền">
                  <span style={{ fontSize: 18, fontWeight: 600 }}>
                    {Number(params.get("vnp_Amount") || 0).toLocaleString()} VND
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Ngân hàng">
                  {params.get("vnp_BankCode") || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Loại thẻ">
                  {params.get("vnp_CardType") || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian thanh toán">
                  {formatDate(params.get("vnp_PayDate")) || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {success ? (
                    <Tag color="green" style={{ fontSize: 14, padding: "4px 12px" }}>
                      Thành công
                    </Tag>
                  ) : (
                    <Tag color="red" style={{ fontSize: 14, padding: "4px 12px" }}>
                      Thất bại
                    </Tag>
                  )}
                </Descriptions.Item>
                {data?.message && (
                  <Descriptions.Item label="Thông báo từ hệ thống">
                    {data.message}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            <Card
              type="inner"
              title="Thông tin khách hàng"
              style={{ borderRadius: 16 }}
            >
              {bookingInfo ? (
                <Descriptions
                  bordered
                  column={1}
                  size="middle"
                  labelStyle={{ fontWeight: 600, width: 200 }}
                  contentStyle={{ fontSize: 16 }}
                >
                  <Descriptions.Item label="Họ và tên">
                    {bookingInfo.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {bookingInfo.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {bookingInfo.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phòng đặt">
                    {bookingInfo.roomName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian lưu trú">
                    {bookingInfo.checkIn} → {bookingInfo.checkOut}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số đêm">
                    {bookingInfo.nights}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng thanh toán">
                    <span style={{ fontWeight: 600 }}>
                      {Number(bookingInfo.totalPrice || 0).toLocaleString()} VND
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Typography.Text type="secondary">
                  Không có thông tin khách hàng lưu trữ. Nếu bạn vừa được chuyển về từ trang thanh toán, vui lòng quay về trang chủ hoặc kiểm tra đơn hàng.
                </Typography.Text>
              )}
            </Card>
          </div>
        </Card>
      </div>
      <HomeFooter />
    </>
  );
};

export default PaymentReturnPage;