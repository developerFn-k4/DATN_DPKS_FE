import { API_BASE_URL } from "../endpoints/common";

export interface VNPayPaymentResponse {
  success: boolean;
  payment_url?: string;
  message?: string;
}

export const createVNPayPayment = async (bookingId: number): Promise<VNPayPaymentResponse> => {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_BASE_URL}/payment/vnpay/${bookingId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    throw new Error("Failed to create VNPay payment");
  }

  return response.json();
};
