import React, { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSave: (data: any) => void;
}

const ROOM_STATUSES = [
  "available",
  "occupied",
  "maintenance",
  "unavailable"
];

const RoomModal: React.FC<Props> = ({ isOpen, onClose, initialData, onSave }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [price, setPrice] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [status, setStatus] = useState("available");
  const [note, setNote] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const clearForm = () => {
    setRoomNumber("");
    setFloor("");
    setPrice("");
    setRoomTypeId("");
    setStatus("available");
    setNote("");
    setImages([]); 
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setRoomNumber(initialData.room_number?.toString() || "");
        setFloor(initialData.floor?.toString() || "");
        setPrice(initialData.price?.toString() || "");
        setRoomTypeId(initialData.room_type_id?.toString() || "");
        setStatus(initialData.status || "available");
        setNote(initialData.note || "");
      } else {
        clearForm();
      }
    }
  }, [isOpen, initialData]);

  const handleCancel = () => {
    clearForm(); 
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomNumber.trim() || !floor || !roomTypeId) {
      alert("Bạn chưa nhập Số phòng hoặc thông tin cần thiết!");
      return; 
    }

    const formData = new FormData();
    formData.append("room_number", roomNumber.trim());
    formData.append("room_type_id", roomTypeId);
    formData.append("floor", floor.toString());
    formData.append("price", price.toString());
    formData.append("status", status);
    formData.append("note", note ? note.trim() : "");

    images.forEach((file) => {
      formData.append("images[]", file);
    });

    onSave(formData);

    clearForm(); 
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleCancel} />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-gray-100 max-h-[95vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {initialData ? " Cập nhật phòng" : " Thêm phòng mới"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Số phòng</label>
                <input
                  type="text"
                  placeholder="VD: 101"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full border-2 border-gray-50 p-2 rounded-xl focus:border-green-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tầng</label>
                <input
                  type="number"
                  placeholder="VD: 1"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full border-2 border-gray-50 p-2 rounded-xl focus:border-green-400 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Giá (VND)</label>
                <input
                  type="number"
                  placeholder="VD: 500000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border-2 border-gray-50 p-2 rounded-xl focus:border-green-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Loại phòng (ID)</label>
                <input
                  type="number"
                  placeholder="VD: 1"
                  value={roomTypeId}
                  onChange={(e) => setRoomTypeId(e.target.value)}
                  className="w-full border-2 border-gray-50 p-2 rounded-xl focus:border-green-400 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border-2 border-gray-50 p-2 rounded-xl focus:border-green-400 outline-none bg-white transition-all"
              >
                {ROOM_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === 'available' ? 'Sẵn sàng' :
                      s === 'occupied' ? 'Đang sử dụng' :
                        s === 'maintenance' ? 'Bảo trì' :
                          'Không khả dụng'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Ghi chú</label>
              <textarea
                placeholder="VD: Phòng có view biển..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border-2 border-gray-50 p-2 rounded-xl focus:border-green-400 outline-none transition-all"
                rows={2}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Hình ảnh phòng</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && setImages(Array.from(e.target.files))}
                className="w-full border-2 border-dashed border-gray-100 p-2 rounded-xl text-sm mt-1 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-gray-100 file:font-semibold"
              />
              {images.length > 0 && (
                <p className="text-[10px] text-green-500 mt-1 ml-1 font-medium">
                  Đã chọn {images.length} ảnh
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-semibold transition-all"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!roomNumber.trim()} 
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${!roomNumber.trim()
                    ? "!bg-gray-300 cursor-not-allowed"
                    : "!bg-blue-500 text-white hover:bg-blue-600"
                  }`}
              >
                Lưu thông tin
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RoomModal;