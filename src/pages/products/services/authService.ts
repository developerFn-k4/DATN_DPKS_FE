import axios from 'axios';

// Đưa baseURL về gốc /api để các service khác dùng chung được
const API_URL = 'https://vietstay.ngrok.dev/api'; 

const apiClient = axios.create({
  baseURL: 'https://vietstay.ngrok.dev/api', // Bỏ chữ /auth ở đây
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
};

export default apiClient;