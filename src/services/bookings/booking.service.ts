import { API_BASE_URL_NEW, ENDPOINTS } from "../endpoints/common";

export interface BookingParams {
  room_id: number;
  name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking?: {
    id: number;
    room_id: number;
    name: string;
    email: string;
    phone: string;
    check_in: string;
    check_out: string;
    guests: number;
    total_price: string;
    status: string;
    created_at: string;
  };
}

export const createBooking = async (params: BookingParams): Promise<BookingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL_NEW}${ENDPOINTS.BOOKINGS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create booking');
    }

    const data: BookingResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};
