export const verifyVNPayReturn = async (query: Record<string, string>) => {
  const url = new URL(`${import.meta.env.VITE_API_URL}/payment/vnpay-return`);

  Object.keys(query).forEach((key) => {
    url.searchParams.append(key, query[key]);
  });

  const res = await fetch(url.toString(), {
    method: "GET",
  });

  if (!res.ok) throw new Error("Verify failed");

  return res.json();
};