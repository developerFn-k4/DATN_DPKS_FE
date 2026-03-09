import { useQuery } from "@tanstack/react-query"; 
import { getRoomDetail, getRooms } from "../../services/roomsHomePage/room.service";

export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });
}

export function useRoomDetail(roomId?: number) {
  return useQuery({
    queryKey: ["room-detail", roomId],
    queryFn: () => getRoomDetail(roomId!),
    enabled: !!roomId,
  });
}