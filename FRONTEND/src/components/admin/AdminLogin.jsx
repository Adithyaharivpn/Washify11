import React, { useState } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert, 
  CircularProgress, 
  Paper, 
  Stack 
} from "@mui/material";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";

const AdminLogin = () => {
    const [input, setInput] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const baseurl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    // Check if already logged in
    const storedRole = sessionStorage.getItem("role");
    if (storedRole === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const inputHandler = (e) => {
        setError("");
        setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const submitHandler = async (e) => {
        e.preventDefault(); // Prevent form reload
        setError("");
        
        if (!input.email || !input.password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${baseurl}/api/login`, {
                email: input.email,
                password: input.password,
            });

            if (res?.status === 200 && res?.data?.user) {
                const { user } = res.data;
                
                if (user.role === "admin") {
                    sessionStorage.setItem("role", user.role);
                    sessionStorage.setItem("user", JSON.stringify(user));
                    navigate("/admin/dashboard");
                } else {
                    setError("Access denied. This portal is for Administrators only.");
                }
            } else {
                setError(res?.data?.message || "Login failed.");
            }
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.message || "Network error. Please check your connection.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                p: 2 
            }}
        >
            <Paper 
                elevation={6}
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    p: 4,
                    borderRadius: 3,
                    textAlign: 'center'
                }}
            >
                {/* Logo Section */}
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ mb: 1 }}>
                    <Box 
                        sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: '#1a237e', 
                            color: 'white', 
                            borderRadius: 1, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 'bold', 
                            fontSize: '1.2rem',
                            fontStyle: 'italic'
                        }}
                    >
                        W
                    </Box>
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                        Washify
                    </Typography>
                </Stack>
                
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3, letterSpacing: 1 }}>
                    ADMINISTRATION PORTAL
                </Typography>

                {/* Error Message */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
                        {error}
                    </Alert>
                )}

                {/* Login Form */}
                <form onSubmit={submitHandler}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        margin="normal"
                        name="email"
                        type="email"
                        value={input.email}
                        onChange={inputHandler}
                        autoComplete="username"
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        variant="outlined"
                        margin="normal"
                        name="password"
                        type="password"
                        value={input.password}
                        onChange={inputHandler}
                        autoComplete="current-password"
                        disabled={loading}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            mt: 3,
                            mb: 2,
                            py: 1.5,
                            bgcolor: "#0048ef",
                            "&:hover": { bgcolor: "#003ad6" },
                            fontWeight: "bold",
                            textTransform: "none",
                            fontSize: "1rem"
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                    </Button>
                </form>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                    Or sign in with
                </Typography>

                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    sx={{ borderColor: '#e0e0e0', color: 'text.secondary', textTransform: 'none' }}
                    disabled
                >
                    Google Admin (Disabled)
                </Button>
            </Paper>
        </Box>
    );
};

export default AdminLogin;