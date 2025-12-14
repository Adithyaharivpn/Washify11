import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Stack,
  Link as MuiLink,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LocalLaundryService as LaundryIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Admin = () => {
  const baseurl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
  const navigate = useNavigate();
  
  const [input, setInput] = useState({
    fname: '',
    nname: '',
    ename: '',
    password: '',
    cpassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!input.fname.trim()) {
      newErrors.fname = 'Owner name is required';
    }

    // Phone validation
    if (!input.nname) {
      newErrors.nname = 'Contact number is required';
    } else if (!/^\d{10}$/.test(input.nname)) {
      newErrors.nname = 'Please enter a valid 10-digit phone number';
    }

    // Email validation
    if (!input.ename) {
      newErrors.ename = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.ename)) {
      newErrors.ename = 'Please enter a valid email address';
    }

    // Password validation
    if (!input.password) {
      newErrors.password = 'Password is required';
    } else if (input.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!input.cpassword) {
      newErrors.cpassword = 'Please confirm your password';
    } else if (input.password !== input.cpassword) {
      newErrors.cpassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlert({
        show: true,
        message: 'Please fix the errors in the form',
        severity: 'error'
      });
      return;
    }

    setLoading(true);

    const payload = {
      name: input.fname,
      ename: input.ename,
      phone: input.nname,
      password: input.password,
      role: 'admin', // Set role as admin
    };

    try {
      const response = await axios.post(`${baseurl}/users`, payload);
      
      setAlert({
        show: true,
        message: 'Admin account created successfully!',
        severity: 'success'
      });

      // Store user data in session
      sessionStorage.setItem('userName', input.fname);
      sessionStorage.setItem('role', 'admin');
      sessionStorage.setItem('userId', response.data.user?.id);

      // Redirect to admin dashboard after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Signup error:', error);
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Failed to create admin account. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
          {/* Header */}
          <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AdminIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            
            <Box textAlign="center">
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <LaundryIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  Washify
                </Typography>
              </Stack>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                Admin Registration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your admin account to manage the platform
              </Typography>
            </Box>
          </Stack>

          {/* Alert */}
          {alert.show && (
            <Alert 
              severity={alert.severity} 
              onClose={() => setAlert({ ...alert, show: false })}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {alert.message}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={submitHandler}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Owner Name"
                name="fname"
                value={input.fname}
                onChange={inputHandler}
                error={!!errors.fname}
                helperText={errors.fname}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Contact Number"
                name="nname"
                type="tel"
                value={input.nname}
                onChange={inputHandler}
                error={!!errors.nname}
                helperText={errors.nname || "Enter 10-digit mobile number"}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Email Address"
                name="ename"
                type="email"
                value={input.ename}
                onChange={inputHandler}
                error={!!errors.ename}
                helperText={errors.ename}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={input.password}
                onChange={inputHandler}
                error={!!errors.password}
                helperText={errors.password || "Minimum 6 characters"}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="cpassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={input.cpassword}
                onChange={inputHandler}
                error={!!errors.cpassword}
                helperText={errors.cpassword}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  }
                }}
              >
                {loading ? 'Creating Account...' : 'Create Admin Account'}
              </Button>
            </Stack>
          </form>

          {/* Footer Links */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an admin account?{' '}
              <MuiLink
                component={Link}
                to="/login"
                sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Login Here
              </MuiLink>
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Go to{' '}
              <MuiLink
                component={Link}
                to="/dashboard"
                sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Admin Dashboard
              </MuiLink>
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Not an admin?{' '}
              <MuiLink
                component={Link}
                to="/signup"
                sx={{ 
                  color: 'secondary.main', 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Create User Account
              </MuiLink>
            </Typography>
          </Box>

          {/* Info Box */}
          <Paper 
            variant="outlined" 
            sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: 'info.50', 
              borderColor: 'info.200',
              borderRadius: 2 
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              <strong>Admin Access Includes:</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" component="ul" sx={{ mt: 1, pl: 2 }}>
              <li>Manage all laundry centres</li>
              <li>User management and permissions</li>
              <li>View analytics and reports</li>
              <li>Platform configuration</li>
            </Typography>
          </Paper>
        </Paper>
      </Container>
    </Box>
  );
};

export default Admin;