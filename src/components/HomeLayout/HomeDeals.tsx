import React from "react";
import { Button, Tag } from "antd";
import { motion } from "framer-motion";
import {
  FireOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const container = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, duration: 0.55, ease: "easeOut" } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const deals = [
  { title: "Weekend Escape", desc: "Giảm 15% cho cuối tuần", badge: "Hot", icon: <FireOutlined /> },
  { title: "Family Pack", desc: "Combo phòng + buffet sáng", badge: "New", icon: <GiftOutlined /> },
  { title: "Early Bird", desc: "Đặt sớm tiết kiệm hơn", badge: "Save", icon: <ClockCircleOutlined /> },
];

export function HomeDeals() {
  return (
    <section id="deals" className="mx-auto max-w-6xl px-4 py-10">
      <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <motion.div variants={item} className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">Ưu đãi mùa xuân</h2>
            <p className="mt-1 text-sm text-slate-600">Nhẹ nhàng, tươi mới – ưu đãi vừa đủ “đã”.</p>
          </div>
          <Button className="hidden md:inline-flex">Xem tất cả</Button>
        </motion.div>

        <motion.div variants={item} className="mt-5 grid gap-4 md:grid-cols-3">
          {deals.map((d) => (
            <motion.div
              key={d.title}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-slate-200/70"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />
              <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-lime-200/25 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                    {d.icon}
                  </span>
                  <div className="text-sm font-semibold">{d.title}</div>
                </div>

                <div className="relative">
                  <Tag color="green">{d.badge}</Tag>
                  <motion.span
                    className="absolute -right-2 -top-2 h-2 w-2 rounded-full bg-emerald-400"
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.9, 1.2, 0.9] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>

              <div className="relative mt-2 text-sm text-slate-600">{d.desc}</div>

              <div className="relative mt-4">
                <Button type="link" className="p-0 text-emerald-700">
                  Xem chi tiết <ArrowRightOutlined />
                </Button>
              </div>

              <motion.div
                className="pointer-events-none absolute -left-24 top-0 h-full w-20 rotate-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"
                animate={{ x: ["-10%", "170%"] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
