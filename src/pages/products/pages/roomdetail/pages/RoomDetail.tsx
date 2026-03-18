import React from "react";
import { useParams } from "react-router-dom";
import { HomeHeader } from "../../../../../components/Header/HomeHeader";
import { HomeFooter } from "../../../../../components/Footer/HomeFooter";
import RoomDetailView from "../components/RoomDetailComponent";

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);

  if (!roomId) return <div>Phòng không hợp lệ</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <main className="flex-grow bg-white">
        <RoomDetailView roomId={roomId} />
      </main>
      <HomeFooter />
    </div>
  );
};

export default RoomDetailPage;