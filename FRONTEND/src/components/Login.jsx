import { Box, Button, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import "./Login.css";


const Login = () => {
    var[input,setInput] =useState({})
    var baseurl = import.meta.env.VITE_API_BASE_URL;
    var navigate=useNavigate();
        const inpuHandler =(e)=>{
            // console.log(e.target.value)
            setInput({...input,[e.target.name]:e.target.value})
            console.log(input)
            
        }
        const addhandler=()=>
          axios
      .post(`${baseurl}/api/login`, input)
      .then((res) => {
        console.log(res.data);
        alert(res.data.message)
        sessionStorage.setItem("role",res.data.user.role)
        if(res.status===200){
          alert(res.data.message)
          if(res.data.user.role=='admin'){
            navigate('/admin')
          }else{
            navigate('/home')
        }
      }
    
      })  
      .catch((error) => {
        console.log(error);
      });
          

            console.log("Clicked")
    
  return (
    <div className="login-page">
      <Box
        className="login-card"
        component="main"
        role="main"
        aria-labelledby="login-heading"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          gap: 4,
          p: 4,
        }}
      >
        {/* Left: form / brand */}
        <Box
          sx={{
            flex: "0 1 480px",
            width: { xs: "100%", md: 480 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "stretch",
          }}
        >
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
                    <div className="brand-title">Washify</div> <br />
                    <div className="brand-sub">Connect · Book · Track</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Typography id="login-heading" className="login-heading">
            <b>
              <i>WASHIFY.</i>
            </b>
          </Typography>

          <Typography className="login-sub">Login</Typography>

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            name="ename"
            onChange={inpuHandler}
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            name="password"
            type="password"
            onChange={inpuHandler}
          />

          <Button
            onClick={addhandler}
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "navy  blue",
              "&:hover": { backgroundColor: "#008712ff" },
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            LOG IN
          </Button>

          <Typography
            variant="body1"
            sx={{ color: "text.secondary", marginTop: 3 }}
          >
            Don’t have an account?{" "}
            <Link
              to="/"
              style={{ color: "#055fbf", fontWeight: 500, textDecoration: "none" }}
            >
              <b>SignUp</b>
            </Link>
          </Typography>

          <Typography variant="caption" sx={{ color: "#a0aec0" }}>
            Or continue with
          </Typography>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                borderRadius: "8px",
                padding: "8px 16px",
                borderColor: "#e2e8f0",
                "&:hover": {
                  borderColor: "#cbd5e0",
                },
              }}
            >
              <GoogleIcon sx={{ color: "#0048efff" }} />
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "8px",
                padding: "8px 16px",
                borderColor: "#e2e8f0",
                "&:hover": {
                  borderColor: "#cbd5e0",
                },
              }}
            >
              <GitHubIcon sx={{ color: "#0048efff" }} />
            </Button>
          </div>
        </Box>

        {/* Right: illustration */}
        <Box
          className="panel-illustration"
          aria-hidden
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: { xs: 160, md: "auto" },
          }}
        >
          <div className="illustration-card" style={{ maxWidth: 420, textAlign: "center" }}>
            <div className="illustration-image">Illustration / Map preview</div>
            <Typography
              variant="body2"
              sx={{ color: "var(--muted)", textAlign: "center", maxWidth: 320, margin: "12px auto 0" }}
            >
              Discover nearby washing centres, compare ratings and services with Washify.
            </Typography>
          </div>
        </Box>
      </Box>
    </div>
  )
}

export default Login

