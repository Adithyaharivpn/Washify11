
import { Routes, Route } from "react-router-dom";
import "./App.css";

// then add this route inside <Routes>:
// <Route path='/face' element={<Face />} />

// 🧩 Component Imports
import Signup from "./components/Signup";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Maain from "./components/Maain";
import Admin from "./components/Admin";
import Home from "./components/Home";
import Face from "./components/Face";
import AdminLogin from "./components/AdminLogin";
import AdminHome from "./components/AdminHome";
import AdminCenter from "./components/AdminCenter";
import AddCenter from "./components/AddCenter";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  

  return (
    <>
      <Routes>
        {/* 🔹 Signup Page */}
        <Route path="/signin" element={<Signup />} />

        {/* 🔹 Login Page */}
        <Route path="/login" element={<Login />} />

        {/* 🔹 Admin Page */}
        <Route path="/admin" element={<Maain child={<Admin />} />} />

        {/* 🔹 Admin Login Page */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 🔹 Admin Home Page */}
        <Route path="/admin-home" element={<AdminHome />} />

        {/* 🔹 Admin Center Page */}
        <Route path="/admin-center" element={<AdminCenter />} />

        <Route path="/dashboard" element={<Maain child={<AdminDashboard />} />} />

        {/* 🔹 Home Page (includes Beams background) */}
        <Route path="/home" element={<Home />} />

        {/* 🔹 Add Center Page */}
        <Route path="/add-center" element={<AddCenter />} />

        {/* 🔹 Face Page */}
        <Route path="/face" element={<Face />} />
      </Routes>
    </>
  );
}

export default App;
