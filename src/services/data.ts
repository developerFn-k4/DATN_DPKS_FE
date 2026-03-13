import type { CityOption, HotelItem, RoomItem } from "../types/types";



export const cities: CityOption[] = [
    { label: "Đà Nẵng", value: "danang" },
    { label: "Đà Lạt", value: "dalat" },
    { label: "Phú Quốc", value: "phuquoc" },
];

export const sampleHotels: HotelItem[] = [
    {
        id: 1,
        name: "Bloom Riverside Hotel",
        city: "danang",
        priceFrom: 890000,
        rating: 4.6,
        tags: ["Gần biển", "View sông", "Buffet sáng"],
        img: "https://images.squarespace-cdn.com/content/v1/5aadf482aa49a1d810879b88/1626699646062-KDFCBGDNTTYZYB0CC71E/5.1.jpg?format=2500w",
    },
    {
        id: 2,
        name: "Spring Garden Retreat",
        city: "dalat",
        priceFrom: 1050000,
        rating: 4.8,
        tags: ["Không gian xanh", "Yên tĩnh", "Cafe sân vườn"],
        img: "https://www.propertyvietnam.com.vn/upload/category/top-15-resort-dep-nhat-viet-nam-ai-cung-nen-den-mot-lan-trong-doi-1543821686.jpg",
    },
    {
        id: 3,
        name: "Coastal Breeze Resort",
        city: "phuquoc",
        priceFrom: 1790000,
        rating: 4.7,
        tags: ["Resort", "Hồ bơi", "Sunset"],
        img: "https://images.squarespace-cdn.com/content/v1/5aadf482aa49a1d810879b88/1626698419120-J7CH9BPMB2YI728SLFPN/1.jpg?format=2500w",
    },
];

export const sampleRooms: RoomItem[] = [
    {
        id: 1,
        name: "Đà Nẵng",
        city: "Đà Nẵng",
        type: "Gần biển – vibe nắng đông",
        features: ["Khám phá điểm đến"],
        price: 0,
        image: "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800",
        label: "Sea",
        labelColor: "bg-blue-500"
    },
    {
        id: 2,
        name: "Đà Lạt",
        city: "Đà Lạt",
        type: "Xanh mát – chill nhẹ",
        features: ["Khám phá điểm đến"],
        price: 0,
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        label: "Green",
        labelColor: "bg-green-600"
    },
    {
        id: 3,
        name: "Phú Quốc",
        city: "Phú Quốc",
        type: "Resort – hoàng hôn",
        features: ["Khám phá điểm đến"],
        price: 0,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        label: "Sunset",
        labelColor: "bg-orange-500"
    },
    {
        id: 4,
        name: "Deluxe Ocean View",
        city: "Đà Nẵng",
        type: "Phòng cao cấp view biển",
        features: ["Ban công riêng", "Giường King", "Minibar"],
        price: 1200000,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        label: "Premium",
        labelColor: "bg-purple-600"
    },
    {
        id: 5,
        name: "Garden Suite",
        city: "Đà Lạt",
        type: "Suite view vườn",
        features: ["2 phòng ngủ", "Bồn tắm", "Bếp nhỏ"],
        price: 1500000,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        label: "Suite",
        labelColor: "bg-emerald-600"
    },
    {
        id: 6,
        name: "Beach Villa",
        city: "Phú Quốc",
        type: "Villa bãi biển riêng",
        features: ["Hồ bơi riêng", "3 phòng ngủ", "BBQ"],
        price: 3500000,
        image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800",
        label: "Luxury",
        labelColor: "bg-amber-600"
    },
    {
        id: 7,
        name: "Standard Twin",
        city: "Đà Nẵng",
        type: "Phòng tiêu chuẩn 2 giường",
        features: ["2 giường đơn", "TV", "Wifi"],
        price: 650000,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
        label: "Value",
        labelColor: "bg-blue-400"
    },
    {
        id: 8,
        name: "Forest Bungalow",
        city: "Đà Lạt",
        type: "Nhà gỗ trong rừng",
        features: ["Lò sưởi", "Sân thượng", "Tầm nhìn rừng"],
        price: 980000,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        label: "Nature",
        labelColor: "bg-green-700"
    },
    {
        id: 9,
        name: "Sunset Penthouse",
        city: "Phú Quốc",
        type: "Penthouse tầng cao",
        features: ["View 360°", "Jacuzzi", "Phòng khách rộng"],
        price: 4200000,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        label: "VIP",
        labelColor: "bg-rose-600"
    }
];

