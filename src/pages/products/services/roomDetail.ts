export interface RoomImage {
  id: number;
  image_url: string;
}

export interface RoomType {
  id: number;
  hotel_id: number;
  name: string;
  description: string;
  capacity: number;
  bed_type: string;
  base_price: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: number;
  room_number: string;
  room_type_id: number;
  floor: number;
  status: string;
  note: string | null;
  price: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  room_type: RoomType;
  images: RoomImage[];
}

export interface RatingSummary {
  reviews_avg_overall_score: number; // ⭐ 4.2
  reviews_count: number;             // 1
}

export interface ReviewUser {
  id: number;
  name: string;
  avatar?: string | null;
}

export interface Review {
  id: number;
  room_id: number;
  user_id: number;
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
  updated_at: string;

  user: ReviewUser;
}

export interface RoomDetailResponse {
  success: boolean;
  room: Room;
  rating_summary: RatingSummary;
  reviews: Review[];
  related_rooms: Room[]; 
}


const API_URL = import.meta.env.VITE_API_URL as string;
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token"); 
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers as HeadersInit;
};
export const getRoomDetail = async (
  id: number
): Promise<RoomDetailResponse> => {
  const response = await fetch(`${API_URL}/rooms/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch room detail");
  }

  return await response.json();
};
export const updateReview = async (id: number, payload: {
  user_id: number;
  booking_id: number;
  cleanliness: number;
  comfort: number;
  location: number;
  service: number;
  value: number;
  wifi: number;
  comment: string;
}) => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: "PUT", 
    headers: getAuthHeaders(), 
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to update review");
  return await response.json();
};

export const deleteReview = async (id: number) => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete review");
  return await response.json();
};

export const createReview = async (payload: {
  user_id: number;
  booking_id: number;
  room_id: number;
  cleanliness: number;
  comfort: number;
  location: number;
  service: number;
  value: number;
  wifi: number;
  comment: string;
}) => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create review");
  }

  return await response.json();
};