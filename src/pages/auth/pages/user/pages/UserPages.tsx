import React, { useState } from 'react';
import { message, Spin, Button } from 'antd';
import { CameraOutlined, CheckCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useProfile } from '../hooks/UserHook';
import { ProfileForm } from '../components/UserComponnet';

const ProfilePage = () => {
  const { profile, loading, updateProfile, updateAvatar } = useProfile();
  
  // State quản lý chọn ảnh
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveAvatar = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      await updateAvatar(selectedFile);
      message.success("Cập nhật ảnh đại diện thành công!");
      setSelectedFile(null);
    } catch (error) {
      message.error("Lỗi khi tải ảnh lên!");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[500px] gap-4">
      <Spin size="large" />
      <span className="text-emerald-600 font-medium animate-pulse">Đang tải hồ sơ của bạn...</span>
    </div>
  );

  const displayAvatar = previewUrl || (profile?.avatar ? `https://vietstay.ngrok.dev/storage/${profile.avatar}` : null);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      {/* HEADER: PHẦN AVATAR VÀ NÚT LƯU ẢNH */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 mb-8 relative overflow-hidden">
        <div className="relative group z-10">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-emerald-50 shadow-xl bg-gray-50">
            <img 
              src={displayAvatar || `https://ui-avatars.com/api/?name=${profile?.name}&background=random`} 
              className={`w-full h-full object-cover ${isUploading ? 'opacity-40' : ''}`}
              alt="Profile"
            />
          </div>
          <label className="absolute bottom-2 right-2 bg-emerald-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-emerald-700 shadow-lg border-2 border-white transition-transform hover:scale-110">
            <CameraOutlined className="text-lg" />
            <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
          </label>
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile?.name || 'Thành viên mới'}</h1>
          <p className="text-gray-500 font-medium mb-4">{profile?.email}</p>
          
          {selectedFile && (
            <div className="flex items-center justify-center md:justify-start gap-3 animate-fadeIn">
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />} 
                className="bg-emerald-600 h-10 px-6 rounded-xl border-none shadow-lg shadow-emerald-100"
                onClick={handleSaveAvatar}
                loading={isUploading}
              >
                Lưu ảnh này
              </Button>
              <Button 
                type="text" 
                danger 
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
              >
                Hủy
              </Button>
            </div>
          )}
        </div>

        {/* Decor mờ phía sau */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-0 opacity-50"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI: FORM CẬP NHẬT THÔNG TIN (CÓ NÚT LƯU) */}
        <div className="lg:col-span-2 space-y-8">
          <ProfileForm initialData={profile} onSave={updateProfile} onUpdateAvatar={updateAvatar} />
        </div>

        {/* CỘT PHẢI: THẺ THÀNH VIÊN VÀ CHI TIẾT */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-7 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-10">
              <div className="flex justify-between items-start">
                <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase">VietStay Member</span>
                <UserOutlined className="text-2xl opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="text-[10px] opacity-40 uppercase tracking-widest block mb-1">Tên khách hàng</span>
                <p className="text-xl font-semibold tracking-wide uppercase">{profile?.name}</p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] opacity-40 uppercase tracking-widest block mb-1">Số điện thoại</span>
                  <p className="font-mono text-emerald-400">{profile?.phone || '---- --- ---'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] opacity-40 uppercase tracking-widest block mb-1">Hạng</span>
                  <p className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">CLASSIC</p>
                </div>
              </div>
            </div>
            {/* Ảnh mờ trang trí */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[32px]">
            <h4 className="font-bold text-emerald-800 mb-2">Mẹo nhỏ</h4>
            <p className="text-sm text-emerald-700 leading-relaxed">
              Bạn hãy điền đầy đủ số điện thoại và địa chỉ để VietStay có thể hỗ trợ đặt phòng nhanh nhất nhé!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;