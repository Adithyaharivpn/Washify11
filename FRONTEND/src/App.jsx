import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';


// then add this route inside <Routes>:
// <Route path='/face' element={<Face />} />

// 🧩 Component Imports
import Signup from './components/Signup';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Maain from './components/Maain';
import Admin from './components/Admin';
import Home from './components/Home'; 
import Face from './components/Face'; 
import AdminLogin from './components/AdminLogin'; 
import AdminHome from './components/AdminHome'; 
import AdminCenter from './components/AdminCenter';




function App() {
  const [count, setCount] = useState(0);

  // Ensure you have this import at the top of the file:
  // import AdminCenter from './components/AdminCenter';

  return (
    <>
      {/* Optional Navbar (uncomment if needed) */}
      {/* <Navbar /> */}

      <Routes>
        {/* 🔹 Signup Page */}
        <Route path='/S' element={<Signup />} />

        {/* 🔹 Login Page */}
        <Route path='/L' element={<Login />} />

        {/* 🔹 Admin Page (wrapped in Maain layout) */}
        <Route path='/admin' element={<Maain child={<Admin />} />} />

        {/* 🔹 Admin Login Page */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 🔹 Admin Home Page */}
        <Route path="/admin-home" element={<AdminHome />} />

        {/* 🔹 Admin Center Page */}
        <Route path="/admin-center" element={<AdminCenter/>} />

        {/* 🔹 Home Page (includes Beams background) */}
        <Route path='/home' element={<Home />} />

        {/* 🔹 Face Page */}
        <Route path='/' element={<Face />} />
      </Routes>
    </>
  );
}

export default App;
