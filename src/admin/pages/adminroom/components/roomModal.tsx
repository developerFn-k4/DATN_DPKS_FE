import React, { useState, useEffect } from "react";

interface RoomType {
  id: number;
  name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSave: (data: any) => void;
  roomTypes: RoomType[]; // Thêm prop này để lấy danh sách tên
}

const RoomModal: React.FC<Props> = ({ isOpen, onClose, initialData, onSave, roomTypes }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [status, setStatus] = useState("available");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setRoomNumber(initialData.room_number?.toString() || "");
        setFloor(initialData.floor?.toString() || "");
        setRoomTypeId(initialData.room_type_id?.toString() || "");
        setStatus(initialData.status || "available");
      } else {
        setRoomNumber("");
        setFloor("");
        // Mặc định chọn loại phòng đầu tiên nếu thêm mới
        setRoomTypeId(roomTypes.length > 0 ? roomTypes[0].id.toString() : "");
        setStatus("available");
      }
    }
  }, [isOpen, initialData, roomTypes]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("room_number", roomNumber.trim());
    formData.append("room_type_id", roomTypeId);
    formData.append("floor", floor.toString());
    formData.append("status", status);

    onSave(formData);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {initialData ? "Cập nhật phòng" : "Thêm phòng mới"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Số phòng</label>
                <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className="w-full border-2 border-gray-50 p-3 rounded-2xl focus:border-green-400 outline-none transition-all" required />
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Tầng</label>
                <input type="number" value={floor} onChange={(e) => setFloor(e.target.value)} className="w-full border-2 border-gray-50 p-3 rounded-2xl focus:border-green-400 outline-none transition-all" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase ml-1">
                Loại phòng
              </label>
              <select
                value={roomTypeId}
                onChange={(e) => setRoomTypeId(e.target.value)}
                className="w-full border-2 border-gray-50 p-3 rounded-2xl focus:border-green-400 outline-none bg-white transition-all font-medium"
                required
              >
                <option value="" disabled>Chọn loại phòng</option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Trạng thái</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border-2 border-gray-50 p-3 rounded-2xl focus:border-green-400 outline-none bg-white transition-all font-medium">
                <option value="available">Sẵn sàng</option>
                <option value="occupied">Đang sử dụng</option>
                <option value="maintenance">Bảo trì</option>
                <option value="booked">Đã đặt</option>
                <option value="reserved">Giữ chỗ</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">Hủy</button>
              <button type="submit" disabled={!roomNumber.trim()} className="px-6 py-3 !bg-blue-500 text-white rounded-2xl font-bold hover:bg-green-600 disabled:bg-gray-300 shadow-lg shadow-green-100 transition-all">Lưu thông tin</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RoomModal;