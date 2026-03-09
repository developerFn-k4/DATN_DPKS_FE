import React, { useMemo, useState } from "react";
import { Tag } from "antd";
import {
    EnvironmentOutlined,
    CompassOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import type { CityOption, HotelItem } from "../../types/types";
import { useRooms } from "../../hooks/roomsHomePage/useRooms";
import { RoomDetailModal } from "./RoomDetailModal";



type Props = {
    hotels: HotelItem[];
    cities: CityOption[];
};

const reveal = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cityMeta: Record<string, { tagline: string; cover: string; badge: string }> = {
    danang: {
        tagline: "Gần biển – vibe năng động",
        badge: "Sea",
        cover:
            "https://images.squarespace-cdn.com/content/v1/5aadf482aa49a1d810879b88/1626699646062-KDFCBGDNTTYZYB0CC71E/5.1.jpg?format=2500w",
    },
    dalat: {
        tagline: "Xanh mát – chill nhẹ",
        badge: "Green",
        cover:
            "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1400&q=80",
    },
    phuquoc: {
        tagline: "Resort – hoàng hôn",
        badge: "Sunset",
        cover:
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80",
    },
};

const roomImages = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=80",
];

export function HomePopular() {
    const { data: rooms = [], isLoading } = useRooms();

    const featuredRooms = useMemo(() => rooms.slice(0, 3), [rooms]);
    const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>();
    const [open, setOpen] = useState(false);
    if (isLoading) return <div>Loading...</div>;

    return (
        <section id="popular" className="mx-auto max-w-6xl px-4 pb-12">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold md:text-2xl">
                        Gợi ý khách sạn
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Các phòng nổi bật từ hệ thống.
                    </p>
                </div>
            </div>

            <div className="mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {featuredRooms.map((room, index) => {

                    const meta = {
                        tagline: room.room_type.description,
                        badge: room.room_type.bed_type,
                        cover: roomImages[index % roomImages.length],
                    };

                    return (
                        <motion.div
                            key={room.id}
                            variants={reveal}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.25 }}
                            whileHover={{ y: -6 }}
                            transition={{ type: "spring", stiffness: 260, damping: 18 }}
                            className="group relative overflow-hidden rounded-2xl ring-1 ring-slate-200/70"
                            onClick={() => {
                                setSelectedRoomId(room.id);
                                setOpen(true);
                            }}
                        >
                            <img
                                src={meta.cover}
                                alt={room.room_type.name}
                                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

                            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs text-white ring-1 ring-white/20 backdrop-blur">
                                <CompassOutlined />
                                <span>{meta.tagline}</span>
                            </div>

                            <div className="absolute left-4 bottom-4 right-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="text-base font-semibold">
                                        {room.room_type.name}
                                    </div>
                                    <Tag color="green">{meta.badge}</Tag>
                                </div>

                                <div className="mt-2 flex items-center gap-2 text-xs text-white/85">
                                    <EnvironmentOutlined />
                                    <span>
                                        {Number(room.room_type.base_price).toLocaleString()} {room.room_type.currency}
                                    </span>
                                </div>
                            </div>

                            <motion.span
                                className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-300/25 blur-2xl"
                                animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.25, 0.45, 0.25] }}
                                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.div>
                    );
                })}
            </div>
            <RoomDetailModal
                roomId={selectedRoomId}
                open={open}
                onClose={() => setOpen(false)}
            />
        </section>
    );
}
