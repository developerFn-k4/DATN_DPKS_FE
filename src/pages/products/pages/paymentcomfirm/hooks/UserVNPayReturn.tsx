import { useEffect, useState } from "react";
import { paymentService, type PaymentStatusResponse } from "../../../../../services/payment/paymentService";

export interface PaymentReturnState {
  loading: boolean;
  success: boolean;
  data: PaymentStatusResponse | null;
  error: string | null;
}

export const usePaymentReturn = (searchParams: URLSearchParams): PaymentReturnState => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<PaymentStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      const orderId = searchParams.get("order_id") || searchParams.get("vnp_TxnRef");
      const method = searchParams.get("method");
      const queryStatus = searchParams.get("status");
      const bookingId = searchParams.get("booking_id");

      // Cash payments don't have an orderId from gateway — trust the query status
      if (method === "cash" && queryStatus === "success") {
        setSuccess(true);
        setData({
          success: true,
          status: "paid",
          method: "cash",
          booking_id: bookingId ? parseInt(bookingId, 10) : undefined,
        });
        setLoading(false);
        return;
      }

      if (!orderId) {
        // Fallback: read vnp_ResponseCode directly (legacy VNPAY redirect)
        const responseCode = searchParams.get("vnp_ResponseCode");
        const isOk = responseCode === "00";
        setSuccess(isOk);
        setData(null);
        setLoading(false);
        return;
      }

      try {
        const result = await paymentService.getPaymentStatus(orderId);
        setSuccess(result.status === "paid" || result.success === true);
        setData(result);
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || "Không thể xác nhận trạng thái thanh toán.");
        setSuccess(false);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, success, data, error };
};

// Keep old export name so any other import doesn't break
export const useVNPayReturn = usePaymentReturn;
