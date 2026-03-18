const BASE_URL = "https://vietstay.ngrok.dev/api/admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: boolean;
}

export const getUsers = async (): Promise<User[]> => {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.json();
};

export const getUserById = async (id: number): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.json();
};

export const toggleUserStatus = async (id: number): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/${id}/toggle-status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.json();
};