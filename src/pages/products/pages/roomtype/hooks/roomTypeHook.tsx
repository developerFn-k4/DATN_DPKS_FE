import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { roomService, searchRoomTypes, type RoomTypeL, type SearchInfo } from '../../../services/roomTypeService';

export const useRoomTypes = () => {
  const [rooms, setRooms] = useState<RoomTypeL[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkIn = searchParams.get('check_in');
    const checkOut = searchParams.get('check_out');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');
    const roomsCount = searchParams.get('rooms');

    setLoading(true);
    setError(null);

    if (checkIn && checkOut) {
      const childrenCount = parseInt(children || '0');
      searchRoomTypes({
        check_in: checkIn,
        check_out: checkOut,
        adults: parseInt(adults || '1'),
        children_ages: Array(childrenCount).fill(0),
        quantity_rooms: parseInt(roomsCount || '1'),
      })
        .then(({ rooms: searched, searchInfo: info }) => {
          setRooms(searched);
          setSearchInfo(info);
        })
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      roomService.getRoomTypes()
        .then((data) => {
          setRooms(data);
          setSearchInfo(null);
        })
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  return { rooms, loading, error, searchInfo };
};
