import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useRoomDetail = () => {

  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["room-detail", id],
    queryFn: () => getRoomTypeById(id as string),
    enabled: !!id
  });

  return {
    room: data,
    isLoading
  };
};

function getRoomTypeById(arg0: string): any {
  throw new Error("Function not implemented.");
}
