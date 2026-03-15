export interface RoomImage {
  id: number;
  image_url: string;
}

export interface ReviewUser {
  id: number;
  name: string;
  avatar?: string | null;
}

export interface Review {
  id: number;
  overall_score: number;
  comment: string;
  user: ReviewUser;
}

export interface RoomType {
  id: number;
  name: string;
  description: string;
  capacity: number;
  bed_type: string;
}

export interface Room {
  area: string;
  id: number;
  room_number: string;
  price: string;
  status: string;
  room_type: RoomType;
  images: RoomImage[];
}

export interface RatingSummary {
  cleanliness: number;
  comfort: number;
  location: number;
  service: number;
  value: number;
  wifi: number;
  overall: number;
  total_reviews: number;
}

export interface RoomDetailResponse {
  success: boolean;
  room: Room;
  rating_summary: RatingSummary;
  reviews: Review[];
  related_rooms: any[];
}

const API_URL = "https://vietstay.ngrok.dev/api";

export const getRoomDetail = async (id: number): Promise<RoomDetailResponse> => {
  try {
    const response = await fetch(`${API_URL}/rooms/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch room detail");
    }

    const data: RoomDetailResponse = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching room detail:", error);
    throw error;
  }
};