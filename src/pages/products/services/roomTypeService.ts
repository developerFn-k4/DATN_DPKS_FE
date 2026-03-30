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
  image_url?: string;
}

export const roomService = {
  getRoomTypes: async (): Promise<RoomTypeL[]> => {
    try {
      const response = await fetch('https://vietstay.ngrok.dev/api/rooms/room-types');
      if (!response.ok) throw new Error('Không thể kết nối API');
      
      const result = await response.json();
      
      if (result && result.room_types) {
        return result.room_types;
      }
      
      return [];
    } catch (error) {
      console.error("Service Error:", error);
      return [];
    }
  }
};