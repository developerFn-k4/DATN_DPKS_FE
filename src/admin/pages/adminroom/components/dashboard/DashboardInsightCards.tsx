import React from "react";
import type { DashboardInsightItem } from "../../types/dashboard";
 
type Props = {
    items: DashboardInsightItem[];
};

export function DashboardInsightCards({ items }: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {items.map((item) => (
                <div
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                    <p className="text-sm text-slate-500">{item.title}</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
                </div>
            ))}
        </div>
    );
}