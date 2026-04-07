import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

type BookingStatus = 'pending' | 'completed' | 'cancelled';

interface RoomType {
  name?: string;
}

interface Room {
  room_number?: string | number;
  floor?: string | number;
  room_type?: RoomType;
}

interface Booking {
  id: string | number;
  status: BookingStatus;
  room?: Room;
  check_in?: string;
  check_out?: string;
  total_price?: string | number;
}

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const statusMap: Record<BookingStatus, { label: string; color: string }> = {
    pending: { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-600' },
    completed: { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-600' },
    cancelled: { label: 'Đã hủy', color: 'bg-rose-100 text-rose-600' }
  };

  const currentStatus = statusMap[booking.status] || statusMap.pending;

  const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString('vi-VN') : 'N/A';

  return (
    <div className="bg-white rounded-3xl p-6 mb-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col md:flex-row gap-6 transition-all hover:scale-[1.01]">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
          <span className="text-gray-400 text-sm">#VTS-{booking.id}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-1">
          Phòng {booking.room?.room_number ?? 'N/A'} - {booking.room?.room_type?.name ?? 'N/A'}
        </h3>

        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar size={16} />
            <span>{formatDate(booking.check_in)} - {formatDate(booking.check_out)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MapPin size={16} />
            <span>Tầng {booking.room?.floor ?? 'N/A'}, VietStay Hotel</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[180px]">
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase font-semibold">Tổng thanh toán</p>
          <p className="text-2xl font-black text-blue-600">
            {Number(booking.total_price ?? 0).toLocaleString()} <span className="text-sm">VND</span>
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          {booking.status === 'pending' && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all">
              Thanh toán
            </button>
          )}
          <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;