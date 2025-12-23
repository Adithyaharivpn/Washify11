import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Alert, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import "./AdminLogin.css";

const AdminLogin = () => {
    const [input, setInput] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const baseurl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    // If already logged in as admin, redirect to admin dashboard
    const storedRole = typeof window !== "undefined" ? sessionStorage.getItem("role") : null;
    if (storedRole === "admin") {
        return <Navigate to="/admin" replace />;
    }

    const inputHandler = (e) => {
        setError("");
        setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const submitHandler = async () => {
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

            // Expecting response containing user with role
            if (res?.status === 200 && res?.data?.user) {
                const { user } = res.data;
                sessionStorage.setItem("role", user.role);
                sessionStorage.setItem("user", JSON.stringify(user));
                if (user.role === "admin") {
                    navigate("/admin");
                } else {
                    // If not admin, clear stored info and show error
                    sessionStorage.removeItem("role");
                    sessionStorage.removeItem("user");
                    setError("Access denied. This page is for administrators only.");
                }
            } else {
                setError(res?.data?.message || "Login failed.");
            }
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.message || "Network or server error.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Box className="login-card" component="main" role="main" aria-labelledby="admin-login-heading">
                <div className="brand" aria-hidden>
                    <div className="logo">
                        <div>
                            <div className="brand">
                                <div className="logo-box">
                                    <div className="gradient-text">
                                        <i>W</i>
                                    </div>
                                </div>
                                <div className="brand-text">
                                    <div className="brand-title">Washify</div>
                                    <div className="brand-sub">Connect · Book · Track</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Typography
                    id="admin-login-heading"
                    className="login-heading"
                    sx={{ color: "#394e9fff" }}
                >
                    <b>
                        <i>ADMIN PORTAL</i>
                    </b>
                </Typography>

                <Typography className="login-sub">Administrator Login</Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    name="email"
                    value={input.email}
                    onChange={inputHandler}
                    autoComplete="username"
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
                />

                <Button
                    onClick={submitHandler}
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                        backgroundColor: "#0048ef",
                        "&:hover": { backgroundColor: "#003ad6" },
                        fontWeight: 600,
                        fontFamily: "'Poppins', sans-serif",
                        mt: 2,
                        mb: 1,
                    }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "LOG IN"}
                </Button>

                <Typography variant="body2" sx={{ color: "text.secondary", mt: 2, mb: 1, textAlign: "center" }}>
                    Or continue with
                </Typography>

                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 12 }}>
                    <Button
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            padding: "8px 16px",
                            borderColor: "#e2e8f0",
                        }}
                        disabled
                    >
                        <GoogleIcon sx={{ color: "#0048efff" }} />
                    </Button>
                    
                </div>
            </Box>
        </div>
    );
};

export default AdminLogin;