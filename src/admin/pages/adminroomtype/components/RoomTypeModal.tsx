import React, { useState, useEffect } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const RoomTypeModal = ({ isOpen, onClose, initialData, onSave }: any) => {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [bedType, setBedType] = useState("");
  const [area, setArea] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [status, setStatus] = useState("active");
  const [amenities, setAmenities] = useState<string[]>([]);
  
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name || "");
      setCapacity(initialData.capacity || 2);
      setBedType(initialData.bed_type || "");
      setArea(initialData.area || "");
      setBasePrice(initialData.base_price || "");
      setStatus(initialData.status || "active");
      setAmenities(initialData.amenities || []);
      setExistingImages(initialData.images || []);
      setDeleteImageIds([]);
      setNewImages([]);
    } else if (isOpen) {
      setName(""); setCapacity(2); setBedType(""); setArea(""); setBasePrice(""); 
      setAmenities([]); setExistingImages([]); setNewImages([]); setDeleteImageIds([]);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleRemoveExisting = (id: number) => {
    setDeleteImageIds(prev => [...prev, id]);
    setExistingImages(prev => prev.filter(img => img.id !== id));
  };

  const handleRemoveNew = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData();
  
  // Đảm bảo các giá trị không bị undefined/null
  formData.append("hotel_id", "1");
  formData.append("name", name || "");
  formData.append("capacity", (capacity || 0).toString());
  formData.append("bed_type", bedType || "");
  formData.append("area", (area || 0).toString());
  formData.append("base_price", (basePrice || 0).toString());
  formData.append("currency", "VND");
  formData.append("status", status);

  // Xử lý tiện nghi: Chỉ gửi nếu có dữ liệu thực
  const cleanAmenities = amenities.filter(a => a && a.trim() !== "");
cleanAmenities.forEach(a => formData.append("amenities[]", a));

// Đảm bảo keep_images là mảng số (string)
existingImages.forEach(img => formData.append("keep_images[]", img.id.toString()));

  // LOGIC KEEP IMAGES: Gửi ID của những ảnh cũ còn giữ lại
  if (existingImages.length > 0) {
    existingImages.forEach((img) => {
      formData.append("keep_images[]", img.id.toString());
    });
  } else {
    // Nếu xóa sạch ảnh cũ, gửi field rỗng để backend biết
    formData.append("keep_images", "");
  }

  // Gửi ảnh mới
  newImages.forEach((file) => {
    formData.append("images[]", file);
  });

  onSave(formData);
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">
            {initialData ? "Sửa loại phòng" : "Thêm loại phòng"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên loại phòng */}
          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1 block">Tên loại phòng</label>
            <input placeholder="VD: Deluxe Double Ocean View" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1 block">Sức chứa (người)</label>
              <input type="number" placeholder="2" value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1 block">Loại giường</label>
              <input placeholder="King Size" value={bedType} onChange={e => setBedType(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
            </div>
          </div>

          {/* QUẢN LÝ ẢNH */}
          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1 block">Thư viện ảnh</label>
            <div className="flex flex-wrap gap-2 mt-2 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
              {/* Ảnh cũ */}
              {existingImages.map((img) => (
                <div key={img.id} className="relative w-20 h-20 group">
                  <img 
                    src={img.image_url.startsWith('http') ? img.image_url : `${(import.meta.env.VITE_API_URL as string).replace('/api', '/storage')}/${img.image_url}`} 
                    className="w-full h-full object-cover rounded-lg border border-gray-200" 
                    alt="old" 
                  />
                  <button type="button" onClick={() => handleRemoveExisting(img.id)} className="absolute -top-2 -right-2 !bg-red-500 text-white rounded-full p-1 text-[10px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><DeleteOutlined /></button>
                </div>
              ))}

              {/* Preview ảnh mới */}
              {newImages.map((file, idx) => (
                <div key={idx} className="relative w-20 h-20 group">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-lg border border-blue-400 shadow-md" alt="new" />
                  <button type="button" onClick={() => handleRemoveNew(idx)} className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">✕</button>
                </div>
              ))}

              <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-400 transition-all text-gray-400 hover:text-blue-500">
                <PlusOutlined style={{ fontSize: '18px' }} />
                <span className="text-[9px] font-bold mt-1 uppercase">Thêm</span>
                <input type="file" multiple className="hidden" onChange={e => e.target.files && setNewImages([...newImages, ...Array.from(e.target.files)])} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1 block">Diện tích (m²)</label>
              <input type="number" placeholder="30" value={area} onChange={e => setArea(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1 block">Giá cơ bản (VND)</label>
              <input type="number" placeholder="1.000.000" value={basePrice} onChange={e => setBasePrice(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1 block">Trạng thái kinh doanh</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white">
              <option value="active">● Đang hoạt động</option>
              <option value="inactive">○ Ngừng kinh doanh</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1 block">Tiện nghi (cách nhau bởi dấu phẩy)</label>
            <input 
              placeholder="Wifi, Điều hòa, Tivi, Bồn tắm..." 
              value={amenities.join(", ")} 
              onChange={e => setAmenities(e.target.value.split(",").map(s => s.trim()))}
              className="w-full border border-gray-200 p-2.5 rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-100"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t mt-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm">Hủy</button>
            <button type="submit" className="px-5 py-2.5 !bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all text-sm">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomTypeModal;