import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [input, setInput] = useState({});
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const inputHandler = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addHandler = async () => {
    if (!input.fname || !input.ename || !input.password) {
      alert("Please fill all fields.");
      return;
    }
    try {
      const res = await axios.post(`${baseurl}/api/users/`, input);
      alert(res.data?.message || "Signup successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="signup-page">
      <Box className="signup-card" component="main" role="main" aria-labelledby="signup-heading">
        <div className="brand" aria-hidden>
          <div className="logo">
          <div>
             <div className="brand"><div className="logo-box"><div className="gradient-text"><i>W</i></div></div><div className="brand-text"><div className="brand-title">Washify</div> <br></br>
             <div className="brand-sub">Connect · Book · Track</div></div></div>
          </div>
        </div>
        </div>

        <div className="signup-grid">
          <div className="panel-form">
            <Typography id="signup-heading" className="signup-heading">
              <b><i>WASHIFY.</i></b>
            </Typography>

            <Typography className="signup-sub">Signup Form</Typography>

            <div className="form-row" role="form" aria-label="Signup fields">
              <TextField
                fullWidth
                label="Full name"
                variant="outlined"
                margin="normal"
                name="fname"
                onChange={inputHandler}
                autoComplete="name"
                aria-label="Full name"
              />

              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                name="ename"
                onChange={inputHandler}
                autoComplete="email"
                type="email"
                aria-label="Email"
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="normal"
                name="password"
                onChange={inputHandler}
                type="password"
                autoComplete="new-password"
                aria-label="Password"
              />

              <Button
                onClick={addHandler}
                fullWidth
                variant="contained"
                sx={{
  backgroundColor: "navy  blue",
  "&:hover": { backgroundColor: "#008712ff" }, // a slightly darker shade for hover
  fontWeight: 600,
  fontFamily: "'Poppins', sans-serif",
}}
                className="custom-btn"
                aria-label="Sign up"
              >
                Sign Up
              </Button>
            </div>

            <div className="link-row">
              Already a user?{" "}
              <Link to="/login">
                <b>Login</b>
              </Link>
            </div>

            <div className="helper-note">By signing up you agree to our Terms and Privacy Policy.</div>
          </div>

          <div className="panel-illustration" aria-hidden>
            <div className="illustration-card">
              <div className="illustration-image">Illustration / Map preview</div>
              <Typography variant="body2" sx={{ color: "var(--muted)", textAlign: "center", maxWidth: 320 }}>
                Discover nearby washing centres, compare ratings and services with Washify.
              </Typography>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default Signup;