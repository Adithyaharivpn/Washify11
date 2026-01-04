import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Link as MuiLink } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

const Login = () => {
  const [input, setInput] = useState({ ename: "", password: "" });
  const [error, setError] = useState("");
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async () => {
    if (!input.ename || !input.password) {
      setError("Please fill in all fields.");
      return;
    }
    
    try {
      const res = await axios.post(`${baseurl}/api/login`, input);
      
      if (res.status === 200) {
        // ✅ FIX: Save the full user object, not just the role
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
        sessionStorage.setItem("role", res.data.user.role);
        
        // Navigate based on role
        if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/home');
        }
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6f8' }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          bgcolor: 'white',
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden',
          maxWidth: 900,
          width: '90%'
        }}
      >
        {/* Left: Form Section */}
        <Box sx={{ p: 5, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Brand Logo */}
          <Box display="flex" alignItems="center" mb={3}>
             <Box sx={{ width: 40, height: 40, bgcolor: '#1a237e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, mr: 2, fontWeight: 'bold', fontStyle: 'italic' }}>
                W
             </Box>
             <Box>
                <Typography variant="h6" fontWeight="bold" lineHeight={1}>Washify</Typography>
                <Typography variant="caption" color="text.secondary">Connect · Book · Track</Typography>
             </Box>
          </Box>

          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>Login</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Welcome back! Please enter your details.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            name="ename"
            onChange={inputHandler}
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            name="password"
            type="password"
            onChange={inputHandler}
          />

          <Button
            onClick={submitHandler}
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#1a237e',
              '&:hover': { bgcolor: '#0d47a1' },
              fontWeight: 600
            }}
          >
            LOG IN
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <Link to="/signup" style={{ textDecoration: 'none', color: '#1a237e', fontWeight: 'bold' }}>
              Sign Up
            </Link>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Box sx={{ flex: 1, height: '1px', bgcolor: '#e0e0e0' }} />
            <Typography variant="caption" sx={{ mx: 2, color: '#9e9e9e' }}>OR CONTINUE WITH</Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: '#e0e0e0' }} />
          </Box>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button variant="outlined" sx={{ minWidth: 0, px: 3, borderColor: '#e0e0e0' }}>
              <GoogleIcon color="action" />
            </Button>
            <Button variant="outlined" sx={{ minWidth: 0, px: 3, borderColor: '#e0e0e0' }}>
              <GitHubIcon color="action" />
            </Button>
          </Box>
        </Box>

        {/* Right: Illustration Section (Hidden on mobile) */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            bgcolor: '#f5f7fa',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            borderLeft: '1px solid #e0e0e0'
          }}
        >
          <Box textAlign="center">
            <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
              Find Nearby Washing Centers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Discover, compare, and book services instantly with Washify.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;