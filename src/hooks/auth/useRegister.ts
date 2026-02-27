import { useCallback, useState } from "react";
import axios from "axios";
import { registerApi } from "../../services/auth/auth";
import type { RegisterRequest } from "../../types/auth/auth";
export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (payload: RegisterRequest) => {
    setLoading(true);
    setError(null);

    try {
      const res = await registerApi(payload);
      const token =
        res.accessToken ??
        res.token ??
        (res as any)?.payload?.accessToken ??
        (res as any)?.payload?.token;

      const user =
        res.user ??
        (res as any)?.payload?.user;
 
      if (token) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...(user ? { user } : {}),
            accessToken: token,
          })
        );
      }

      return res;
    } catch (e: unknown) {
      let msg = "Đăng ký thất bại";

      if (axios.isAxiosError(e)) {
        const data: any = e.response?.data;
        msg = data?.message || data?.error || e.message || msg;
      }

      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, loading, error };
}