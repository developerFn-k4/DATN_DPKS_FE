import React from "react";
import { RoomDetailComponent } from "../components/RoomDetailComponent";
import { useRoomDetail } from "../hooks/RoomHook";

const RoomDetail = () => {

  const { room, isLoading } = useRoomDetail();

  if (isLoading) return <div>Loading...</div>;

  if (!room) return <div>Không tìm thấy phòng</div>;

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <RoomDetailComponent room={room} />
    </div>
  );
};

export default RoomDetail;