import { useState, useEffect } from 'react';
import { message, Button } from 'antd';
import { SaveOutlined, LockOutlined } from "@ant-design/icons";

interface ProfileFormProps {
  initialData: any;
  onSave: (data: any) => Promise<void>;
  onUpdateAvatar: (file: File) => Promise<void>;
  onChangePassword: (data: { current_password: string; new_password: string; new_password_confirmation: string }) => Promise<void>;
}

export const ProfileForm = ({ initialData, onSave, onUpdateAvatar, onChangePassword }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  const handlePasswordChange = (key: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [key]: value }));
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

  // Hàm xử lý khi nhấn nút ĐỔI MẬT KHẨU
  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setIsChangingPassword(true);
      await onChangePassword(passwordData);
      message.success("Đổi mật khẩu thành công!");
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu!");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Information Section */}
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

    {/* Change Password Section */}
    <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <LockOutlined className="text-emerald-500" />
        Đổi mật khẩu
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu hiện tại</label>
          <input 
            type="password"
            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            placeholder="Nhập mật khẩu hiện tại"
            value={passwordData.current_password} 
            onChange={e => handlePasswordChange('current_password', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu mới</label>
          <input 
            type="password"
            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            placeholder="Nhập mật khẩu mới"
            value={passwordData.new_password} 
            onChange={e => handlePasswordChange('new_password', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu mới</label>
          <input 
            type="password"
            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            placeholder="Nhập lại mật khẩu mới"
            value={passwordData.new_password_confirmation} 
            onChange={e => handlePasswordChange('new_password_confirmation', e.target.value)}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          type="primary" 
          icon={<LockOutlined />}
          onClick={handleChangePassword}
          loading={isChangingPassword}
          className="bg-emerald-600 hover:!bg-emerald-700 h-11 px-8 rounded-xl font-semibold border-none shadow-lg shadow-emerald-200"
        >
          Đổi mật khẩu
        </Button>
      </div>
    </div>
    </div>
  );
};