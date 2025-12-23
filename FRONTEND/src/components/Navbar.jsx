import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu';
import "./Navbar.css";


const Navbar = () => {
  const [role,setRole] = useState(null);
  const navigate = useNavigate();
  useEffect(()=>{
    const savedRole = sessionStorage.getItem('role');
    setRole(savedRole);
  },[])

  const handleLogout = ()=>{
    sessionStorage.clear();
    navigate('/')
  }

  return (
    <div>
      
         <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <AppBar color='secondary'>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon sx={{ marginRight: '20px' }} />


            <div className="brand"><div className="logo-box"><div className="gradient-text"><i>W</i></div></div><div className="brand-text"><div className="brand-title">Washify</div> 
             <div className="brand-sub">Connect · Book · Track</div></div></div>

          </IconButton>

          
         <Button >
            <Link to="/admin-login">Admin Login</Link>
         </Button> 

         <Button >
            <Link to="/admin-center">Admin Center</Link>
         </Button> 
{role && (
          <Button onClick={handleLogout} color='inherit' >
          Logout
       </Button>
        )}  

        </Toolbar>
      </AppBar>
      </AppBar>
    </Box>
    
    </div>
  )
}

export default Navbar
