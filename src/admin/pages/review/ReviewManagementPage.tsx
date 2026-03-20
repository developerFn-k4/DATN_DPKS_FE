import React, { useState, useEffect } from "react";
import { Table, Card, Button, Tag, Rate, Modal, Input, message, Spin, Popconfirm } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { 
  FiStar, 
  FiEye, 
  FiTrash2,
  FiSearch
} from "react-icons/fi";
import dayjs from "dayjs";
import { deleteReview, fetchReviewDetail, fetchReviews, type Review, type ReviewDetail } from "../../services/reviewService";



const ReviewManagementPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReviewDetail, setSelectedReviewDetail] = useState<ReviewDetail | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    loadReviews();
  }, [pagination.current, searchText]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await fetchReviews(pagination.current, searchText);
      setReviews(response.data);
      setPagination({
        ...pagination,
        total: response.pagination.total,
        pageSize: response.pagination.per_page,
      });
    } catch (error) {
      console.error("Error loading reviews:", error);
      message.error("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReview(id);
      message.success("Đã xóa đánh giá thành công");
      loadReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      message.error("Không thể xóa đánh giá");
    }
  };

  const showReviewDetail = async (review: Review) => {
    try {
      setIsModalVisible(true);
      setDetailLoading(true);
      const response = await fetchReviewDetail(review.id);
      setSelectedReviewDetail(response.data);
    } catch (error) {
      console.error("Error loading review detail:", error);
      message.error("Không thể tải chi tiết đánh giá");
      setIsModalVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      ...pagination,
      current: newPagination.current || 1,
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const columns: ColumnsType<Review> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      width: 100,
      render: (room: string | null) => (
        <p className="text-sm font-semibold text-slate-800">
          {room ? `P${room}` : "N/A"}
        </p>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      width: 140,
      render: (customer: string) => (
        <p className="text-sm font-medium text-slate-800">{customer}</p>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 110,
      render: (rating: number) => (
        <div className="flex items-center gap-1">
          <Rate disabled value={Math.round(rating)} className="text-xs" />
          <span className="text-xs text-slate-600">({rating.toFixed(1)})</span>
        </div>
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Nội dung",
      dataIndex: "comment",
      key: "comment",
      width: 250,
      ellipsis: true,
      render: (text: string) => (
        <p className="text-sm text-slate-600">{text}</p>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 110,
      render: (date: string) => (
        <span className="text-xs text-slate-600">
          {date}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 100,
      render: () => <Tag color="success">Đã duyệt</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-1">
          <Button
            type="link"
            icon={<FiEye />}
            onClick={() => showReviewDetail(record)}
            size="small"
          >
            Xem
          </Button>
          <Popconfirm
            title="Xóa đánh giá"
            description="Bạn có chắc muốn xóa đánh giá này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              danger
              icon={<FiTrash2 />}
              size="small"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const stats = [
    { label: "Tổng đánh giá", value: pagination.total, color: "text-blue-600" },
    { label: "Chờ duyệt", value: 0, color: "text-yellow-600" },
    { label: "Đã duyệt", value: pagination.total, color: "text-green-600" },
    { 
      label: "Đánh giá TB", 
      value: reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : "0.0", 
      color: "text-orange-600" 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">
          <FiStar className="text-emerald-600" />
          Quản lý đánh giá
        </h1>
        <p className="mt-1 text-slate-500">Quản lý và phê duyệt đánh giá từ khách hàng</p>
      </div>

   
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm rounded-xl">
            <p className="mb-1 text-sm text-slate-500">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

  
      <Card className="border-0 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 md:flex-row">
          <Input.Search
            placeholder="Tìm kiếm theo tên, phòng, nội dung..."
            prefix={<FiSearch className="text-slate-400" />}
            onSearch={handleSearch}
            allowClear
            className="md:w-96"
            size="large"
          />
        </div>
      </Card>

     
      <Card className="overflow-hidden border-0 shadow-sm rounded-xl">
        <Table
          columns={columns}
          dataSource={reviews}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: (total) => `Tổng ${total} đánh giá`,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>


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
        width={700}
      >
        {detailLoading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : selectedReviewDetail ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50">
              <p className="mb-1 text-sm text-slate-500">Phòng</p>
              <p className="font-semibold text-slate-800">
                {selectedReviewDetail.room ? `Phòng ${selectedReviewDetail.room}` : "N/A"}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="mb-1 text-sm text-slate-500">Khách hàng</p>
              <p className="font-semibold text-slate-800">{selectedReviewDetail.customer}</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="mb-3 text-sm text-slate-500">Chi tiết đánh giá</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Độ sạch sẽ:</span>
                  <Rate disabled value={selectedReviewDetail.ratings.cleanliness} className="text-xs" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Thoải mái:</span>
                  <Rate disabled value={selectedReviewDetail.ratings.comfort} className="text-xs" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Vị trí:</span>
                  <Rate disabled value={selectedReviewDetail.ratings.location} className="text-xs" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Dịch vụ:</span>
                  <Rate disabled value={selectedReviewDetail.ratings.service} className="text-xs" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Giá trị:</span>
                  <Rate disabled value={selectedReviewDetail.ratings.value} className="text-xs" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">WiFi:</span>
                  <Rate disabled value={selectedReviewDetail.ratings.wifi} className="text-xs" />
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Đánh giá tổng thể:</span>
                  <div className="flex items-center gap-2">
                    <Rate disabled value={Math.round(selectedReviewDetail.ratings.overall)} />
                    <span className="text-lg font-bold text-emerald-600">
                      {selectedReviewDetail.ratings.overall.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="mb-2 text-sm text-slate-500">Nội dung đánh giá</p>
              <p className="leading-relaxed text-slate-700">{selectedReviewDetail.comment}</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="mb-2 text-sm text-slate-500">Thông tin đặt phòng</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-slate-500">Ngày nhận:</p>
                  <p className="text-sm font-medium text-slate-700">
                    {dayjs(selectedReviewDetail.booking.check_in).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Ngày trả:</p>
                  <p className="text-sm font-medium text-slate-700">
                    {dayjs(selectedReviewDetail.booking.check_out).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50">
              <p className="mb-1 text-sm text-slate-500">Ngày đánh giá</p>
              <p className="text-slate-700">
                {dayjs(selectedReviewDetail.date).format("DD/MM/YYYY HH:mm")}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default ReviewManagementPage;
