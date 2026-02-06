import React from "react";
import { Carousel, Button, Tag } from "antd";
import { motion } from "framer-motion";
import { ThunderboltOutlined, GiftOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

type Slide = {
    title: string;
    subtitle: string;
    badge: string;
    icon: React.ReactNode;
    image: string;
};

const slides: Slide[] = [
    {
        title: "Spring Bloom Deals",
        subtitle: "Ưu đãi lên đến 25% cho kỳ nghỉ cuối tuần",
        badge: "Hot",
        icon: <ThunderboltOutlined />,
        image:
            "https://acihome.vn/uploads/15/thiet-ke-khach-san-hien-dai-co-cac-ban-cong-view-bien-sieu-dep-seaside-mirage-hotel-1.JPG",
    },
    {
        title: "Family & Friends",
        subtitle: "Combo phòng + buffet sáng, giá tốt theo nhóm",
        badge: "New",
        icon: <GiftOutlined />,
        image:
            "https://acihome.vn/uploads/15/thiet-ke-khach-san-hien-dai-co-cac-ban-cong-view-bien-sieu-dep-seaside-mirage-hotel-4.JPG",
    },
    {
        title: "Secure Booking",
        subtitle: "Thanh toán an toàn, hỗ trợ 24/7 – hoàn huỷ linh hoạt",
        badge: "Safe",
        icon: <SafetyCertificateOutlined />,
        image:
            "https://acihome.vn/uploads/15/thiet-ke-khach-san-hien-dai-co-cac-ban-cong-view-bien-sieu-dep-seaside-mirage-hotel-2.JPG",
    },
];

export function HomeBanner() {
    return (
        <section className="mx-auto max-w-6xl px-4 pt-8">
            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70">
                <Carousel autoplay autoplaySpeed={4500} effect="fade" dots>
                    {slides.map((s) => (
                        <div key={s.title}>
                            <div className="relative h-[240px] md:h-[320px]">
                                <img src={s.image} className="h-full w-full object-cover" alt={s.title} />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-transparent" />

                                <motion.div
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.55, ease: "easeOut" }}
                                    className="absolute inset-0 flex items-center"
                                >
                                    <div className="w-full px-5 md:px-10">
                                        <div className="flex items-center gap-2">
                                            <Tag color="green">{s.badge}</Tag>
                                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white ring-1 ring-white/15">
                                                {s.icon}
                                                <span>Spring Theme</span>
                                            </div>
                                        </div>

                                        <div className="mt-3 max-w-xl text-2xl font-semibold text-white md:text-4xl">
                                            {s.title}
                                        </div>
                                        <div className="mt-2 max-w-xl text-sm text-white/85 md:text-base">
                                            {s.subtitle}
                                        </div>

                                        <div className="mt-5 flex gap-2">
                                            <Button
                                                type="primary"
                                                className="!bg-emerald-600 hover:!bg-emerald-700"
                                            >
                                                Xem ưu đãi
                                            </Button>
                                            <Button className="bg-white/10 text-white ring-1 ring-white/20 hover:!text-white hover:!border-white/30">
                                                Tìm phòng ngay
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="pointer-events-none absolute -left-20 top-0 h-full w-40 rotate-12 bg-white/10 blur-xl"
                                    animate={{ x: ["-20%", "140%"] }}
                                    transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                                />
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}
