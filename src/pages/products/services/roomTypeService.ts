export interface RoomTypeL {
  room_type_id: number;
  name: string;
  capacity: number;
  bed_type: string;
  area: number;
  amenities: string[];
  base_price: string;
  currency: string;
  available_rooms: number;
  total_rooms: number;
  images: string[];
  max_adults: number;
  max_children: number;
  services: any[];
  // rating summary returned by API
  average_rating?: number;
  total_reviews?: number;
  rating_summary?: {
    overall: number;
    cleanliness: number;
    comfort: number;
    location: number;
    service: number;
    value: number;
    wifi: number;
    total_reviews: number;
  };
}

export interface SearchInfo {
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  total_guests: number;
  required_capacity: number;
  quantity_rooms: number;
}

export interface SearchRoomRequest {
  check_in: string;
  check_out: string;
  adults: number;
  children_ages: number[];
  quantity_rooms: number;
  name?: string;
}

// Shape chung cho cả list và search API (BE dùng average_rate, không phải average_rating)
interface RoomTypeRaw {
  room_type_id: number;
  name: string;
  // list API
  capacity?: number;
  max_adults?: number;
  max_children?: number;
  // search API
  capacity_per_room?: number;
  available_rooms: number;
  bed_type: string;
  area: number;
  amenities: string[];
  base_price?: string;
  price_per_room_per_night?: string;
  nights?: number;
  total_price?: number;
  currency: string;
  images: string[];
  services?: RoomTypeL["services"];
  total_rooms?: number;
  // rating — BE trả average_rate (list) hoặc average_rating (search)
  average_rate?: number;
  average_rating?: number;
  total_reviews?: number;
  rating_summary?: RoomTypeL["rating_summary"];
}

function mapToRoomTypeL(r: RoomTypeRaw): RoomTypeL {
  const capacity = r.capacity ?? r.capacity_per_room ?? 2;
  return {
    room_type_id: r.room_type_id,
    name: r.name,
    capacity,
    bed_type: r.bed_type,
    area: r.area,
    amenities: r.amenities,
    base_price: r.base_price ?? r.price_per_room_per_night ?? "0",
    currency: r.currency,
    available_rooms: r.available_rooms,
    total_rooms: r.total_rooms ?? r.available_rooms,
    images: r.images,
    max_adults: r.max_adults ?? r.capacity_per_room ?? capacity,
    max_children: r.max_children ?? 0,
    services: r.services ?? [],
    // BE trả average_rate (list) hoặc average_rating (search) — chuẩn hóa về average_rating
    average_rating: r.average_rate ?? r.average_rating,
    total_reviews: r.total_reviews,
    rating_summary: r.rating_summary,
  };
}

export const roomService = {
  getRoomTypes: async (): Promise<RoomTypeL[]> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms/room-types`);
      if (!response.ok) throw new Error('Không thể kết nối API');
      const result = await response.json();
      return (result.room_types as RoomTypeRaw[] || []).map(mapToRoomTypeL);
    } catch (error) {
      console.error("Service Error:", error);
      return [];
    }
  }
};

export async function searchRoomTypes(
  params: SearchRoomRequest
): Promise<{ rooms: RoomTypeL[]; searchInfo: SearchInfo }> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms/room-types/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error('Không thể tìm kiếm phòng');
  const result = await response.json();
  return {
    rooms: (result.room_types || []).map(mapToRoomTypeL),
    searchInfo: result.search_info,
  };
}