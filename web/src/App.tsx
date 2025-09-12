import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NavBar from './components/NavBar';
import DashboardPage from './pages/DashboardPage';
import MarketsPage from './pages/MarketsPage';
import TradePage from './pages/TradePage';
import PortfolioPage from './pages/PortfolioPage';
import LeaderboardPage from './pages/LeaderboardPage';
import TradesPage from './pages/TradesPage';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <RequireAuth><DashboardPage /></RequireAuth>
        } />
        <Route path="/markets" element={
          <RequireAuth><MarketsPage /></RequireAuth>
        } />
        <Route path="/trade/:ticker" element={
          <RequireAuth><TradePage /></RequireAuth>
        } />
        <Route path="/portfolio" element={
          <RequireAuth><PortfolioPage /></RequireAuth>
        } />
        <Route path="/trades" element={
          <RequireAuth><TradesPage /></RequireAuth>
        } />
        <Route path="/leaderboard" element={
          <RequireAuth><LeaderboardPage /></RequireAuth>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
