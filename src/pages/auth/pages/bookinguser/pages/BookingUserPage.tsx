import React from 'react';
import { LayoutGrid, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useBookings } from '../hooks/BookingUserHook';
import BookingCard from '../components/BookingUserComponent';

const MyBookings = () => {
  const { filteredData, loading, filterStatus, setFilterStatus } = useBookings();

  const tabs: { id: 'all' | 'pending' | 'completed' | 'cancelled'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Tất cả', icon: <LayoutGrid size={16} /> },
    { id: 'pending', label: 'Chờ xử lý', icon: <Clock size={16} /> },
    { id: 'completed', label: 'Hoàn thành', icon: <CheckCircle size={16} /> },
    { id: 'cancelled', label: 'Đã hủy', icon: <XCircle size={16} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header tiêu đề */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Đơn đặt hàng</h1>
        <p className="text-gray-500">Quản lý các chuyến đi và lịch sử đặt phòng của bạn</p>
      </div>

      {/* Tabs Filter theo phong cách Glassmorphism */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 mb-8 w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              filterStatus === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : filteredData.length > 0 ? (
        <div className="grid gap-4">
          {filteredData.map((item) => (
            <BookingCard key={item.id} booking={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <LayoutGrid size={32} />
          </div>
          <h3 className="text-gray-900 font-bold">Không tìm thấy đơn hàng</h3>
          <p className="text-gray-400 text-sm">Bạn chưa có yêu cầu đặt phòng nào ở trạng thái này.</p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;