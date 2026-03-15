import React from "react";
import { useParams } from "react-router-dom";
import { useRoomDetail } from "../hooks/RoomHook";
import { HomeHeader } from "../../../../../components/Header/HomeHeader";
import { HomeFooter } from "../../../../../components/Footer/HomeFooter";
import RoomDetailView from "../components/RoomDetailComponent";

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const roomId = Number(id);
  const { data, loading, error } = useRoomDetail(roomId);

  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />

      <main className="flex-grow bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <div className="text-emerald-600 font-medium animate-pulse">
              Đang tải thông tin phòng...
            </div>
          </div>
        ) : error || !data ? (
          <div className="flex flex-col items-center justify-center py-32 text-center px-4">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Không tìm thấy thông tin phòng
            </h2>
            <p className="text-slate-500 max-w-md">
              {error || "Yêu cầu của bạn không thể thực hiện được vào lúc này. Vui lòng thử lại sau."}
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            <RoomDetailView data={data} />
          </div>
        )}
      </main>

      <HomeFooter />
    </div>
  );
};

export default RoomDetailPage;