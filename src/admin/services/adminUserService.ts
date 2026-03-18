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

export const createUser = async (data: any) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateUser = async (id: number, data: any) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteUser = async (id: number) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const toggleUserStatus = async (id: number) => {
  const res = await fetch(`${BASE_URL}/users/${id}/toggle-status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  return res.json();
};