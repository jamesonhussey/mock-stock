import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getUser(token: string) {
  const res = await axios.get(`${API_URL}/api/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
