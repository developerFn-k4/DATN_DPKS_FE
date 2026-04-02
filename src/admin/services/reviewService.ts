import { API_BASE_URL, API_BASE_URL_NEW } from "../../services/endpoints/common";

export interface Review {
  id: number;
  room: string | null;
  customer: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ReviewDetail {
  id: number;
  room: string | null;
  customer: string;
  ratings: {
    cleanliness: number;
    comfort: number;
    location: number;
    service: number;
    value: number;
    wifi: number;
    overall: number;
  };
  comment: string;
  booking: {
    check_in: string;
    check_out: string;
  };
  date: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ReviewDetailResponse {
  success: boolean;
  data: ReviewDetail;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const fetchReviews = async (page = 1, search = ""): Promise<ReviewsResponse> => {
  const url = new URL(`${API_BASE_URL_NEW}/admin/reviews`);
  url.searchParams.append("page", page.toString());
  if (search) {
    url.searchParams.append("search", search);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
};

export const fetchReviewDetail = async (id: number): Promise<ReviewDetailResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/reviews/${id}`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error("Failed to fetch review detail");
  }

  return response.json();
};

export const deleteReview = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/reviews/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error("Failed to delete review");
  }

  return response.json();
};
