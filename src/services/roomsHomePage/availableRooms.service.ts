import { API_BASE_URL, API_STORAGE_URL, ENDPOINTS } from "../endpoints/common";
import type { ApiRoom, ApiRoomImage, RoomItem } from "../../types/types";

export interface AvailableRoomsParams {
  check_in: string;
  check_out: string;
  guests: number;
}

export interface AvailableRoomsResponse {
  data: ApiRoom[];
}

// Convert API room to RoomItem format
export const convertApiRoomToRoomItem = (apiRoom: ApiRoom): RoomItem => {
  const price = parseFloat(apiRoom.price || apiRoom.room_type.base_price);
  
  // Determine label and color based on price range
  let label = "";
  let labelColor = "";
  if (price >= 3000000) {
    label = "Luxury";
    labelColor = "bg-amber-600";
  } else if (price >= 2000000) {
    label = "VIP";
    labelColor = "bg-rose-600";
  } else if (price >= 1500000) {
    label = "Suite";
    labelColor = "bg-emerald-600";
  } else if (price >= 1000000) {
    label = "Premium";
    labelColor = "bg-purple-600";
  }

  // Convert images từ API
  const images = apiRoom.images && apiRoom.images.length > 0
    ? apiRoom.images.map((img: ApiRoomImage) => `${API_STORAGE_URL}/${img.image_url}`)
    : [];

  // Ảnh mặc định đẹp cho phòng không có ảnh
  const defaultRoomImages = [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop"
  ];
  
  const fallbackImage = defaultRoomImages[apiRoom.id % defaultRoomImages.length];
  const mainImage = images.length > 0 ? images[0] : fallbackImage;

  return {
    id: apiRoom.id,
    name: `${apiRoom.room_type.name} - Phòng ${apiRoom.room_number}`,
    city: `Tầng ${apiRoom.floor}`,
    type: apiRoom.room_type.description,
    features: [
      `${apiRoom.room_type.capacity} người`,
      apiRoom.room_type.bed_type,
      apiRoom.status === "available" ? "Có sẵn" : "Đã đặt",
    ],
    price: price,
    image: mainImage,
    images: images.length > 0 ? images : [fallbackImage],
    label,
    labelColor,
  };
};

export const searchAvailableRooms = async (
  params: AvailableRoomsParams
): Promise<RoomItem[]> => {
  try {
    const queryParams = new URLSearchParams({
      check_in: params.check_in,
      check_out: params.check_out,
      guests: params.guests.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.AVAILABLE_ROOMS}?${queryParams}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch available rooms');
    }

    const data: AvailableRoomsResponse = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map(convertApiRoomToRoomItem);
    }
    
    return [];
  } catch (error) {
    console.error("Error searching available rooms:", error);
    return [];
  }
};
