import { useEffect, useState } from "react";

export const useVNPayReturn = (searchParams: URLSearchParams) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const query: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      query[key] = value;
    });

    // BE của bạn trả về ?success=true (đây là string)
    // Hoặc VNPAY trả về vnp_ResponseCode=00
    const isSuccess = 
      query.success === "true" || 
      query.success === "1" || 
      query.vnp_ResponseCode === "00";

    console.log("Check Success:", isSuccess, "Query data:", query); // Dòng này để bạn F12 kiểm tra

    setSuccess(isSuccess);
    setData(query);
    setLoading(false);
  }, [searchParams]);

  return { loading, success, data };
};