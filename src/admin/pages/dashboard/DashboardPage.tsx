import React from "react";
import { Card, Row, Col, Statistic, Progress } from "antd";
import { 
  FiHome, 
  FiUsers, 
  FiCreditCard, 
  FiTrendingUp,
  FiCalendar,
  FiStar
} from "react-icons/fi";
import { motion } from "framer-motion";

const DashboardPage: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Mock data - sẽ thay bằng API sau
  const stats = [
    {
      title: "Tổng phòng",
      value: 150,
      icon: <FiHome className="text-3xl" />,
      color: "emerald",
      trend: "+12%",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      title: "Đặt phòng hôm nay",
      value: 28,
      icon: <FiCalendar className="text-3xl" />,
      color: "blue",
      trend: "+8%",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Khách hàng",
      value: 1250,
      icon: <FiUsers className="text-3xl" />,
      color: "purple",
      trend: "+23%",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Doanh thu tháng",
      value: 456000000,
      prefix: "₫",
      icon: <FiCreditCard className="text-3xl" />,
      color: "orange",
      trend: "+15%",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  const recentBookings = [
    { id: 1, room: "Phòng 101", customer: "Nguyễn Văn A", date: "16/03/2026", status: "confirmed" },
    { id: 2, room: "Phòng 205", customer: "Trần Thị B", date: "16/03/2026", status: "pending" },
    { id: 3, room: "Phòng 310", customer: "Lê Văn C", date: "15/03/2026", status: "confirmed" },
    { id: 4, room: "Phòng 102", customer: "Phạm Thị D", date: "15/03/2026", status: "cancelled" }
  ];

  const roomOccupancy = [
    { type: "Standard", occupied: 45, total: 60, percentage: 75 },
    { type: "Deluxe", occupied: 28, total: 40, percentage: 70 },
    { type: "Suite", occupied: 18, total: 30, percentage: 60 },
    { type: "VIP", occupied: 8, total: 20, percentage: 40 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Chào mừng đến với hệ thống quản trị VietStay</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-xl"
                bodyStyle={{ padding: '20px' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-slate-500 text-sm mb-2">{stat.title}</p>
                    <Statistic
                      value={stat.value}
                      valueStyle={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold',
                        color: '#1e293b'
                      }}
                      prefix={stat.prefix}
                    />
                    <div className="flex items-center gap-1 mt-2">
                      <FiTrendingUp className="text-green-500 text-sm" />
                      <span className="text-green-500 text-xs font-semibold">{stat.trend}</span>
                      <span className="text-slate-400 text-xs ml-1">vs tháng trước</span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} ${stat.iconColor} p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Recent Bookings & Room Occupancy */}
      <Row gutter={[16, 16]}>
        {/* Recent Bookings */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div className="flex items-center gap-2">
                <FiCalendar className="text-emerald-600" />
                <span className="font-bold text-slate-800">Đặt phòng gần đây</span>
              </div>
            }
            className="shadow-sm rounded-xl border-0"
          >
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{booking.room}</p>
                    <p className="text-sm text-slate-500">{booking.customer}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm text-slate-600">{booking.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Room Occupancy */}
        <Col xs={24} lg={10}>
          <Card 
            title={
              <div className="flex items-center gap-2">
                <FiHome className="text-emerald-600" />
                <span className="font-bold text-slate-800">Tỷ lệ lấp đầy phòng</span>
              </div>
            }
            className="shadow-sm rounded-xl border-0"
          >
            <div className="space-y-4">
              {roomOccupancy.map((room, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{room.type}</span>
                    <span className="text-sm text-slate-500">
                      {room.occupied}/{room.total}
                    </span>
                  </div>
                  <Progress 
                    percent={room.percentage} 
                    strokeColor={{
                      '0%': '#10b981',
                      '100%': '#059669',
                    }}
                    trailColor="#f1f5f9"
                    showInfo={true}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <FiStar className="text-emerald-600" />
            <span className="font-bold text-slate-800">Hành động nhanh</span>
          </div>
        }
        className="shadow-sm rounded-xl border-0"
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} md={6}>
            <button className="w-full p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border-2 border-emerald-200 hover:border-emerald-300">
              <FiHome className="text-emerald-600 text-2xl mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Thêm phòng mới</p>
            </button>
          </Col>
          <Col xs={12} md={6}>
            <button className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border-2 border-blue-200 hover:border-blue-300">
              <FiCalendar className="text-blue-600 text-2xl mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Tạo đặt phòng</p>
            </button>
          </Col>
          <Col xs={12} md={6}>
            <button className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border-2 border-purple-200 hover:border-purple-300">
              <FiUsers className="text-purple-600 text-2xl mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Thêm khách hàng</p>
            </button>
          </Col>
          <Col xs={12} md={6}>
            <button className="w-full p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors border-2 border-orange-200 hover:border-orange-300">
              <FiCreditCard className="text-orange-600 text-2xl mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Xử lý thanh toán</p>
            </button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DashboardPage;
