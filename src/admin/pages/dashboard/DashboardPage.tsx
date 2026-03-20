import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Progress, Spin, message } from "antd";
import { 
  FiHome, 
  FiUsers, 
  FiCreditCard, 
  FiTrendingUp,
  FiCalendar,
  FiStar
} from "react-icons/fi";
import { motion } from "framer-motion";
import { fetchDashboardData, type DashboardData } from "../../services/dashboardService";


const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      message.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const todayBookings = dashboardData.bookings.daily[0]?.total || 0;
  const monthlyRevenue = parseFloat(dashboardData.revenue.monthly[0]?.total || "0");


  const stats = [
    {
      title: "Tổng phòng",
      value: dashboardData.stats.total_rooms,
      icon: <FiHome className="text-3xl" />,
      color: "emerald",
      trend: "+12%",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      title: "Đặt phòng hôm nay",
      value: todayBookings,
      icon: <FiCalendar className="text-3xl" />,
      color: "blue",
      trend: "+8%",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Khách hàng",
      value: dashboardData.stats.total_users,
      icon: <FiUsers className="text-3xl" />,
      color: "purple",
      trend: "+23%",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Doanh thu tháng",
      value: monthlyRevenue,
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
     
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">Chào mừng đến với hệ thống quản trị VietStay</p>
      </div>

    
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
                className="transition-shadow border-0 shadow-sm hover:shadow-md rounded-xl"
                bodyStyle={{ padding: '20px' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="mb-2 text-sm text-slate-500">{stat.title}</p>
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
                      <FiTrendingUp className="text-sm text-green-500" />
                      <span className="text-xs font-semibold text-green-500">{stat.trend}</span>
                      <span className="ml-1 text-xs text-slate-400">vs tháng trước</span>
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

     
      <Row gutter={[16, 16]}>
     
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div className="flex items-center gap-2">
                <FiCalendar className="text-emerald-600" />
                <span className="font-bold text-slate-800">Đặt phòng gần đây</span>
              </div>
            }
            className="border-0 shadow-sm rounded-xl"
          >
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 transition-colors rounded-lg bg-slate-50 hover:bg-slate-100"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{booking.room}</p>
                    <p className="text-sm text-slate-500">{booking.customer}</p>
                  </div>
                  <div className="mr-4 text-right">
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

     
        <Col xs={24} lg={10}>
          <Card 
            title={
              <div className="flex items-center gap-2">
                <FiHome className="text-emerald-600" />
                <span className="font-bold text-slate-800">Tỷ lệ lấp đầy phòng</span>
              </div>
            }
            className="border-0 shadow-sm rounded-xl"
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


      <Card 
        title={
          <div className="flex items-center gap-2">
            <FiStar className="text-emerald-600" />
            <span className="font-bold text-slate-800">Hành động nhanh</span>
          </div>
        }
        className="border-0 shadow-sm rounded-xl"
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} md={6}>
            <button className="w-full p-4 transition-colors border-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl border-emerald-200 hover:border-emerald-300">
              <FiHome className="mx-auto mb-2 text-2xl text-emerald-600" />
              <p className="text-sm font-semibold text-slate-700">Thêm phòng mới</p>
            </button>
          </Col>
          <Col xs={12} md={6}>
            <button className="w-full p-4 transition-colors border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl hover:border-blue-300">
              <FiCalendar className="mx-auto mb-2 text-2xl text-blue-600" />
              <p className="text-sm font-semibold text-slate-700">Tạo đặt phòng</p>
            </button>
          </Col>
          <Col xs={12} md={6}>
            <button className="w-full p-4 transition-colors border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 rounded-xl hover:border-purple-300">
              <FiUsers className="mx-auto mb-2 text-2xl text-purple-600" />
              <p className="text-sm font-semibold text-slate-700">Thêm khách hàng</p>
            </button>
          </Col>
          <Col xs={12} md={6}>
            <button className="w-full p-4 transition-colors border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 rounded-xl hover:border-orange-300">
              <FiCreditCard className="mx-auto mb-2 text-2xl text-orange-600" />
              <p className="text-sm font-semibold text-slate-700">Xử lý thanh toán</p>
            </button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DashboardPage;
