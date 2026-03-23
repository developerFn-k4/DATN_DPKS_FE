import { useState, useEffect, type SetStateAction } from 'react';
import { roomService, type RoomType } from '../../../services/roomTypeService';

export const useRoomTypes = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    roomService.getRoomTypes()
      .then((data: SetStateAction<RoomType[]>) => setRooms(data))
      .catch((err: { message: SetStateAction<string | null>; }) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { rooms, loading, error };
};