import { Container, Box, Typography, Paper } from '@mui/material';

export default function LeaderboardPage() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" width="100vw">
      <Container maxWidth="sm">
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Leaderboard
          </Typography>
          <Typography align="center" color="text.secondary">
            (Leaderboard content coming soon)
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
