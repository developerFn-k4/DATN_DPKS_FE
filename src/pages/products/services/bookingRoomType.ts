import axios from 'axios';

const API_URL = 'https://vietstay.ngrok.dev/api';

export const bookingService = {
  getMyBookings: async () => {
    try {
      const response = await axios.get(`${API_URL}/my-bookings`);
      // API của bạn trả về object có thuộc tính 'data' là một mảng
      return response.data?.data || []; 
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  }
};