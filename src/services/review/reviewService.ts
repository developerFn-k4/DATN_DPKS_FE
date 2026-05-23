import api from "../../core/api";

export interface RatingSummary {
  overall: number;
  cleanliness: number;
  comfort: number;
  location: number;
  service: number;
  value: number;
  wifi: number;
  total_reviews: number;
}

export interface ReviewComment {
  id: number;
  user: {
    id: number;
    name: string;
    avatar?: string | null;
  };
  booking_id: number;
  cleanliness: number;
  comfort: number;
  location: number;
  service: number;
  value: number;
  wifi: number;
  overall_score: number;
  comment: string;
  created_at: string;
}

// Shape trả về thực tế từ BE (keys dùng prefix average_)
interface RawSummary {
  total_reviews?: number;
  average_overall?: number;
  average_cleanliness?: number;
  average_comfort?: number;
  average_location?: number;
  average_service?: number;
  average_value?: number;
  average_wifi?: number;
  // fallback nếu BE đổi về không có prefix
  overall?: number;
  cleanliness?: number;
  comfort?: number;
  location?: number;
  service?: number;
  value?: number;
  wifi?: number;
}

function normalizeSummary(raw: RawSummary): RatingSummary {
  return {
    total_reviews: raw.total_reviews ?? 0,
    overall:     raw.average_overall    ?? raw.overall     ?? 0,
    cleanliness: raw.average_cleanliness ?? raw.cleanliness ?? 0,
    comfort:     raw.average_comfort     ?? raw.comfort     ?? 0,
    location:    raw.average_location    ?? raw.location    ?? 0,
    service:     raw.average_service     ?? raw.service     ?? 0,
    value:       raw.average_value       ?? raw.value       ?? 0,
    wifi:        raw.average_wifi        ?? raw.wifi        ?? 0,
  };
}

export interface ReviewsResponse {
  success: boolean;
  summary: RatingSummary;
  data: ReviewComment[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface EligibilityResponse {
  success: boolean;
  can_review: boolean;
  reason?: string;
  eligible_bookings?: { id: number; check_out: string; booking_code?: string }[];
}

export interface PostReviewPayload {
  booking_id: number;
  cleanliness: number;
  comfort: number;
  location: number;
  service: number;
  value: number;
  wifi: number;
  comment: string;
}

export interface PostReviewResponse {
  success: boolean;
  message?: string;
  data?: ReviewComment;
}

export const reviewService = {
  getReviews: async (roomTypeId: number, page = 1): Promise<ReviewsResponse> => {
    const res = await api.get<Record<string, unknown>>(`/room-types/${roomTypeId}/reviews`, {
      params: { page },
    });
    const raw = res.data;
    const rawSummary = (raw.summary ?? {}) as RawSummary;
    // BE có thể trả data là paginator object hoặc array thẳng
    const pagedData = raw.data as Record<string, unknown> | ReviewComment[] | undefined;
    const comments: ReviewComment[] = Array.isArray(pagedData)
      ? pagedData
      : ((pagedData?.data as ReviewComment[]) ?? []);
    const meta = Array.isArray(pagedData)
      ? (raw.meta as ReviewsResponse["meta"])
      : (pagedData?.meta as ReviewsResponse["meta"]);
    return {
      success: Boolean(raw.success),
      summary: normalizeSummary(rawSummary),
      data: comments,
      meta,
    };
  },

  getEligibility: async (roomTypeId: number): Promise<EligibilityResponse> => {
    const res = await api.get<EligibilityResponse>(`/room-types/${roomTypeId}/reviews/eligibility`);
    return res.data;
  },

  postReview: async (payload: PostReviewPayload): Promise<PostReviewResponse> => {
    const res = await api.post<PostReviewResponse>("/reviews", payload);
    return res.data;
  },
};
