import React from 'react';
import { Result, Button } from 'antd';

// Bước quan trọng nhất: Định nghĩa danh sách các props mà Component này chấp nhận
interface PaymentResultProps {
  success: boolean;
  onHome: () => void;
  onBooking: () => void;
}

const PaymentResult: React.FC<PaymentResultProps> = ({ success, onHome, onBooking }) => {
  return (
    <Result
      status={success ? "success" : "error"}
      title={success ? "Thanh Toán Thành Công!" : "Thanh Toán Thất Bại"}
      subTitle={success 
        ? "Hệ thống đã xác nhận thanh toán của bạn. Thông tin chi tiết đã được lưu trữ." 
        : "Giao dịch không thành công. Vui lòng kiểm tra lại số dư hoặc thẻ ngân hàng."
      }
      extra={[
        <Button type="primary" key="home" onClick={onHome} shape="round">
          Về trang chủ
        </Button>,
        <Button key="booking" onClick={onBooking} shape="round">
          Đơn hàng của tôi
        </Button>,
      ]}
    />
  );
};

export default PaymentResult;