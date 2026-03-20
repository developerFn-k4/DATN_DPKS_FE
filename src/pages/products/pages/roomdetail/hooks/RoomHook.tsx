import { useEffect, useState, useCallback } from "react";
import {
  getRoomDetail,
  createReview,
  type RoomDetailResponse,
  updateReview,
  deleteReview,
} from "../../../services/roomDetail";
interface ReviewPayload {
  user_id: number;
  booking_id: number;
  cleanliness: number;
  comfort: number;
  location: number;
  service: number;
  value: number;
  wifi: number;
  comment: string;
}
export const useRoomDetail = (id?: number) => {
  const [data, setData] = useState<RoomDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomDetail = useCallback(async () => {
    if (!id) return;

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
  }, [id]);

  useEffect(() => {
    fetchRoomDetail();
  }, [fetchRoomDetail]);

  const submitReview = async (payload: ReviewPayload) => {
    if (!id) return;

    try {
      setSubmitting(true);
      await createReview({
        room_id: id,
        ...payload, 
      });
      await fetchRoomDetail(); 
    } catch (err) {
      console.error("Submit review error:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const editReview = async (reviewId: number, payload: ReviewPayload) => {
    try {
      setSubmitting(true);
      await updateReview(reviewId, payload);
      await fetchRoomDetail();
    } catch (err) {
      console.error("Edit review error:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const removeReview = async (reviewId: number) => {
    try {
      setSubmitting(true);
      await deleteReview(reviewId);
      await fetchRoomDetail(); 
    } catch (err) {
      console.error("Delete review error:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    room: data?.room || null,
    ratingSummary: data?.rating_summary || null,
    reviews: data?.reviews || [],
    relatedRooms: data?.related_rooms || [],

    loading,
    submitting,
    error,

    refetch: fetchRoomDetail,
    submitReview,
    editReview,
    removeReview,
  };
};

