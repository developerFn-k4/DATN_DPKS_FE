import React, { useState, useEffect } from "react";

const RoomTypeModal = ({ isOpen, onClose, initialData, onSave }: any) => {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [bedType, setBedType] = useState("");
  const [area, setArea] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [status, setStatus] = useState("active");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name || "");
      setCapacity(initialData.capacity || 2);
      setBedType(initialData.bed_type || "");
      setArea(initialData.area || "");
      setBasePrice(initialData.base_price || "");
      setStatus(initialData.status || "active");
      setAmenities(initialData.amenities || []);
    } else if (isOpen) {
      setName(""); setCapacity(2); setBedType(""); setArea(""); setBasePrice(""); setAmenities([]); setImages([]);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("hotel_id", "1"); // Mặc định theo dữ liệu bạn gửi
    formData.append("name", name);
    formData.append("capacity", capacity.toString());
    formData.append("bed_type", bedType);
    formData.append("area", area);
    formData.append("base_price", basePrice);
    formData.append("currency", "VND");
    formData.append("status", status);
    
    amenities.forEach(a => formData.append("amenities[]", a));
    images.forEach(img => formData.append("images[]", img));

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Sửa loại phòng" : "Thêm loại phòng"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Tên loại phòng" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded-xl" required />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Sức chứa" value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="border p-2 rounded-xl" />
            <input placeholder="Loại giường" value={bedType} onChange={e => setBedType(e.target.value)} className="border p-2 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Diện tích (m2)" value={area} onChange={e => setArea(e.target.value)} className="border p-2 rounded-xl" />
            <input type="number" placeholder="Giá cơ bản" value={basePrice} onChange={e => setBasePrice(e.target.value)} className="border p-2 rounded-xl" />
          </div>
          <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border p-2 rounded-xl">
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng kinh doanh</option>
          </select>
          <div>
            <label className="text-xs font-bold text-gray-400">TIỆN NGHI (Cách nhau bằng dấu phẩy)</label>
            <input 
              placeholder="wifi, tv, air conditioner" 
              value={amenities.join(", ")} 
              onChange={e => setAmenities(e.target.value.split(",").map(s => s.trim()))}
              className="w-full border p-2 rounded-xl mt-1"
            />
          </div>
          <input type="file" multiple onChange={e => e.target.files && setImages(Array.from(e.target.files))} className="w-full" />
          
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-xl">Hủy</button>
            <button type="submit" className="px-4 py-2 !bg-blue-500 text-white rounded-xl">Lưu lại</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RoomTypeModal;