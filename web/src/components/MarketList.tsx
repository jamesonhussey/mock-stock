import React, { useState, useEffect } from 'react';
import StockPriceChart from './StockPriceChart';
import type { PricePoint } from './StockPriceChart';
import TextField from '@mui/material/TextField';
import { placeOrder } from '../api/orders';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Collapse, Box, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// List of 10 stocks (no price, will fetch from backend)
const stockList = [
  { name: 'Apple Inc.', symbol: 'AAPL', marketCap: 2950000000000 },
  { name: 'Microsoft Corp.', symbol: 'MSFT', marketCap: 2450000000000 },
  { name: 'Amazon.com Inc.', symbol: 'AMZN', marketCap: 1380000000000 },
  { name: 'Alphabet Inc.', symbol: 'GOOGL', marketCap: 1820000000000 },
  { name: 'Meta Platforms', symbol: 'META', marketCap: 900000000000 },
  { name: 'Tesla Inc.', symbol: 'TSLA', marketCap: 800000000000 },
  { name: 'NVIDIA Corp.', symbol: 'NVDA', marketCap: 1100000000000 },
  { name: 'Berkshire Hathaway', symbol: 'BRK-A', marketCap: 780000000000 },
  { name: 'Visa Inc.', symbol: 'V', marketCap: 520000000000 },
  { name: 'JPMorgan Chase', symbol: 'JPM', marketCap: 430000000000 },
];

function abbreviateNumber(value: number) {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value}`;
}



function MarketList() {
  const [openRows, setOpenRows] = useState<{ [symbol: string]: boolean }>({});
  const [loading, setLoading] = useState<{ [symbol: string]: boolean }>({});
  const [quantities, setQuantities] = useState<{ [symbol: string]: number }>({});
  const [prices, setPrices] = useState<{ [symbol: string]: number | null }>({});
  const [priceLoading, setPriceLoading] = useState(false);
  const [history, setHistory] = useState<{ [symbol: string]: PricePoint[] | null }>({});
  const [historyLoading, setHistoryLoading] = useState<{ [symbol: string]: boolean }>({});

  // Fetch prices for all stocks from backend
  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setPriceLoading(true);
      try {
        const tickers = stockList.map(s => s.symbol).join(',');
  const res = await axios.get(`/api/quotes?tickers=${encodeURIComponent(tickers)}&t=${Date.now()}`);
        const data = res.data;
        // data is array of { ticker, price, ts }
        if (!cancelled) {
          const priceMap = Object.fromEntries(data.map((q: any) => [q.ticker, q.price]));
          console.log('Fetched prices:', priceMap);
          setPrices(priceMap);
        }
      } catch {
        if (!cancelled) setPrices({});
      } finally {
        if (!cancelled) setPriceLoading(false);
      }
    }
    fetchAll();
    const interval = setInterval(fetchAll, 10000); // update every 10s
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const handleToggle = async (symbol: string) => {
    setOpenRows((prev) => ({ ...prev, [symbol]: !prev[symbol] }));
    // If opening and not already loaded, fetch history from backend
    if (!openRows[symbol] && !history[symbol]) {
      setHistoryLoading(h => ({ ...h, [symbol]: true }));
      try {
        // Fetch from backend: /api/historical/{ticker}
        const res = await axios.get(`/api/historical/${encodeURIComponent(symbol)}`);
        // Response: array of { recorded_at, price }
        const data: PricePoint[] = res.data.map((row: any) => ({
          time: new Date(row.recorded_at).toLocaleDateString(),
          price: row.price,
        })).filter((p: PricePoint) => typeof p.price === 'number' && !isNaN(p.price));
        setHistory(h => ({ ...h, [symbol]: data }));
      } catch (err) {
        setHistory(h => ({ ...h, [symbol]: null }));
      } finally {
        setHistoryLoading(h => ({ ...h, [symbol]: false }));
      }
    }
  };

  const handleOrder = async (symbol: string, side: 'buy' | 'sell') => {
    const qty = Math.max(1, Number(quantities[symbol]) || 1);
    setLoading((prev) => ({ ...prev, [symbol]: true }));
    try {
      await placeOrder(symbol, side, qty);
      alert(`${side === 'buy' ? 'Bought' : 'Sold'} ${qty} share${qty > 1 ? 's' : ''} of ${symbol}`);
    } catch (err: any) {
      alert(`Order failed: ${err?.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setLoading((prev) => ({ ...prev, [symbol]: false }));
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Market Cap</TableCell>
            <TableCell align="center">Actions</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {stockList.map((stock) => (
            <React.Fragment key={stock.symbol}>
              <TableRow>
                <TableCell>{stock.name}</TableCell>
                <TableCell>{stock.symbol}</TableCell>
                <TableCell align="right">
                  {(() => {
                    const price = prices[stock.symbol];
                    if (priceLoading && price === undefined) {
                      return <span>Loading...</span>;
                    } else if (typeof price === 'number' && !isNaN(price)) {
                      return `$${price.toFixed(2)}`;
                    } else {
                      return <span style={{ color: '#aaa' }}>N/A</span>;
                    }
                  })()}
                </TableCell>
                <TableCell align="right">{abbreviateNumber(stock.marketCap)}</TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      type="number"
                      size="small"
                      inputProps={{ min: 1, style: { width: 60, padding: 4 } }}
                      value={quantities[stock.symbol] ?? 1}
                      onChange={e => {
                        const val = Math.max(1, Number(e.target.value) || 1);
                        setQuantities(q => ({ ...q, [stock.symbol]: val }));
                      }}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOrder(stock.symbol, 'buy')}
                      disabled={loading[stock.symbol]}
                    >
                      Buy
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1 }}
                      onClick={() => handleOrder(stock.symbol, 'sell')}
                      disabled={loading[stock.symbol]}
                    >
                      Sell
                    </Button>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleToggle(stock.symbol)}>
                    {openRows[stock.symbol] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={openRows[stock.symbol]} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      {historyLoading[stock.symbol] ? (
                        <Typography variant="body2" color="text.secondary">Loading chart...</Typography>
                      ) : history[stock.symbol] && history[stock.symbol]!.length > 0 ? (
                        <StockPriceChart data={history[stock.symbol]!} />
                      ) : (
                        <Typography variant="body2" color="text.secondary">No chart data available.</Typography>
                      )}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MarketList;
