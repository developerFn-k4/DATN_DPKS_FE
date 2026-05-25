import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { bookingApi, type Booking } from "../../../services/adminApi";

interface Payment {
  id: number;
  booking_id: number;
  room_number: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  status: "pending" | "success" | "failed" | "refunded";
  transaction_id?: string;
}
const toPaymentRows = (bookings: Booking[]): Payment[] => {
  return bookings
    .filter((booking) => !!booking.payment)
    .map((booking) => ({
      id: booking.payment.id,
      booking_id: booking.id,
      room_number: booking.booking_rooms?.[0]?.room?.room_number ?? "-",
      customer_name: booking.name,
      customer_email: booking.email,
      amount: Number(booking.payment.amount ?? booking.total_price ?? 0),
      payment_method: booking.payment.method,
      payment_date: booking.payment.created_at ?? booking.created_at,
      status: booking.payment.status,
      transaction_id: booking.payment.order_id,
    }));
};

const PaymentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");
const [loading, setLoading] = useState(false);
  // Mock data - sẽ thay bằng API
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await bookingApi.getAll({ page: 1, per_page: 500 });
        const payload = res.data.data;
        const bookings = Array.isArray(payload) ? payload : payload.data;
        setPayments(toPaymentRows(bookings));
      } catch (error: any) {
        message.error(error?.message || "Không thể tải danh sách thanh toán.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);
  const showPaymentDetail = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "success": 
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
        case "vnpay":
        return "VNPay";
      case "momo":
        return "MoMo";
        case "cash":
        return "Tiền mặt";
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
      render: (id: number) => <span className="font-mono text-sm text-slate-700">#{id}</span>
    },
    {
      title: "Mã BK",
      dataIndex: "booking_id",
      key: "booking_id",
      width: 70,
      render: (id: number) => <span className="font-mono text-sm text-emerald-600">BK{id}</span>
    },
    {
      title: "Phòng",
      dataIndex: "room_number",
      key: "room_number",
      width: 75,
      render: (room: string) => (
        <span className="text-sm font-semibold text-slate-800">P.{room}</span>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 140,
      render: (_, record) => (
        <div>
          <p className="text-sm font-medium text-slate-800">{record.customer_name}</p>
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
        <span className="text-sm font-bold text-emerald-600">
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
          { text: "VNPay", value: "vnpay" },
        { text: "MoMo", value: "momo" },
        { text: "Tiền mặt", value: "cash" },
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
         { text: "Hoàn thành", value: "success" },
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
          onClick={() => navigate(`/admin/payments/${record.booking_id}`)}
          size="small"
        >
          Xem
        </Button>
      ),
    },
  ];

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = payments
    .filter(p => p.status === "success")
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
      
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">
          <FiCreditCard className="text-emerald-600" />
          Quản lý thanh toán
        </h1>
        <p className="mt-1 text-slate-500">Quản lý và theo dõi các giao dịch thanh toán</p>
      </div>

    
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm text-slate-500">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

     
      <Card className="border-0 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 md:flex-row">
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
             <Select.Option value="success">Hoàn thành</Select.Option>
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
             <Select.Option value="vnpay">VNPay</Select.Option>
            <Select.Option value="momo">MoMo</Select.Option>
            <Select.Option value="cash">Tiền mặt</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-0 shadow-sm rounded-xl">
        <Table
          columns={columns}
          dataSource={filteredPayments}
            rowKey={(record) => `${record.id}-${record.booking_id}`}
          loading={loading}
          size="middle"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} giao dịch`,
            showSizeChanger: true,
          }}
          scroll={{ x: 820 }}
        />
      </Card>

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
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="mb-1 text-sm text-slate-500">Mã thanh toán</p>
                <p className="font-mono font-semibold text-slate-800">#{selectedPayment.id}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="mb-1 text-sm text-slate-500">Mã booking</p>
                <p className="font-mono font-semibold text-emerald-600">BK{selectedPayment.booking_id}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="mb-1 text-sm text-slate-500">Phòng</p>
              <p className="font-semibold text-slate-800">Phòng {selectedPayment.room_number}</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="mb-1 text-sm text-slate-500">Khách hàng</p>
              <p className="font-semibold text-slate-800">{selectedPayment.customer_name}</p>
              <p className="text-sm text-slate-500">{selectedPayment.customer_email}</p>
            </div>

            <div className="p-4 border rounded-lg bg-emerald-50 border-emerald-200">
              <p className="mb-1 text-sm text-emerald-600">Số tiền thanh toán</p>
              <p className="text-2xl font-bold text-emerald-700">
                {selectedPayment.amount.toLocaleString()} ₫
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="mb-2 text-sm text-slate-500">Phương thức thanh toán</p>
              <Tag color="blue" className="text-sm">{getMethodText(selectedPayment.payment_method)}</Tag>
            </div>

            {selectedPayment.transaction_id && (
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="mb-1 text-sm text-slate-500">Mã giao dịch</p>
                <p className="font-mono text-slate-700">{selectedPayment.transaction_id}</p>
              </div>
            )}

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="mb-1 text-sm text-slate-500">Ngày thanh toán</p>
              <p className="text-slate-700">
                {dayjs(selectedPayment.payment_date).format("DD/MM/YYYY HH:mm")}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="mb-2 text-sm text-slate-500">Trạng thái</p>
              {getStatusTag(selectedPayment.status)}
            </div>

            {selectedPayment.status === "pending" && (
               <div className="pt-4 text-sm text-amber-600">
                Giao dịch đang chờ xử lý từ cổng thanh toán.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentManagementPage;
