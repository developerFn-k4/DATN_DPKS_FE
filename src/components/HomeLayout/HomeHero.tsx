import React from "react";
import { Button, DatePicker, Input, Select, Tag, Rate } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { motion, useScroll, useTransform } from "framer-motion"; 
import type { CityOption, SearchState } from "../../types/types";

const { RangePicker } = DatePicker;

const container = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, duration: 0.55, ease: "easeOut" } },
};

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

type Props = {
    cities: CityOption[];
    value: SearchState;
    onChange: (patch: Partial<SearchState>) => void;
    onSearch?: () => void;
};

export function HomeHero({ cities, value, onChange, onSearch }: Props) {
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 400], [0, 80]);
    const fgY = useTransform(scrollY, [0, 400], [0, -20]);

    return (
        <section className="relative overflow-hidden">
            <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
                <div
                    className="h-[560px] w-full"
                    style={{
                        backgroundImage:
                            "radial-gradient(800px 300px at 20% 20%, rgba(16,185,129,0.25), transparent 60%), radial-gradient(700px 280px at 80% 30%, rgba(163,230,53,0.22), transparent 60%), radial-gradient(900px 340px at 50% 80%, rgba(34,197,94,0.12), transparent 60%)",
                    }}
                />
            </motion.div>

            <div className="mx-auto max-w-6xl px-4 pt-10 pb-10 md:pt-14">
                <motion.div variants={container} initial="hidden" animate="show" className="grid gap-8 md:grid-cols-2 md:items-center">
                    <motion.div variants={item}>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Mùa xuân: ưu đãi lên đến 25%
                        </div>

                        <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
                            Đặt phòng nhanh, trải nghiệm{" "}
                            <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
                                tươi mới
                            </span>{" "}
                            mỗi chuyến đi.
                        </h1>

                        <p className="mt-4 max-w-xl text-base text-slate-600">
                            Tìm khách sạn phù hợp với lịch trình của bạn — giao diện gọn, hiện đại, hiệu ứng nhẹ nhàng.
                        </p>

                        <motion.div style={{ y: fgY }} className="mt-6 flex flex-wrap gap-2">
                            {["Hoàn huỷ linh hoạt", "Thanh toán an toàn", "Hỗ trợ 24/7"].map((t) => (
                                <span key={t} className="rounded-full bg-white/70 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
                                    {t}
                                </span>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div variants={item} className="relative">
                        <div className="rounded-2xl bg-white/80 p-4 shadow-[0_20px_60px_-30px_rgba(2,6,23,0.35)] ring-1 ring-white/60 backdrop-blur-xl md:p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold">Tìm phòng</div>
                                    <div className="text-xs text-slate-500">Chọn điểm đến và ngày để xem giá tốt</div>
                                </div>
                                <div className="hidden md:block">
                                    <Tag color="green">Spring Deal</Tag>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3">
                                <div className="grid gap-2 md:grid-cols-2">
                                    <div>
                                        <div className="mb-1 text-xs text-slate-500">Điểm đến</div>
                                        <Select
                                            size="large"
                                            className="w-full"
                                            value={value.city}
                                            options={cities}
                                            onChange={(v) => onChange({ city: v })}
                                            suffixIcon={<EnvironmentOutlined />}
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-1 text-xs text-slate-500">Số khách</div>
                                        <Select
                                            size="large"
                                            className="w-full"
                                            value={value.guests}
                                            onChange={(v) => onChange({ guests: v })}
                                            options={[1, 2, 3, 4, 5, 6].map((n) => ({ label: `${n} khách`, value: n }))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-1 text-xs text-slate-500">Ngày nhận / trả</div>
                                    <RangePicker
                                        size="large"
                                        className="w-full"
                                        value={value.range as RangePickerProps["value"]}
                                        onChange={(v) => onChange({ range: v })}
                                        placeholder={["Nhận phòng", "Trả phòng"]}
                                    />
                                </div>

                                <div>
                                    <div className="mb-1 text-xs text-slate-500">Từ khoá</div>
                                    <Input
                                        size="large"
                                        value={value.keyword}
                                        onChange={(e) => onChange({ keyword: e.target.value })}
                                        prefix={<SearchOutlined />}
                                        placeholder="Ví dụ: gần biển, view đẹp..."
                                    />
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    className="!bg-emerald-600 hover:!bg-emerald-700"
                                    onClick={onSearch}
                                >
                                    Tìm kiếm
                                </Button>

                                <div className="text-xs text-slate-500">Mẹo: chọn khoảng ngày để thấy giá tốt theo mùa.</div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                            className="pointer-events-none absolute -top-6 right-4 hidden md:block"
                        >
                            <div className="rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-white/60 backdrop-blur-xl">
                                <div className="text-xs text-slate-500">Đánh giá TB</div>
                                <div className="flex items-center gap-2">
                                    <Rate disabled allowHalf defaultValue={4.5} />
                                    <span className="text-xs text-slate-500">4.6</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
