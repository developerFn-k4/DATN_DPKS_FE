import React from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { DashboardRow, DashboardViewType } from "../../types/dashboard";
 
type Props = {
    title: string;
    subtitle: string;
    rows: DashboardRow[];
    viewType: DashboardViewType;
    dataKey: "bookings" | "revenue";
    colorClass?: string;
    fill: string;
    valueFormatter?: (value: number) => string;
};

function defaultValueFormatter(value: number) {
    return value.toLocaleString("vi-VN");
}

function compactCurrency(value: number) {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return `${value}`;
}

function getChartLabel(row: DashboardRow, viewType: DashboardViewType) {
    if (viewType === "day" && row.date) {
        const date = new Date(row.date);
        return String(date.getDate()).padStart(2, "0");
    }

    if (viewType === "month") {
        return `T${row.month}`;
    }

    return `${row.year}`;
}

export function DashboardMetricBarChart({
    title,
    subtitle,
    rows,
    viewType,
    dataKey,
    fill,
    valueFormatter = defaultValueFormatter,
}: Props) {
    const chartData = React.useMemo(() => {
        return rows.map((row) => ({
            ...row,
            chartLabel: getChartLabel(row, viewType),
        }));
    }, [rows, viewType]);

    const yAxisTickFormatter = React.useMemo(() => {
        if (dataKey === "revenue") return compactCurrency;
        return (value: number) => `${value}`;
    }, [dataKey]);

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500">{subtitle}</p>
            </div>

            <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="chartLabel"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                            tickFormatter={yAxisTickFormatter}
                        />
                        <Tooltip
                            cursor={{ fill: "#f8fafc" }}
                            formatter={(value: number) => [valueFormatter(Number(value)), title]}
                            labelFormatter={(label) => `Mốc: ${label}`}
                        />
                        <Bar
                            dataKey={dataKey}
                            fill={fill}
                            radius={[10, 10, 0, 0]}
                            maxBarSize={36}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}