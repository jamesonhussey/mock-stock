// Fetches real-time and historical stock prices from Yahoo Finance public endpoints
// Usage: import { fetchYahooQuote, fetchYahooHistory } from './yahooApi';

export async function fetchYahooQuote(symbol: string) {
  // Yahoo Finance quote endpoint (CORS-friendly for most tickers)
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch quote');
  const data = await res.json();
  return data.quoteResponse.result[0];
}

export async function fetchYahooHistory(symbol: string, range = '1mo', interval = '1d') {
  // Example: range='1mo', interval='1d' for daily prices over 1 month
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch history');
  const data = await res.json();
  return data.chart.result[0];
}
