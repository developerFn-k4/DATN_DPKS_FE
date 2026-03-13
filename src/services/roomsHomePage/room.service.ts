import instance from "../../core/api";
import type { Room, RoomDetailResponse, RoomResponse } from "../../types/roomsHomePage/room";

export async function getRooms(): Promise<Room[]> {
  const res = await instance.get<RoomResponse>("/rooms");
  return res.data.data;
}

export async function getRoomDetail(id: number): Promise<Room> {
  const res = await instance.get<RoomDetailResponse>(`/rooms/${id}`);
  return res.data.data;
}