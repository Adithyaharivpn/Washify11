import React, { useEffect, useState } from 'react';
import { 
  AppBar, 
  Box, 
  Button, 
  Toolbar, 
  Typography, 
  Container,
  Stack 
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';

const Navbar = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedRole = sessionStorage.getItem('role');
    setRole(savedRole);
  }, [location]); 

  const handleLogout = () => {
    sessionStorage.clear();
    setRole(null);
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: '#2b6cb0' }}> 
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            

            <Box 
              component={Link} 
              to="/home" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                flexGrow: 1, 
                color: 'white' 
              }}
            >
              {/* Logo Icon Box */}
              <Box sx={{ 
                bgcolor: 'white', 
                color: '#2b6cb0', 
                width: 40, 
                height: 40, 
                borderRadius: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mr: 1.5
              }}>
                <LocalLaundryServiceIcon />
              </Box>

              {/* Brand Text */}
              <Box>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '.1rem',
                    lineHeight: 1,
                  }}
                >
                  Washify
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Connect · Book · Track
                </Typography>
              </Box>
            </Box>

            {/* ---------------- NAVIGATION BUTTONS ---------------- */}
            <Stack direction="row" spacing={2}>
              
              {/* Show Home button to everyone */}
              <Button color="inherit" component={Link} to="/home">
                Home
              </Button>

              {/* LOGIC: If NOT logged in */}
              {!role && (
                <>
                  <Button color="inherit" component={Link} to="/admin/login">
                    Admin Portal
                  </Button>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    component={Link} 
                    to="/signup"
                    sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
                  >
                    Signup
                  </Button>
                </>
              )}

              {/* LOGIC: If Logged in as ADMIN */}
              {role === 'admin' && (
                <Button color="inherit" component={Link} to="/admin/dashboard">
                  Dashboard
                </Button>
              )}

              {/* LOGIC: If ANY user is logged in */}
              {role && (
                <Button 
                  onClick={handleLogout} 
                  sx={{ 
                    bgcolor: 'rgba(255,0,0,0.1)', 
                    '&:hover': { bgcolor: 'rgba(255,0,0,0.2)' },
                    color: 'white'
                  }}
                >
                  Logout
                </Button>
              )}
            </Stack>

          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Navbar;