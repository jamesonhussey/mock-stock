import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function register(email: string, password: string, name: string) {
  const res = await axios.post(`${API_URL}/api/register`, { name, email, password });
  return res.data;
}