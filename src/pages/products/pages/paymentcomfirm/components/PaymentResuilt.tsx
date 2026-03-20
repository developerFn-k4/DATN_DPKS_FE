import React from "react";
import { Result, Button } from "antd";

interface Props {
  success: boolean;
  onHome: () => void;
  onBooking: () => void;
}

const PaymentResult: React.FC<Props> = ({ success, onHome, onBooking }) => {
  return (
    <Result
      status={success ? "success" : "error"}
      title={
        success ? "Thanh toán thành công 🎉" : "Thanh toán thất bại ❌"
      }
      subTitle={
        success
          ? "Cảm ơn bạn đã thanh toán"
          : "Vui lòng thử lại"
      }
      extra={[
        <Button type="primary" onClick={onHome} key="home">
          Trang chủ
        </Button>,
        <Button onClick={onBooking} key="booking">
          Đơn của tôi
        </Button>,
      ]}
    />
  );
};

export default PaymentResult;
