import { useEffect, useState } from "react";
import { getRoomDetail, type RoomDetailResponse } from "../services/roomDetail";

export const useRoomDetail = (id?: number) => {
  const [data, setData] = useState<RoomDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRoomDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getRoomDetail(id);

        setData(res);
      } catch (err) {
        console.error("Error fetching room detail:", err);
        setError("Failed to load room detail");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetail();
  }, [id]);

  return {
    data,
    loading,
    error,
  };
};
