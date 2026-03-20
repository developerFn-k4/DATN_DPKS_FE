import React from "react";
import { Card, Spin, Descriptions, Tag } from "antd";
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

  const { loading, success } = useVNPayReturn(params);

  if (loading) return <Spin fullscreen />;

  return (
     <>
    <HomeHeader />
    <div
      style={{
        maxWidth: 1000,
        margin: "60px auto", 
        padding: "0 16px",
      }}
    >
      <Card
        style={{
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)", 
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

        <Descriptions
          bordered
          column={1}
          size="middle"
          labelStyle={{ fontWeight: 600, width: 180 }} 
          contentStyle={{ fontSize: 16 }} 
        >
          <Descriptions.Item label="Mã đơn">
            {params.get("vnp_TxnRef")}
          </Descriptions.Item>

          <Descriptions.Item label="Số tiền">
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {Number(params.get("vnp_Amount") || 0).toLocaleString()} VND
            </span>
          </Descriptions.Item>

          <Descriptions.Item label="Ngân hàng">
            {params.get("vnp_BankCode")}
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian">
            {formatDate(params.get("vnp_PayDate"))}
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
        </Descriptions>
      </Card>
    </div>
    <HomeFooter />
  </>
  );
};

export default PaymentReturnPage;