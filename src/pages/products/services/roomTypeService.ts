export interface RoomTypeL {
  room_type_id: number;
  name: string;
  capacity: number;
  bed_type: string;
  area: number;
  amenities: string[];
  base_price: string;
  currency: string;
  available_rooms: number; // Số phòng trống
  total_rooms: number;     // Tổng số phòng
  images: string[];        // Mảng các đường dẫn ảnh
  max_adults: number;    // Số người lớn tối đa
  max_children: number;  // Số trẻ em tối đa
  services: any[];      // Danh sách dịch vụ đi kèm
}

export const roomService = {
  getRoomTypes: async (): Promise<RoomTypeL[]> => {
    try {
      const response = await fetch('https://vietstay.ngrok.dev/api/rooms/room-types');
      if (!response.ok) throw new Error('Không thể kết nối API');
      
      const result = await response.json();
      return result.room_types || [];
    } catch (error) {
      console.error("Service Error:", error);
      return [];
    }
  }
};