import { useEffect, useState } from "react";
import { verifyVNPayReturn } from "../../../services/paymentService";

export const useVNPayReturn = (searchParams: URLSearchParams) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const query: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          query[key] = value;
        });

        const res = await verifyVNPayReturn(query);
        setData(res);

        if (query.vnp_ResponseCode === "00") {
          setSuccess(true);
        } else {
          setSuccess(false);
        }
      } catch (e) {
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [searchParams]);

  return { loading, success, data };
};