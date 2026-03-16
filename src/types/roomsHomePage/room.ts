export interface RoomImage {
    id: number;
    room_id: number;
    image_url: string;
    created_at: string;
    updated_at: string;
}

export interface RoomType {
    id: number;
    hotel_id: number;
    name: string;
    description: string;
    capacity: number;
    bed_type: string;
    base_price: string;
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
    price: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    room_type: RoomType;
    images: RoomImage[];
}

export interface RoomResponse {
    success: boolean;
    data: Room[];
}

export interface RoomDetailResponse {
  success: boolean;
  data: Room;
}