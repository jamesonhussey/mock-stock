import { Container, Box, Typography, Paper } from '@mui/material';
import MarketList from '../components/MarketList';

export default function MarketsPage() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" width="100vw">
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Markets
          </Typography>
          <MarketList />
        </Paper>
      </Container>
    </Box>
  );
}
