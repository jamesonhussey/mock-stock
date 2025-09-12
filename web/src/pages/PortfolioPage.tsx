import { useQuery } from '@tanstack/react-query';
import { getPortfolio } from '../api/portfolio';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6699', '#33CC99', '#FF6666', '#66CCFF', '#FFCC00', '#999999'
];

export default function PortfolioPage() {
  const token = localStorage.getItem('token') || '';
  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio', token],
    queryFn: () => getPortfolio(token),
    enabled: !!token,
  });

  let chartData: { name: string; value: number }[] = [];
  if (data && typeof data === 'object' && 'cash' in data && 'equity' in data && Array.isArray(data.positions)) {
    const positions = (data.positions as any[]).filter((pos) => pos.qty !== 0);
    chartData = [
      ...positions.map((pos) => ({ name: pos.ticker, value: pos.qty * pos.mkt_price })),
      { name: 'Cash', value: data.cash }
    ];
  }

  return (
    <Box maxWidth={600} mx="auto" mt={6}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Portfolio Allocation
        </Typography>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Failed to load portfolio.</Typography>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={(props) => {
                  const { name, percent } = props as { name: string; percent: number };
                  return `${name}: ${(percent * 100).toFixed(0)}%`;
                }}
              >
                {chartData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Typography color="text.secondary">No portfolio data.</Typography>
        )}
      </Paper>
    </Box>
  );
}
