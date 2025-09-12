import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function placeOrder(symbol: string, side: 'buy' | 'sell', quantity: number = 1) {
  const token = localStorage.getItem('token');
  const payload = {
    ticker: symbol,
    side: side.toUpperCase(), // 'BUY' or 'SELL'
    type: 'MARKET',
    qty: quantity,
  };
  const res = await axios.post(
    `${API_URL}/api/orders`,
    payload,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return res.data;
}
