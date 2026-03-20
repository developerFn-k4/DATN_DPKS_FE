export const verifyVNPayReturn = async (query: Record<string, string>) => {
  const url = new URL("https://vietstay.ngrok.dev/api/payment/vnpay-return");

  Object.keys(query).forEach((key) => {
    url.searchParams.append(key, query[key]);
  });

  const res = await fetch(url.toString(), {
    method: "GET",
  });

  if (!res.ok) throw new Error("Verify failed");

  return res.json();
};