import { useState, useEffect, useCallback } from "react";
import { type Room } from "../../../services/roomService";
import toast from "react-hot-toast";

// Mock data cho quản lý phòng
const MOCK_ROOMS: Room[] = [
  {
    id: 1,
    room_number: "101",
    room_type_id: 1,
    floor: 1,
    status: "available",
    note: "Phòng đơn tiêu chuẩn, gần thang máy",
    price: 500000,
    room_type: { id: 1, name: "Standard Room" },
    images: [
      { id: 1, image_url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400" },
      { id: 2, image_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400" }
    ]
  },
  {
    id: 2,
    room_number: "102",
    room_type_id: 1,
    floor: 1,
    status: "booked",
    note: "Đang có khách, checkout 15/03",
    price: 500000,
    room_type: { id: 1, name: "Standard Room" },
    images: [
      { id: 3, image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400" }
    ]
  },
  {
    id: 3,
    room_number: "201",
    room_type_id: 2,
    floor: 2,
    status: "available",
    note: "Phòng đôi, view thành phố",
    price: 750000,
    room_type: { id: 2, name: "Deluxe Room" },
    images: [
      { id: 4, image_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400" },
      { id: 5, image_url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400" },
      { id: 6, image_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400" }
    ]
  },
  {
    id: 4,
    room_number: "202",
    room_type_id: 2,
    floor: 2,
    status: "maintenance",
    note: "Đang sửa chữa điều hòa, dự kiến hoàn thành 18/03",
    price: 750000,
    room_type: { id: 2, name: "Deluxe Room" },
    images: []
  },
  {
    id: 5,
    room_number: "301",
    room_type_id: 3,
    floor: 3,
    status: "available",
    note: "Suite cao cấp với phòng khách riêng",
    price: 1200000,
    room_type: { id: 3, name: "Suite Room" },
    images: [
      { id: 7, image_url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400" },
      { id: 8, image_url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400" }
    ]
  },
  {
    id: 6,
    room_number: "302",
    room_type_id: 3,
    floor: 3,
    status: "booked",
    note: "Đặt dài hạn, checkout 25/03",
    price: 1200000,
    room_type: { id: 3, name: "Suite Room" },
    images: [
      { id: 9, image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400" }
    ]
  },
  {
    id: 7,
    room_number: "401",
    room_type_id: 4,
    floor: 4,
    status: "available",
    note: "Phòng VIP, ban công rộng",
    price: 1800000,
    room_type: { id: 4, name: "VIP Room" },
    images: [
      { id: 10, image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400" },
      { id: 11, image_url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400" },
      { id: 12, image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400" }
    ]
  },
  {
    id: 8,
    room_number: "103",
    room_type_id: 1,
    floor: 1,
    status: "available",
    note: null,
    price: 500000,
    room_type: { id: 1, name: "Standard Room" },
    images: [
      { id: 13, image_url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400" }
    ]
  },
  {
    id: 9,
    room_number: "203",
    room_type_id: 2,
    floor: 2,
    status: "booked",
    note: "Khách VIP, yêu cầu đặc biệt",
    price: 750000,
    room_type: { id: 2, name: "Deluxe Room" },
    images: []
  },
  {
    id: 10,
    room_number: "204",
    room_type_id: 2,
    floor: 2,
    status: "available",
    note: "Vừa dọn dẹp xong, sạch sẽ",
    price: 750000,
    room_type: { id: 2, name: "Deluxe Room" },
    images: [
      { id: 14, image_url: "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=400" },
      { id: 15, image_url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400" }
    ]
  },
  {
    id: 11,
    room_number: "303",
    room_type_id: 3,
    floor: 3,
    status: "maintenance",
    note: "Thay thảm mới, hoàn thành 17/03",
    price: 1200000,
    room_type: { id: 3, name: "Suite Room" },
    images: [
      { id: 16, image_url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400" }
    ]
  },
  {
    id: 12,
    room_number: "402",
    room_type_id: 4,
    floor: 4,
    status: "available",
    note: "Phòng đẹp nhất khách sạn",
    price: 1800000,
    room_type: { id: 4, name: "VIP Room" },
    images: [
      { id: 17, image_url: "https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=400" },
      { id: 18, image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400" }
    ]
  }
];

export const useRoom = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setRooms(MOCK_ROOMS);
    } catch (error) {
      toast.error("Không thể tải dữ liệu phòng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const createRoom = async (formData: FormData) => {
    const tId = toast.loading("Đang khởi tạo phòng...");
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate new room from FormData
      const newRoom: Room = {
        id: Math.max(...rooms.map(r => r.id), 0) + 1,
        room_number: formData.get("room_number") as string || "999",
        room_type_id: Number(formData.get("room_type_id")) || 1,
        floor: Number(formData.get("floor")) || 1,
        status: (formData.get("status") as Room["status"]) || "available",
        note: formData.get("note") as string || null,
        price: Number(formData.get("price")) || 0,
        room_type: {
          id: Number(formData.get("room_type_id")) || 1,
          name: ["Standard Room", "Deluxe Room", "Suite Room", "VIP Room"][Number(formData.get("room_type_id")) - 1] || "Standard Room"
        },
        images: []
      };
      
      setRooms(prev => [...prev, newRoom]);
      toast.success("Thêm phòng thành công!", { id: tId });
    } catch (error: any) {
      toast.error("Lỗi khi thêm phòng!", { id: tId });
      throw error;
    }
  };

  const updateRoom = async (id: number, formData: FormData) => {
    const tId = toast.loading("Đang lưu thay đổi...");
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRooms(prev => prev.map(room => {
        if (room.id === id) {
          const roomTypeId = Number(formData.get("room_type_id")) || room.room_type_id;
          return {
            ...room,
            room_number: formData.get("room_number") as string || room.room_number,
            room_type_id: roomTypeId,
            floor: Number(formData.get("floor")) || room.floor,
            status: (formData.get("status") as Room["status"]) || room.status,
            note: formData.get("note") as string || room.note,
            price: Number(formData.get("price")) || room.price,
            room_type: {
              id: roomTypeId,
              name: ["Standard Room", "Deluxe Room", "Suite Room", "VIP Room"][roomTypeId - 1] || room.room_type?.name || "Standard Room"
            }
          };
        }
        return room;
      }));
      
      toast.success("Cập nhật thành công!", { id: tId });
    } catch (error: any) {
      toast.error("Cập nhật thất bại!", { id: tId });
      throw error;
    }
  };

  const deleteRoom = async (id: number) => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa phòng này không?");
    if (!isConfirm) return;

    const tId = toast.loading("Đang xóa...");
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setRooms((prev) => prev.filter((r) => r.id !== id));
      toast.success("Đã xóa xong", { id: tId });
    } catch (error) {
      toast.error("Lỗi khi xóa dữ liệu!", { id: tId });
    }
  };

  return {
    rooms,
    loading,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};