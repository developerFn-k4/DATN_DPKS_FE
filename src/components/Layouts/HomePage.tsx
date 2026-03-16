import { useState } from "react";
import { message, Select, Spin, Empty } from "antd";
import { CalendarOutlined, UserOutlined, SortAscendingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { SpringBackdrop } from "../HomeLayout/SpringBackdrop";
import { HomeHeader } from "../Header/HomeHeader";
import { HomeHero } from "../HomeLayout/HomeHero";
import { HomeDeals } from "../HomeLayout/HomeDeals";
import { HomePopular } from "../HomeLayout/HomePopular";
import { HomeWhy } from "../HomeLayout/HomeWhy";
import { HomeFooter } from "../Footer/HomeFooter";
import { HomeBanner } from "../HomeLayout/HomeBanner";
import { HomeQuickFilters } from "../HomeLayout/HomeQuickFilters";
import { RoomCard } from "../RoomCard";
import type { SearchState, RoomItem } from "../../types/types";
import { cities } from "../../services/data";
import { searchAvailableRooms } from "../../services/roomsHomePage/availableRooms.service";

export default function HomePage() {
    const [search, setSearch] = useState<SearchState>({
        city: "danang",
        keyword: "",
        guests: 2,
        range: null,
    });

    const [availableRooms, setAvailableRooms] = useState<RoomItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
    
    const [quick, setQuick] = useState<{ tags: string[]; priceBand?: "budget" | "mid" | "lux"; ratingMin?: 4 | 4.5 }>({ tags: [], priceBand: undefined, ratingMin: undefined });

    // Sort rooms based on selected option
    const sortedRooms = [...availableRooms].sort((a, b) => {
        switch (sortBy) {
            case "price-asc":
                return a.price - b.price;
            case "price-desc":
                return b.price - a.price;
            default:
                return 0;
        }
    });

    // Hàm xử lý tìm kiếm phòng
    const handleSearch = async () => {
        if (!search.range || !search.range[0] || !search.range[1]) {
            message.warning("Vui lòng chọn ngày nhận và trả phòng!");
            return;
        }

        try {
            setLoading(true);
            setHasSearched(true);
            
            const checkIn = dayjs(search.range[0]).format("YYYY-MM-DD");
            const checkOut = dayjs(search.range[1]).format("YYYY-MM-DD");
            
            const rooms = await searchAvailableRooms({
                check_in: checkIn,
                check_out: checkOut,
                guests: search.guests,
            });

            setAvailableRooms(rooms);

            if (rooms.length === 0) {
                message.info("Không tìm thấy phòng nào phù hợp với yêu cầu của bạn.");
            } else {
                message.success(`Tìm thấy ${rooms.length} phòng có sẵn!`);
            }
        } catch (error) {
            console.error("Search error:", error);
            message.error("Có lỗi xảy ra khi tìm kiếm phòng!");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen max-w-full bg-gradient-to-b from-emerald-50 via-white to-white text-slate-900">
            <SpringBackdrop />
            <HomeHeader />

            <main>
                <HomeHero
                    cities={cities}
                    value={search}
                    onChange={(patch) => setSearch((s) => ({ ...s, ...patch }))}
                    onSearch={handleSearch}
                    loading={loading}
                />
                <HomeBanner />
                <HomeQuickFilters value={quick} onChange={(p) => setQuick((s) => ({ ...s, ...p }))} />
                <HomeDeals />
                
                {/* Hiển thị kết quả tìm kiếm */}
                {hasSearched && (
                    <section className="mx-auto max-w-6xl px-4 py-12">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Spin size="large" tip="Đang tìm kiếm phòng..." />
                            </div>
                        ) : availableRooms.length > 0 ? (
                            <>
                                {/* Header với thông tin tìm kiếm */}
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                                Tìm thấy {availableRooms.length} phòng có sẵn
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                                {search.range && (
                                                    <span className="flex items-center gap-1.5">
                                                        <CalendarOutlined className="text-emerald-600" />
                                                        {dayjs(search.range[0]).format("DD/MM/YYYY")} - {dayjs(search.range[1]).format("DD/MM/YYYY")}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1.5">
                                                    <UserOutlined className="text-emerald-600" />
                                                    {search.guests} khách
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Sort dropdown */}
                                        <div className="flex items-center gap-2">
                                            <SortAscendingOutlined className="text-slate-500" />
                                            <Select
                                                value={sortBy}
                                                onChange={setSortBy}
                                                className="w-48"
                                                options={[
                                                    { value: "default", label: "Mặc định" },
                                                    { value: "price-asc", label: "Giá: Thấp đến cao" },
                                                    { value: "price-desc", label: "Giá: Cao đến thấp" },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Grid hiển thị phòng */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {sortedRooms.map((room, index) => (
                                        <motion.div
                                            key={room.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                        >
                                            <RoomCard room={room} />
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-16"
                            >
                                <Empty
                                    description={
                                        <div className="text-center">
                                            <p className="text-lg font-semibold text-slate-700 mb-2">
                                                Không tìm thấy phòng nào
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Vui lòng thử thay đổi ngày hoặc số lượng khách để tìm phòng phù hợp
                                            </p>
                                        </div>
                                    }
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            </motion.div>
                        )}
                    </section>
                )}

                <HomePopular />
                <HomeWhy />
            </main>

            <HomeFooter />
        </div>
    );
}
