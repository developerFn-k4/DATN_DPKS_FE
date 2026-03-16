import React, { useState } from "react";
import { Table, Card, Button, Tag, Modal, Input, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { 
  FiCreditCard, 
  FiEye, 
  FiCheck, 
  FiSearch,
  FiFilter,
  FiDollarSign,
  FiCalendar
} from "react-icons/fi";
import dayjs from "dayjs";

interface Payment {
  id: number;
  booking_id: number;
  room_number: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  status: "pending" | "completed" | "failed" | "refunded";
  transaction_id?: string;
}

const PaymentManagementPage: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");

  // Mock data - sẽ thay bằng API
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      booking_id: 101,
      room_number: "205",
      customer_name: "Nguyễn Văn A",
      customer_email: "vana@gmail.com",
      amount: 2500000,
      payment_method: "credit_card",
      payment_date: "2026-03-15T10:30:00",
      status: "completed",
      transaction_id: "TXN001234567"
    },
    {
      id: 2,
      booking_id: 102,
      room_number: "310",
      customer_name: "Trần Thị B",
      customer_email: "thib@gmail.com",
      amount: 3200000,
      payment_method: "bank_transfer",
      payment_date: "2026-03-15T14:20:00",
      status: "pending",
    },
    {
      id: 3,
      booking_id: 103,
      room_number: "101",
      customer_name: "Lê Văn C",
      customer_email: "levanc@gmail.com",
      amount: 1800000,
      payment_method: "cash",
      payment_date: "2026-03-14T09:15:00",
      status: "completed",
      transaction_id: "TXN001234568"
    },
    {
      id: 4,
      booking_id: 104,
      room_number: "408",
      customer_name: "Phạm Thị D",
      customer_email: "phamthid@gmail.com",
      amount: 4500000,
      payment_method: "e_wallet",
      payment_date: "2026-03-14T16:45:00",
      status: "failed",
    },
    {
      id: 5,
      booking_id: 105,
      room_number: "202",
      customer_name: "Hoàng Văn E",
      customer_email: "hoangvane@gmail.com",
      amount: 2800000,
      payment_method: "credit_card",
      payment_date: "2026-03-13T11:20:00",
      status: "refunded",
      transaction_id: "TXN001234569"
    }
  ]);

  const handleConfirmPayment = (id: number) => {
    setPayments(payments.map(payment => 
      payment.id === id ? { ...payment, status: "completed", transaction_id: `TXN${Date.now()}` } : payment
    ));
    message.success("Đã xác nhận thanh toán");
    setIsModalVisible(false);
  };

  const showPaymentDetail = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "completed":
        return <Tag color="success">Hoàn thành</Tag>;
      case "pending":
        return <Tag color="warning">Chờ xử lý</Tag>;
      case "failed":
        return <Tag color="error">Thất bại</Tag>;
      case "refunded":
        return <Tag color="purple">Đã hoàn tiền</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Thẻ tín dụng";
      case "bank_transfer":
        return "Chuyển khoản";
      case "cash":
        return "Tiền mặt";
      case "e_wallet":
        return "Ví điện tử";
      default:
        return method;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchSearch = 
      payment.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
      payment.room_number.includes(searchText) ||
      payment.booking_id.toString().includes(searchText);
    
    const matchStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchMethod = filterMethod === "all" || payment.payment_method === filterMethod;

    return matchSearch && matchStatus && matchMethod;
  });

  const columns: ColumnsType<Payment> = [
    {
      title: "Mã TT",
      dataIndex: "id",
      key: "id",
      width: 60,
      sorter: (a, b) => a.id - b.id,
      render: (id: number) => <span className="font-mono text-slate-700 text-sm">#{id}</span>
    },
    {
      title: "Mã BK",
      dataIndex: "booking_id",
      key: "booking_id",
      width: 70,
      render: (id: number) => <span className="font-mono text-emerald-600 text-sm">BK{id}</span>
    },
    {
      title: "Phòng",
      dataIndex: "room_number",
      key: "room_number",
      width: 75,
      render: (room: string) => (
        <span className="font-semibold text-slate-800 text-sm">P.{room}</span>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 140,
      render: (_, record) => (
        <div>
          <p className="font-medium text-slate-800 text-sm">{record.customer_name}</p>
          <p className="text-xs text-slate-500">{record.customer_email}</p>
        </div>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      width: 110,
      render: (amount: number) => (
        <span className="font-bold text-emerald-600 text-sm">
          {amount.toLocaleString()} ₫
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "PT",
      dataIndex: "payment_method",
      key: "payment_method",
      width: 100,
      render: (method: string) => (
        <Tag color="blue" className="text-xs">{getMethodText(method)}</Tag>
      ),
      filters: [
        { text: "Thẻ tín dụng", value: "credit_card" },
        { text: "Chuyển khoản", value: "bank_transfer" },
        { text: "Tiền mặt", value: "cash" },
        { text: "Ví điện tử", value: "e_wallet" },
      ],
      onFilter: (value, record) => record.payment_method === value,
    },
    {
      title: "Ngày TT",
      dataIndex: "payment_date",
      key: "payment_date",
      width: 100,
      render: (date: string) => (
        <span className="text-xs text-slate-600">
          {dayjs(date).format("DD/MM/YY HH:mm")}
        </span>
      ),
      sorter: (a, b) => dayjs(a.payment_date).unix() - dayjs(b.payment_date).unix(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 95,
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: "Hoàn thành", value: "completed" },
        { text: "Chờ xử lý", value: "pending" },
        { text: "Thất bại", value: "failed" },
        { text: "Đã hoàn tiền", value: "refunded" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Hành động",
      key: "action",
      width: 70,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="link"
          icon={<FiEye />}
          onClick={() => showPaymentDetail(record)}
          size="small"
        >
          Xem
        </Button>
      ),
    },
  ];

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    { 
      label: "Tổng giao dịch", 
      value: payments.length, 
      color: "text-blue-600",
      icon: <FiCreditCard className="text-2xl" />,
      bgColor: "bg-blue-50"
    },
    { 
      label: "Tổng doanh thu", 
      value: `${totalAmount.toLocaleString()} ₫`, 
      color: "text-green-600",
      icon: <FiDollarSign className="text-2xl" />,
      bgColor: "bg-green-50"
    },
    { 
      label: "Đã thanh toán", 
      value: `${completedAmount.toLocaleString()} ₫`, 
      color: "text-emerald-600",
      icon: <FiCheck className="text-2xl" />,
      bgColor: "bg-emerald-50"
    },
    { 
      label: "Chờ xử lý", 
      value: `${pendingAmount.toLocaleString()} ₫`, 
      color: "text-yellow-600",
      icon: <FiCalendar className="text-2xl" />,
      bgColor: "bg-yellow-50"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <FiCreditCard className="text-emerald-600" />
          Quản lý thanh toán
        </h1>
        <p className="text-slate-500 mt-1">Quản lý và theo dõi các giao dịch thanh toán</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm border-0 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-0 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Tìm kiếm theo tên, phòng, mã booking..."
            prefix={<FiSearch className="text-slate-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="md:w-96"
            size="large"
          />
          <Select
            placeholder="Lọc theo trạng thái"
            value={filterStatus}
            onChange={setFilterStatus}
            className="md:w-48"
            size="large"
            suffixIcon={<FiFilter />}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="pending">Chờ xử lý</Select.Option>
            <Select.Option value="completed">Hoàn thành</Select.Option>
            <Select.Option value="failed">Thất bại</Select.Option>
            <Select.Option value="refunded">Đã hoàn tiền</Select.Option>
          </Select>
          <Select
            placeholder="Phương thức"
            value={filterMethod}
            onChange={setFilterMethod}
            className="md:w-48"
            size="large"
          >
            <Select.Option value="all">Tất cả phương thức</Select.Option>
            <Select.Option value="credit_card">Thẻ tín dụng</Select.Option>
            <Select.Option value="bank_transfer">Chuyển khoản</Select.Option>
            <Select.Option value="cash">Tiền mặt</Select.Option>
            <Select.Option value="e_wallet">Ví điện tử</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredPayments}
          rowKey="id"
          size="middle"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} giao dịch`,
            showSizeChanger: true,
          }}
          scroll={{ x: 820 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-bold">
            <FiCreditCard className="text-emerald-600" />
            Chi tiết thanh toán
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Mã thanh toán</p>
                <p className="font-mono font-semibold text-slate-800">#{selectedPayment.id}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Mã booking</p>
                <p className="font-mono font-semibold text-emerald-600">BK{selectedPayment.booking_id}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Phòng</p>
              <p className="font-semibold text-slate-800">Phòng {selectedPayment.room_number}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Khách hàng</p>
              <p className="font-semibold text-slate-800">{selectedPayment.customer_name}</p>
              <p className="text-sm text-slate-500">{selectedPayment.customer_email}</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-600 mb-1">Số tiền thanh toán</p>
              <p className="text-2xl font-bold text-emerald-700">
                {selectedPayment.amount.toLocaleString()} ₫
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-2">Phương thức thanh toán</p>
              <Tag color="blue" className="text-sm">{getMethodText(selectedPayment.payment_method)}</Tag>
            </div>

            {selectedPayment.transaction_id && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Mã giao dịch</p>
                <p className="font-mono text-slate-700">{selectedPayment.transaction_id}</p>
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Ngày thanh toán</p>
              <p className="text-slate-700">
                {dayjs(selectedPayment.payment_date).format("DD/MM/YYYY HH:mm")}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-2">Trạng thái</p>
              {getStatusTag(selectedPayment.status)}
            </div>

            {selectedPayment.status === "pending" && (
              <div className="pt-4">
                <Button
                  type="primary"
                  icon={<FiCheck />}
                  onClick={() => handleConfirmPayment(selectedPayment.id)}
                  className="w-full bg-green-600 hover:bg-green-700 h-10"
                >
                  Xác nhận thanh toán
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentManagementPage;
