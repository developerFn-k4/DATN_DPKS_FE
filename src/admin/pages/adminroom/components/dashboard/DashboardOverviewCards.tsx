import React from "react"; import type { AdminProfile, DashboardStats } from "../../types/dashboard";


type Props = {
  admin?: AdminProfile;
  stats?: DashboardStats;
};

const cardClass =
  "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm";

export function DashboardOverviewCards({ admin, stats }: Props) {
  const avatarFallback = admin?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
      <div className={`${cardClass} xl:col-span-1`}>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
            {avatarFallback}
          </div>

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-slate-400">Admin</p>
            <p className="truncate text-lg font-semibold text-slate-900">
              {admin?.name || "--"}
            </p>
            <p className="truncate text-sm text-slate-500">
              {admin?.email || "--"}
            </p>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <p className="text-sm text-slate-500">Tổng số phòng</p>
        <p className="mt-3 text-3xl font-bold text-slate-900">
          {stats?.total_rooms ?? 0}
        </p>
      </div>

      <div className={cardClass}>
        <p className="text-sm text-slate-500">Loại phòng</p>
        <p className="mt-3 text-3xl font-bold text-slate-900">
          {stats?.total_room_types ?? 0}
        </p>
      </div>

      <div className={cardClass}>
        <p className="text-sm text-slate-500">Người dùng</p>
        <p className="mt-3 text-3xl font-bold text-slate-900">
          {stats?.total_users ?? 0}
        </p>
      </div>
    </div>
  );
}