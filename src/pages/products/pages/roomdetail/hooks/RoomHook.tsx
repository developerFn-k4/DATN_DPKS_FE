import { useState, useEffect } from "react";
import type { RoomType, RelatedRoom } from "../type";

export const useRoomHook = (id: string | number) => {
  const [roomData, setRoomData] = useState<RoomType | null>(null);
  const [otherRooms, setOtherRooms] = useState<RelatedRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      // Nếu id không tồn tại hoặc là "detail" (do sai Route), không gọi API
      if (!id || id === "detail") {
        console.warn("ID phòng không hợp lệ:", id);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log(`Đang gọi API cho phòng ID: ${id}...`);
        
        const response = await fetch(`https://vietstay.ngrok.dev/api/rooms/${id}`, {
          headers: {
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error(`Lỗi server: ${response.status}`);
        }

        const result = await response.json();
        
        // --- BƯỚC QUAN TRỌNG: SOI DỮ LIỆU ---
        console.log("Dữ liệu thô từ API:", result);

        // Tự động tìm data: Ưu tiên result.data, nếu không thấy thì lấy chính result
        const mainData = result?.data || result;

        // Kiểm tra xem mainData có thực sự chứa thông tin phòng không
        if (mainData && (mainData.name || mainData.id)) {
          setRoomData(mainData);

          // Xử lý list phòng liên quan
          if (mainData.other_rooms && mainData.other_rooms.length > 0) {
            setOtherRooms(mainData.other_rooms);
          } else {
            // Mock dữ liệu nếu Backend chưa trả về list khác
            const fallbackImg = mainData.room_images?.[0]?.image_url || "https://placehold.co/600x400?text=VietStay";
            setOtherRooms([
              { 
                id: 101, 
                name: "Phòng Deluxe City View", 
                base_price: "1500000", 
                capacity: 2,
                image_url: fallbackImg 
              },
              { 
                id: 102, 
                name: "Phòng Family Suite", 
                base_price: "3200000", 
                capacity: 4,
                image_url: fallbackImg
              },
            ]);
          }
        } else {
          console.error("Cấu trúc dữ liệu không khớp hoặc ID không tồn tại!");
        }

      } catch (error) {
        console.error("Lỗi Call API VietStay:", error);
        setRoomData(null);
      } finally {
        // Delay nhẹ để Skeleton mượt mà
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchRoomDetail();
  }, [id]);

  return { roomData, otherRooms, loading };
};