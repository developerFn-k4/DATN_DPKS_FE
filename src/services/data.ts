import type { CityOption, HotelItem } from "../types/types";


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
