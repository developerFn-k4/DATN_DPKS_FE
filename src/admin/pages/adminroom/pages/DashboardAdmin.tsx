import { DashboardFilterBar } from "../components/dashboard/DashboardFilterBar";
import { DashboardInsightCards } from "../components/dashboard/DashboardInsightCards";
import { DashboardMetricBarChart } from "../components/dashboard/DashboardMetricBarChart";
import { DashboardOverviewCards } from "../components/dashboard/DashboardOverviewCards";
import { DashboardSummaryCards } from "../components/dashboard/DashboardSummaryCards";
import { useAdminDashboard } from "../hooks/useAdminDashboard";

 
function formatCurrency(value: number) {
    return `${value.toLocaleString("vi-VN")} đ`;
}

const DashboardAdmin = () => {
    const {
        isLoading,
        isError,
        error,
        data,
        viewType,
        setViewType,
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        availableYears,
        rows,
        summary,
        insights,
        filterLabel,
    } = useAdminDashboard();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="space-y-4">
                    <div className="h-24 animate-pulse rounded-3xl bg-slate-200" />
                    <div className="h-24 animate-pulse rounded-3xl bg-slate-200" />
                    <div className="h-24 animate-pulse rounded-3xl bg-slate-200" />
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="h-[380px] animate-pulse rounded-3xl bg-slate-200" />
                        <div className="h-[380px] animate-pulse rounded-3xl bg-slate-200" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-600">
                    {(error as Error)?.message || "Có lỗi xảy ra khi tải dashboard"}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <h6 className="text-3xl font-bold tracking-tight text-slate-950">
                        Admin Dashboard
                    </h6>
                    <p className="mt-1 text-sm text-slate-500">
                        Theo dõi tổng quan hệ thống, booking và doanh thu
                    </p>
                </div>

                <DashboardOverviewCards admin={data?.admin} stats={data?.stats} />

                <DashboardFilterBar
                    viewType={viewType}
                    onChangeViewType={setViewType}
                    selectedYear={selectedYear}
                    onChangeYear={setSelectedYear}
                    selectedMonth={selectedMonth}
                    onChangeMonth={setSelectedMonth}
                    availableYears={availableYears}
                />

                <DashboardSummaryCards title={filterLabel} summary={summary} />

                <DashboardInsightCards items={insights} />

                <div className="grid gap-6 lg:grid-cols-2">
                    <DashboardMetricBarChart
                        title="Booking"
                        subtitle="Biểu đồ số lượng booking theo bộ lọc đang chọn"
                        rows={rows}
                        viewType={viewType}
                        dataKey="bookings"
                        fill="#2563eb"
                        valueFormatter={(value) => value.toLocaleString("vi-VN")}
                    />

                    <DashboardMetricBarChart
                        title="Doanh thu"
                        subtitle="Biểu đồ doanh thu theo bộ lọc đang chọn"
                        rows={rows}
                        viewType={viewType}
                        dataKey="revenue"
                        fill="#16a34a"
                        valueFormatter={formatCurrency}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;