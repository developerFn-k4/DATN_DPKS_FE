export type CityOption = { label: string; value: string };

export type HotelItem = {
    id: number;
    name: string;
    city: string;
    priceFrom: number;
    rating: number;
    tags: string[];
    img: string;
};

export type RoomItem = {
    id: number;
    name: string;
    city: string;
    type: string;
    features: string[];
    price: number;
    image: string;
    label?: string;
    labelColor?: string;
};

export type SearchState = {
    city: string;
    keyword: string;
    guests: number;
    range: any; 
};

// API Types
export type ApiRoomType = {
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
};

export type ApiRoom = {
    id: number;
    room_number: string;
    room_type_id: number;
    floor: number;
    status: string;
    note: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    room_type: ApiRoomType;
};

export type ApiRoomsResponse = {
    success: boolean;
    data: ApiRoom[];
};
