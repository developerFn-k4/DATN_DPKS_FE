import axios from 'axios';

const BASE_URL = 'https://vietstay.ngrok.dev/api/admin/rooms';

export const roomService = {
  getRooms: () => axios.get(BASE_URL),
  
  getRoomDetail: (id: number) => axios.get(`${BASE_URL}/${id}`),
  
  deleteRoom: (id: number) => axios.delete(`${BASE_URL}/${id}`),
  
  saveRoom: (id: number | null, data: any) => {
    return id ? axios.put(`${BASE_URL}/${id}`, data) : axios.post(BASE_URL, data);
  }
};