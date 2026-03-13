export interface RoomImage {
  id: number;
  room_type_id: number;
  image_url: string;
}

export interface Hotel {
  id: number;
  name: string;
  address: string;
  phone: string;
  description: string;
}

export interface RelatedRoom {
  id: number;
  name: string;
  base_price: string;
  capacity: number;
  image_url?: string; 
}

export interface RoomType {
  id: number;
  hotel_id: number;
  name: string;
  description: string;
  capacity: number;
  bed_type: string;
  base_price: string;
  hotel?: Hotel;
  room_images?: RoomImage[];
  other_rooms?: RelatedRoom[]; 
}