import React, { useEffect, useState } from "react";
import { Card, Spin, Descriptions, Tag, Typography, Divider } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVNPayReturn } from "../hooks/UserVNPayReturn";
import PaymentResult from "../components/PaymentResuilt"; 
import { HomeFooter } from "../../../../../components/Footer/HomeFooter";
import { HomeHeader } from "../../../../../components/Header/HomeHeader";

const formatDate = (date?: string | null) => {
  if (!date || date.length < 12) return "-";
  // VNPAY Date format: yyyyMMddHHmmss
  return `${date.slice(6, 8)}/${date.slice(4, 6)}/${date.slice(0, 4)} ${date.slice(8, 10)}:${date.slice(10, 12)}`;
};

const PaymentReturnPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState<any>(null);

  // 'data' ở đây chính là các params mà BE đã redirect về
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

  if (loading) return <Spin fullscreen tip="Đang xác thực giao dịch..." />;

  return (
    <>
      <HomeHeader />
      <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 16px" }}>
        <Card
          style={{ borderRadius: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
          styles={{ body: { padding: 40 } }}
        >
          <PaymentResult
            success={success}
            onHome={() => navigate("/")}
            onBooking={() => navigate("/booking")}
          />

          <Divider orientation={"left" as any}>Chi tiết giao dịch</Divider>

          <div style={{ display: "grid", gap: 30 }}>
            {/* PHẦN 1: THÔNG TIN THANH TOÁN TỪ BE/VNPAY */}
            <Card type="inner" title="Thông tin hóa đơn" style={{ borderRadius: 12 }}>
              <Descriptions bordered column={1} labelStyle={{ fontWeight: 600, width: 220 }}>
                <Descriptions.Item label="Mã đơn hàng (Order ID)">
                  <span style={{ fontWeight: 700, color: '#1677ff' }}>{data?.order_id || "-"}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Mã giao dịch VNPAY">
                  {data?.transaction_id || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền đã thanh toán">
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#cf1322' }}>
                    {Number(data?.amount || 0).toLocaleString()} VND
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Ngân hàng / Loại thẻ">
                  <Tag color="blue">{data?.bank}</Tag> / {data?.card_type}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian giao dịch">
                  {formatDate(data?.pay_date)}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái hệ thống">
                  {success ? (
                    <Tag color="green">Giao dịch thành công</Tag>
                  ) : (
                    <Tag color="red">{data?.message || "Giao dịch thất bại"}</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* PHẦN 2: THÔNG TIN KHÁCH ĐẶT (LẤY TỪ SESSIONSTORAGE) */}
            {bookingInfo ? (
              <Card type="inner" title="Thông tin đặt phòng" style={{ borderRadius: 12 }}>
                <Descriptions bordered column={1} labelStyle={{ fontWeight: 600, width: 220 }}>
                  <Descriptions.Item label="Khách hàng">
                    {bookingInfo.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên phòng">
                    {bookingInfo.roomName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian lưu trú">
                    <Tag color="orange">{bookingInfo.checkIn}</Tag> đến <Tag color="orange">{bookingInfo.checkOut}</Tag>
                    <span style={{ marginLeft: 8 }}>({bookingInfo.nights} đêm)</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng phòng">
                    {bookingInfo.roomCount} phòng
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            ) : (
              <Typography.Text type="secondary" italic>
                Lưu ý: Không tìm thấy thông tin khách hàng trong phiên làm việc hiện tại.
              </Typography.Text>
            )}
          </div>
        </Card>
      </div>
      <HomeFooter />
    </>
  );
};

export default PaymentReturnPage;