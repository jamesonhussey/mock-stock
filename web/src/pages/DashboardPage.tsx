

import { useQuery } from '@tanstack/react-query';
import { getPortfolio } from '../api/portfolio';
import { getTrades } from '../api/trades';
import { getUser } from '../api/user';
function useUser() {
  const token = localStorage.getItem('token') || '';
  return useQuery({
    queryKey: ['user', token],
    queryFn: () => getUser(token),
    enabled: !!token,
  });
}
type Trade = {
  id: number;
  ticker: string;
  qty: number;
  side: string;
  price: number;
  created_at: string;
};
function useTrades() {
  const token = localStorage.getItem('token') || '';
  return useQuery({
    queryKey: ['trades', token],
    queryFn: () => getTrades(token),
    enabled: !!token,
  });
}

type Position = {
  ticker: string;
  qty: number;
  avg_cost: number;
  mkt_price: number;
  unrealized_pl: number;
};

type Portfolio = {
  cash: number;
  equity: number;
  positions: Position[];
};

import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

function usePortfolio() {
  const token = localStorage.getItem('token') || '';
  return useQuery({
    queryKey: ['portfolio', token],
    queryFn: () => getPortfolio(token),
    enabled: !!token,
  });
}

export default function DashboardPage() {
  const { data, isLoading, error } = usePortfolio();
  const { data: trades, isLoading: tradesLoading, error: tradesError } = useTrades();
  const { data: user } = useUser();

  return (
    <Container maxWidth="md">
      <Box mt={6}>
        <Typography variant="h4" gutterBottom>
          {`Welcome to Your Dashboard${user && user.name ? `, ${user.name}` : ''}!`}
        </Typography>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          <Paper elevation={2} sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <>
                <Typography color="error">Failed to load portfolio.</Typography>
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error instanceof Error ? error.message : JSON.stringify(error)}
                </Typography>
              </>
            ) : data && typeof data === 'object' && 'cash' in data && 'equity' in data && Array.isArray(data.positions) ? (
              <>
                <Typography>Cash: ${data.cash.toFixed(2)}</Typography>
                <Typography>Equity: ${data.equity.toFixed(2)}</Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Ticker</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="right">Avg Cost</TableCell>
                        <TableCell align="right">Mkt Price</TableCell>
                        <TableCell align="right">Unrealized P/L</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(data.positions as Position[])
                        .filter((pos) => pos.qty !== 0)
                        .map((pos) => (
                          <TableRow key={pos.ticker}>
                            <TableCell>{pos.ticker}</TableCell>
                            <TableCell align="right">{pos.qty}</TableCell>
                            <TableCell align="right">${pos.avg_cost.toFixed(2)}</TableCell>
                            <TableCell align="right">${pos.mkt_price.toFixed(2)}</TableCell>
                            <TableCell align="right">${pos.unrealized_pl.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Typography color="text.secondary">No portfolio data.</Typography>
            )}
          </Paper>
          <Paper elevation={2} sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Recent Trades
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {tradesLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
                <CircularProgress />
              </Box>
            ) : tradesError ? (
              <Typography color="error">Failed to load trades.</Typography>
            ) : Array.isArray(trades) && trades.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Ticker</TableCell>
                      <TableCell>Side</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(trades as Trade[]).slice(0, 10).map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{new Date(trade.created_at).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\//g, '-')}</TableCell>
                        <TableCell>{trade.ticker}</TableCell>
                        <TableCell>{trade.side}</TableCell>
                        <TableCell align="right">{trade.qty}</TableCell>
                        <TableCell align="right">${trade.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">No trades found.</Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
