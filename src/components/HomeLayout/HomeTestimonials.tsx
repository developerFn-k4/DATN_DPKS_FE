import React from "react";
import { Card, Rate, Avatar, Tag } from "antd";
import { motion } from "framer-motion";
import { SmileOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

type Testimonial = {
    name: string;
    city: string;
    rating: number;
    text: string;
    badge?: string;
};

const testimonials: Testimonial[] = [
    {
        name: "Minh Anh",
        city: "Đà Nẵng",
        rating: 5,
        text: "Giao diện đặt phòng nhanh, dễ hiểu. Deal mùa xuân rất ổn, check-in mượt.",
        badge: "Top review",
    },
    {
        name: "Quang Huy",
        city: "Phú Quốc",
        rating: 4.5,
        text: "Chọn ngày – lọc khách sạn tiện. Có phần gợi ý địa điểm giúp mình quyết nhanh.",
        badge: "Helpful",
    },
    {
        name: "Thảo Nhi",
        city: "Đà Lạt",
        rating: 5,
        text: "Phong cách spring nhìn dễ chịu. Animation nhẹ nhàng, không bị rối mắt.",
    },
    {
        name: "Hoàng Nam",
        city: "Đà Nẵng",
        rating: 4,
        text: "Tìm kiếm ổn, mong có thêm bộ lọc tiện nghi (hồ bơi, buffet) là perfect.",
    },
    {
        name: "Thuỳ Dương",
        city: "Phú Quốc",
        rating: 4.5,
        text: "Mình thích phần banner slide và ưu đãi. Trải nghiệm giống app đặt phòng thật.",
        badge: "Fresh",
    },
    {
        name: "Gia Bảo",
        city: "Đà Lạt",
        rating: 5,
        text: "Card khách sạn đẹp, xem nhanh thông tin. Nếu có map view nữa thì tuyệt.",
    },
];

const reveal = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut", delay: i * 0.05 },
    }),
};

export function HomeTestimonials() {
    return (
        <section className="mx-auto max-w-6xl px-4 pb-14">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold md:text-2xl">Khách hàng nói gì</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Social proof giúp trang chủ “đỡ đơn giản” và tăng độ tin cậy.
                    </p>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <Tag color="green" icon={<SafetyCertificateOutlined />}>
                        Trusted
                    </Tag>
                    <Tag color="processing" icon={<SmileOutlined />}>
                        Spring vibe
                    </Tag>
                </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t, i) => (
                    <motion.div
                        key={t.name + i}
                        custom={i}
                        variants={reveal}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        whileHover={{ y: -6 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    >
                        <Card className="rounded-2xl" styles={{ body: { padding: 16 } as any }}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        size={40}
                                        style={{ background: "linear-gradient(135deg, #34d399, #a3e635)" }}
                                    >
                                        {t.name.trim().slice(0, 1).toUpperCase()}
                                    </Avatar>
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-semibold">{t.name}</div>
                                        <div className="text-xs text-slate-500">{t.city}</div>
                                    </div>
                                </div>

                                {t.badge ? <Tag color="green">{t.badge}</Tag> : null}
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <Rate allowHalf disabled defaultValue={t.rating} />
                                <div className="text-xs text-slate-500">{t.rating.toFixed(1)}/5</div>
                            </div>

                            <div className="mt-3 text-sm text-slate-600 leading-relaxed">
                                “{t.text}”
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
