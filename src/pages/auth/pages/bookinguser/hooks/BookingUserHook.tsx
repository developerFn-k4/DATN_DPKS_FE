import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../../../../products/services/bookingRoomType';

type BookingStatus = 'pending' | 'completed' | 'cancelled';
type BookingFilterStatus = BookingStatus | 'all';

interface RoomType {
  name?: string;
}

interface Room {
  room_number?: string | number;
  floor?: string | number;
  room_type?: RoomType;
}

export interface Booking {
  id: string | number;
  status: BookingStatus;
  room?: Room;
  check_in?: string;
  check_out?: string;
  total_price?: string | number;
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<BookingFilterStatus>('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = bookings.filter((item) => {
    if (!item) return false;
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  return { filteredData, loading, filterStatus, setFilterStatus, refresh: loadData };
};