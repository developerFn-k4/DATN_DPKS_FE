import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Thêm /auth vào đây nếu API của bạn bắt đầu bằng /api/auth/...
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    // Trả về thẳng dữ liệu bên trong để Hook dễ xử lý
    return response.data?.data || response.data; 
  },
  
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/auth/profile/update', data);
    return response.data;
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData();
    // Đảm bảo tên 'avatar' khớp với tên biến Backend đang đợi ($request->file('avatar'))
    formData.append('avatar', file); 

    const response = await apiClient.post('/auth/profile/avatar', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      },
    });
    return response.data;
  },

  changePassword: async (data: { current_password: string; new_password: string; new_password_confirmation: string }) => {
    const response = await apiClient.put('/auth/change-password', data);
    return response.data;
  },
};

export default apiClient;