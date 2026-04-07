import { useState, useEffect, useCallback } from "react";
import { authService } from "../../../../products/services/authService";

export const useProfile = () => {
  const [profile, setProfile] = useState<any>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      // Bỏ setLoading(true) ở đây để tránh giao diện bị nháy trắng nếu đã có dữ liệu cũ
      const res = await authService.getProfile();
      const userData = res?.user || res?.data?.user || res?.data || res;

      if (userData && userData.id) {
        setProfile(userData);
        // Lưu đè dữ liệu mới nhất vào LocalStorage
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Lỗi Fetch Profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateAvatar = async (file: File) => {
    try {
      await authService.updateAvatar(file);
      // Đợi 1 chút rồi fetch lại để server kịp xử lý ảnh
      setTimeout(() => fetchProfile(), 500); 
    } catch (error) {
      console.error("Lỗi cập nhật ảnh:", error);
      throw error;
    }
  };
  // HÀM LƯU ẢNH RIÊNG

  const updateProfile = async (data: any) => {
    const res = await authService.updateProfile(data);
    await fetchProfile();
    return res;
  };

  const changePassword = async (data: { current_password: string; new_password: string; new_password_confirmation: string }) => {
    const res = await authService.changePassword(data);
    return res;
  };

  return { 
    profile, 
    loading, 
    updateProfile, 
    updateAvatar, // Trả ra ngoài để dùng
    changePassword,
    refresh: fetchProfile 
  };
};