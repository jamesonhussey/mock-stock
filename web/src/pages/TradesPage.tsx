import { useQuery } from '@tanstack/react-query';
import { getTrades } from '../api/trades';
import {
  Container, Typography, Paper, Divider, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box
} from '@mui/material';

export default function TradesPage() {
  const token = localStorage.getItem('token') || '';
  const { data: trades, isLoading, error } = useQuery({
    queryKey: ['trades', token],
    queryFn: () => getTrades(token),
    enabled: !!token,
  });

  return (
    <Container maxWidth="md">
      <Box mt={6}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Trade History
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
              <CircularProgress />
            </Box>
          ) : error ? (
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
            <Typography color="text.secondary">No trades found.</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
