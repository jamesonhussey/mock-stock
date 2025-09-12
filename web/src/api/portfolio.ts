import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getPortfolio(token: string) {
  const response = await axios.get(`${API_URL}/api/portfolio`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
