const BASE_URL = "https://vietstay.ngrok.dev/api/admin";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`,
  "ngrok-skip-browser-warning": "69420", 
});

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, { headers: getAuthHeaders() });
  return res.json();
};

export const toggleUserStatus = async (id: number) => {
  const res = await fetch(`${BASE_URL}/users/${id}/toggle-status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  return res.json();
};