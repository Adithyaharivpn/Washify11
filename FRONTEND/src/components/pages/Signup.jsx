import React, { useState } from "react";
import { Button, TextField, Typography, Box, Alert } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [input, setInput] = useState({});
  const [error, setError] = useState("");
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const inputHandler = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addHandler = async () => {
    if (!input.fname || !input.ename || !input.password) {
      setError("Please fill all fields.");
      return;
    }
    try {
      // POST to /api (User Signup Route)
      const res = await axios.post(`${baseurl}/api`, input);
      alert(res.data?.message || "Signup successful");
      navigate("/login"); // ✅ Fixed route
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundImage: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        p: 2
      }}
    >
      <Box 
        sx={{ 
          maxWidth: 450, 
          width: '100%', 
          bgcolor: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)',
          borderRadius: 3, 
          p: 4, 
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}
      >
        <Box textAlign="center" mb={3}>
           <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', letterSpacing: 2 }}>
             WASHIFY
           </Typography>
           <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
             Create your account
           </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* --- Custom Styled Inputs for Dark Background --- */}
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          margin="normal"
          name="fname"
          onChange={inputHandler}
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: '#64b5f6' },
            }
          }}
        />

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          name="ename"
          onChange={inputHandler}
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: '#64b5f6' },
            }
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          name="password"
          onChange={inputHandler}
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: '#64b5f6' },
            }
          }}
        />

        <Button
          onClick={addHandler}
          fullWidth
          variant="contained"
          size="large"
          sx={{
            mt: 3,
            mb: 2,
            bgcolor: 'white',
            color: '#1a237e',
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
        >
          SIGN UP
        </Button>

        <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          Already a user?{" "}
          <Link to="/login" style={{ color: '#90caf9', textDecoration: 'none', fontWeight: 'bold' }}>
            Login
          </Link>
        </Typography>

      </Box>
    </Box>
  );
};

export default Signup;