

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
export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: trades, isLoading: tradesLoading } = useTrades();
  const token = localStorage.getItem('token') || '';
  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio', token],
    queryFn: () => getPortfolio(token),
    enabled: !!token,
  });

  if (userLoading || tradesLoading || portfolioLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" width="100vw">
        <CircularProgress />
      </Box>
    );
  }

  if (!user || !portfolio) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" width="100vw">
        <Container maxWidth="sm">
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography color="error">Failed to load dashboard data.</Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" width="100vw">
  <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Welcome, {user.name}!
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Cash: ${portfolio.cash.toFixed(2)} | Equity: ${portfolio.equity.toFixed(2)}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" gap={4} flexWrap="wrap">
            {/* Recent Trades Table */}
            <Box flex={1} minWidth={320}>
              <Typography variant="h6" gutterBottom>
                Recent Trades
              </Typography>
              {Array.isArray(trades) && trades.length > 0 ? (
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
                      {trades.map((trade: any) => (
                        <TableRow key={trade.id}>
                          <TableCell>{new Date(trade.created_at).toLocaleString()}</TableCell>
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
                <Typography color="text.secondary">No recent trades found.</Typography>
              )}
            </Box>
            {/* Portfolio Positions Table */}
            <Box flex={1} minWidth={320}>
              <Typography variant="h6" gutterBottom>
                Portfolio Positions
              </Typography>
              {Array.isArray(portfolio.positions) && portfolio.positions.length > 0 ? (
                <TableContainer component={Paper}>
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
                      {portfolio.positions.map((pos: any) => (
                        <TableRow key={pos.ticker}>
                          <TableCell>{pos.ticker}</TableCell>
                          <TableCell align="right">{pos.qty}</TableCell>
                          <TableCell align="right">${pos.avg_cost.toFixed(2)}</TableCell>
                          <TableCell align="right">${pos.mkt_price.toFixed(2)}</TableCell>
                          <TableCell align="right" sx={{ color: pos.unrealized_pl >= 0 ? 'success.main' : 'error.main' }}>
                            {pos.unrealized_pl >= 0 ? '+' : ''}${pos.unrealized_pl.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary">No positions in portfolio.</Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
