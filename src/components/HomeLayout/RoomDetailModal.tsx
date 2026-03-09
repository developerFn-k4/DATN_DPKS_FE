import { Modal, Tag, Button } from "antd";
import { useRoomDetail } from "../../hooks/roomsHomePage/useRooms";

type Props = {
    roomId?: number;
    open: boolean;
    onClose: () => void;
};

export function RoomDetailModal({ roomId, open, onClose }: Props) {
    const { data: room, isLoading } = useRoomDetail(roomId);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {isLoading || !room ? (
                <div>Loading...</div>
            ) : (
                <div className="space-y-5">

                    {/* ảnh demo vì chưa có ảnh trong api*/}
                    <img
                        src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
                        className="w-full h-60 object-cover rounded-xl"
                    />

                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            {room.room_type.name}
                        </h2>

                        <Tag color="green">
                            {room.room_type.bed_type}
                        </Tag>
                    </div>

                    <p className="text-slate-600">
                        {room.room_type.description}
                    </p>

                    {/* thông tin */}
                    <div className="grid grid-cols-2 gap-4 text-sm">

                        <div>
                            <span className="text-slate-500">Mã phòng</span>
                            <p className="font-medium">{room.room_number}</p>
                        </div>

                        <div>
                            <span className="text-slate-500">Số lượng</span>
                            <p className="font-medium">
                                {room.room_type.capacity} người
                            </p>
                        </div>

                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">

                        <div className="text-xl font-semibold text-emerald-600">
                            {Number(room.room_type.base_price).toLocaleString("vi-VN")}đ
                            <span className="text-sm text-slate-500"> / đêm</span>
                        </div>

                        <Button type="primary">
                            Đặt phòng
                        </Button>

                    </div>

                </div>
            )}
        </Modal>
    );
}