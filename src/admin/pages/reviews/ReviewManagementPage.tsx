import React, { useState } from "react";
import { Table, Card, Button, Tag, Rate, Modal, Input, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { 
  FiStar, 
  FiEye, 
  FiCheck, 
  FiX, 
  FiSearch,
  FiFilter
} from "react-icons/fi";
import dayjs from "dayjs";

interface Review {
  id: number;
  room_number: string;
  room_name: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  comment: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
}

const ReviewManagementPage: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock data - sẽ thay bằng API
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      room_number: "101",
      room_name: "Standard Room",
      customer_name: "Nguyễn Văn A",
      customer_email: "vana@gmail.com",
      rating: 5,
      comment: "Phòng rất sạch sẽ và thoáng mát. Nhân viên phục vụ nhiệt tình. Tôi rất hài lòng với dịch vụ.",
      created_at: "2026-03-15T10:30:00",
      status: "approved"
    },
    {
      id: 2,
      room_number: "205",
      room_name: "Deluxe Room",
      customer_name: "Trần Thị B",
      customer_email: "thib@gmail.com",
      rating: 4,
      comment: "Phòng đẹp, view tốt. Tuy nhiên điều hòa hơi yếu.",
      created_at: "2026-03-15T14:20:00",
      status: "pending"
    },
    {
      id: 3,
      room_number: "310",
      room_name: "Suite Room",
      customer_name: "Lê Văn C",
      customer_email: "levanc@gmail.com",
      rating: 3,
      comment: "Phòng hơi cũ, cần sửa chữa lại. Giá cả không tương xứng với chất lượng.",
      created_at: "2026-03-14T09:15:00",
      status: "pending"
    },
    {
      id: 4,
      room_number: "102",
      room_name: "Standard Room",
      customer_name: "Phạm Thị D",
      customer_email: "phamthid@gmail.com",
      rating: 5,
      comment: "Rất tốt! Sẽ quay lại lần sau.",
      created_at: "2026-03-14T16:45:00",
      status: "approved"
    },
    {
      id: 5,
      room_number: "408",
      room_name: "VIP Room",
      customer_name: "Hoàng Văn E",
      customer_email: "hoangvane@gmail.com",
      rating: 2,
      comment: "Phòng không đúng như hình ảnh quảng cáo. Rất thất vọng.",
      created_at: "2026-03-13T11:20:00",
      status: "rejected"
    }
  ]);

  const handleApprove = (id: number) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: "approved" } : review
    ));
    message.success("Đã phê duyệt đánh giá");
    setIsModalVisible(false);
  };

  const handleReject = (id: number) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: "rejected" } : review
    ));
    message.success("Đã từ chối đánh giá");
    setIsModalVisible(false);
  };

  const showReviewDetail = (review: Review) => {
    setSelectedReview(review);
    setIsModalVisible(true);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "approved":
        return <Tag color="success">Đã duyệt</Tag>;
      case "pending":
        return <Tag color="warning">Chờ duyệt</Tag>;
      case "rejected":
        return <Tag color="error">Từ chối</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchSearch = 
      review.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
      review.room_number.includes(searchText) ||
      review.comment.toLowerCase().includes(searchText.toLowerCase());
    
    const matchStatus = filterStatus === "all" || review.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const columns: ColumnsType<Review> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 40,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Phòng",
      key: "room",
      width: 100,
      render: (_, record) => (
        <div>
          <p className="font-semibold text-slate-800 text-sm">P{record.room_number}</p>
          <p className="text-xs text-slate-500">{record.room_name}</p>
        </div>
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
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 110,
      render: (rating: number) => <Rate disabled value={rating} className="text-xs" />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Nội dung",
      dataIndex: "comment",
      key: "comment",
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <p className="text-slate-600 text-sm">{text}</p>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "created_at",
      key: "created_at",
      width: 100,
      render: (date: string) => (
        <span className="text-xs text-slate-600">
          {dayjs(date).format("DD/MM/YY HH:mm")}
        </span>
      ),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: "Đã duyệt", value: "approved" },
        { text: "Chờ duyệt", value: "pending" },
        { text: "Từ chối", value: "rejected" },
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
          onClick={() => showReviewDetail(record)}
          size="small"
        >
          Xem
        </Button>
      ),
    },
  ];

  const stats = [
    { label: "Tổng đánh giá", value: reviews.length, color: "text-blue-600" },
    { label: "Chờ duyệt", value: reviews.filter(r => r.status === "pending").length, color: "text-yellow-600" },
    { label: "Đã duyệt", value: reviews.filter(r => r.status === "approved").length, color: "text-green-600" },
    { label: "Đánh giá TB", value: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1), color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <FiStar className="text-emerald-600" />
          Quản lý đánh giá
        </h1>
        <p className="text-slate-500 mt-1">Quản lý và phê duyệt đánh giá từ khách hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm border-0 rounded-xl">
            <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-0 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Tìm kiếm theo tên, phòng, nội dung..."
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
            <Select.Option value="pending">Chờ duyệt</Select.Option>
            <Select.Option value="approved">Đã duyệt</Select.Option>
            <Select.Option value="rejected">Từ chối</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredReviews}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} đánh giá`,
            showSizeChanger: true,
          }}
          scroll={{ x: 850 }}
          size="middle"
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-bold">
            <FiStar className="text-emerald-600" />
            Chi tiết đánh giá
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedReview && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Phòng</p>
              <p className="font-semibold text-slate-800">
                Phòng {selectedReview.room_number} - {selectedReview.room_name}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Khách hàng</p>
              <p className="font-semibold text-slate-800">{selectedReview.customer_name}</p>
              <p className="text-sm text-slate-500">{selectedReview.customer_email}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-2">Đánh giá</p>
              <Rate disabled value={selectedReview.rating} />
              <span className="ml-2 font-semibold text-slate-700">
                {selectedReview.rating}/5
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-2">Nội dung đánh giá</p>
              <p className="text-slate-700 leading-relaxed">{selectedReview.comment}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Ngày đánh giá</p>
              <p className="text-slate-700">
                {dayjs(selectedReview.created_at).format("DD/MM/YYYY HH:mm")}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-2">Trạng thái</p>
              {getStatusTag(selectedReview.status)}
            </div>

            {selectedReview.status === "pending" && (
              <div className="flex gap-2 pt-4">
                <Button
                  type="primary"
                  icon={<FiCheck />}
                  onClick={() => handleApprove(selectedReview.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 h-10"
                >
                  Phê duyệt
                </Button>
                <Button
                  danger
                  icon={<FiX />}
                  onClick={() => handleReject(selectedReview.id)}
                  className="flex-1 h-10"
                >
                  Từ chối
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewManagementPage;
