
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

const authedPages = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Trades', path: '/trades' },
  { label: 'Market', path: '/markets' },
];
const publicPages = [
  { label: 'Login', path: '/login' },
  { label: 'Register', path: '/register' },
];

export default function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MockStock
        </Typography>
        <Box>
          {isLoggedIn ? (
            <>
              {authedPages.map((page) => (
                <Button
                  key={page.path}
                  color="inherit"
                  component={RouterLink}
                  to={page.path}
                  sx={{ ml: 1, '&:hover': { color: 'inherit' } }}
                >
                  {page.label}
                </Button>
              ))}
              <Button color="inherit" onClick={handleLogout} sx={{ ml: 1, '&:hover': { color: 'inherit' } }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              {publicPages.map((page) => (
                <Button
                  key={page.path}
                  color="inherit"
                  component={RouterLink}
                  to={page.path}
                  sx={{ ml: 1, '&:hover': { color: 'inherit' } }}
                >
                  {page.label}
                </Button>
              ))}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
