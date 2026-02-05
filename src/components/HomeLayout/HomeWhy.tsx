import React from "react";
import { motion } from "framer-motion";

export function HomeWhy() {
    return (
        <section id="why" className="mx-auto max-w-6xl px-4 pb-14">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200/70 md:p-8">
                <div className="grid gap-6 md:grid-cols-3">
                    {[
                        { title: "Tối ưu trải nghiệm", desc: "UI gọn, dễ đặt, hiệu ứng mượt vừa đủ." },
                        { title: "Giá tốt theo mùa", desc: "Ưu đãi spring deal cập nhật linh hoạt." },
                        { title: "Tin cậy & an toàn", desc: "Thanh toán an toàn, hỗ trợ 24/7." },
                    ].map((x) => (
                        <motion.div
                            key={x.title}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white p-5 ring-1 ring-emerald-100/60"
                        >
                            <div className="text-sm font-semibold">{x.title}</div>
                            <div className="mt-2 text-sm text-slate-600">{x.desc}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
