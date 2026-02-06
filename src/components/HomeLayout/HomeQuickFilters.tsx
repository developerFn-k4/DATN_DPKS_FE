import React from "react";
import { Tag, Tooltip, Button } from "antd";
import {
  CoffeeOutlined,
  FireOutlined,
  StarOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

type QuickFiltersValue = {
  tags: string[];         
  priceBand?: "budget" | "mid" | "lux";
  ratingMin?: 4 | 4.5;
};

type Props = {
  value: QuickFiltersValue;
  onChange: (patch: Partial<QuickFiltersValue>) => void;
  scrollToId?: string; 
};

const FILTERS: Array<{
  key: string;
  label: string;
  icon: React.ReactNode;
  hint?: string;
}> = [
  { key: "near_beach", label: "Gần biển", icon: <EnvironmentOutlined />, hint: "Ưu tiên khu vực biển" },
  { key: "pool", label: "Hồ bơi", icon: <ThunderboltOutlined />, hint: "Có hồ bơi / infinity pool" },
  { key: "breakfast", label: "Buffet sáng", icon: <CoffeeOutlined />, hint: "Bao gồm bữa sáng" },
  { key: "hot_deal", label: "Giảm giá", icon: <FireOutlined />, hint: "Deal đang hot" },
  { key: "top_rated", label: "Đánh giá cao", icon: <StarOutlined />, hint: "Ưu tiên rating cao" },
  { key: "homestay", label: "Homestay", icon: <HomeOutlined />, hint: "Không gian ấm cúng" },
];

function scrollTo(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomeQuickFilters({ value, onChange, scrollToId = "popular" }: Props) {
  const active = new Set(value.tags);

  const toggle = (k: string) => {
    const next = new Set(active);
    if (next.has(k)) next.delete(k);
    else next.add(k);

    const tags = Array.from(next);
    const ratingMin = tags.includes("top_rated") ? 4.5 : undefined;

    onChange({ tags, ratingMin });
    scrollTo(scrollToId);
  };

  const setPrice = (band?: QuickFiltersValue["priceBand"]) => {
    onChange({ priceBand: band });
    scrollTo(scrollToId);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="rounded-3xl bg-white p-5 ring-1 ring-slate-200/70 md:p-6"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold">Bộ lọc nhanh</div>
            <div className="mt-1 text-sm text-slate-600">
              Chọn nhanh tiêu chí phù hợp — click để lọc và cuộn xuống gợi ý.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="small"
              onClick={() => onChange({ tags: [], priceBand: undefined, ratingMin: undefined })}
            >
              Reset
            </Button>

            <div className="hidden h-5 w-px bg-slate-200 md:block" />

            <Tooltip title="Giá mềm">
              <Button
                size="small"
                icon={<CrownOutlined />}
                type={value.priceBand === "budget" ? "primary" : "default"}
                className={value.priceBand === "budget" ? "!bg-emerald-600 hover:!bg-emerald-700" : ""}
                onClick={() => setPrice(value.priceBand === "budget" ? undefined : "budget")}
              >
                Budget
              </Button>
            </Tooltip>

            <Tooltip title="Tầm trung">
              <Button
                size="small"
                icon={<SafetyCertificateOutlined />}
                type={value.priceBand === "mid" ? "primary" : "default"}
                className={value.priceBand === "mid" ? "!bg-emerald-600 hover:!bg-emerald-700" : ""}
                onClick={() => setPrice(value.priceBand === "mid" ? undefined : "mid")}
              >
                Mid
              </Button>
            </Tooltip>

            <Tooltip title="Cao cấp">
              <Button
                size="small"
                icon={<CrownOutlined />}
                type={value.priceBand === "lux" ? "primary" : "default"}
                className={value.priceBand === "lux" ? "!bg-emerald-600 hover:!bg-emerald-700" : ""}
                onClick={() => setPrice(value.priceBand === "lux" ? undefined : "lux")}
              >
                Lux
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const selected = active.has(f.key);

            return (
              <Tooltip key={f.key} title={f.hint} placement="top">
                <motion.span
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                >
                  <Tag
                    className={[
                      "cursor-pointer select-none rounded-full px-3 py-1 text-sm",
                      selected
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                    onClick={() => toggle(f.key)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className={selected ? "text-emerald-700" : "text-slate-500"}>{f.icon}</span>
                      <span>{f.label}</span>
                      {selected && (
                        <motion.span
                          className="ml-1 inline-block h-2 w-2 rounded-full bg-emerald-500"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </span>
                  </Tag>
                </motion.span>
              </Tooltip>
            );
          })}
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Tip: chọn “Đánh giá cao” để ưu tiên khách sạn có rating tốt hơn.
        </div>
      </motion.div>
    </section>
  );
}
