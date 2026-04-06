import React, { useState, useEffect } from 'react';
import { message, Button } from 'antd';
import { SaveOutlined } from "@ant-design/icons";

interface ProfileFormProps {
  initialData: any;
  onSave: (data: any) => Promise<void>;
  onUpdateAvatar: (file: File) => Promise<void>;
}

export const ProfileForm = ({ initialData, onSave, onUpdateAvatar }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Cập nhật dữ liệu từ API vào Form khi load trang
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
      });
    }
  }, [initialData]);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Hàm xử lý khi nhấn nút LƯU THÔNG TIN
  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      await onSave(formData);
      message.success("Cập nhật thông tin thành công!");
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu thông tin!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
        Thông tin cá nhân
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
          <input 
            type="text"
            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            placeholder="Nhập họ tên"
            value={formData.name} 
            onChange={e => handleInputChange('name', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
          <input 
            type="text"
            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            placeholder="Số điện thoại"
            value={formData.phone} 
            onChange={e => handleInputChange('phone', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ</label>
          <input 
            type="text"
            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            placeholder="Địa chỉ cư trú"
            value={formData.address} 
            onChange={e => handleInputChange('address', e.target.value)}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          type="primary" 
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          loading={isSaving}
          className="bg-emerald-600 hover:!bg-emerald-700 h-11 px-8 rounded-xl font-semibold border-none shadow-lg shadow-emerald-200"
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};