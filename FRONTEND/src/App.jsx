import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// --- Components & Pages ---
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import LandingPage from "./components/pages/LandingPage";
// import CenterDetails from './pages/CenterDetails'; // Uncomment when you create this file

// --- Admin Components ---
// Make sure these paths match where you saved the files!
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminCenter from "./components/admin/AdminCenter";
import AdminUsers from "./components/admin/AdminUsers"; // Ensure you created this file

// --- Layouts ---
import MainLayout from "./components/layouts/MainLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminOrders from "./components/admin/AdminOrders";

function App() {
  return (
    <>
      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route
          path="/"
          element={
            <MainLayout>
              <LandingPage />
            </MainLayout>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ---------------- USER ROUTES ---------------- */}
        <Route
          path="/home"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/center/:id"
          element={
            <MainLayout>
              {/* <CenterDetails /> */}
              <div style={{ padding: 20 }}>
                Center Details Page (Coming Soon)
              </div>
            </MainLayout>
          }
        />

        {/* ---------------- ADMIN ROUTES ---------------- */}
        {/* Standalone Admin Login (No Layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="centers" element={<AdminCenter />} />
          <Route path="users" element={<AdminUsers />} />

          {/* ADD THIS NEW ROUTE */}
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* ---------------- 404 CATCH-ALL ---------------- */}
        <Route
          path="*"
          element={<div className="error-page">404 - Page Not Found</div>}
        />
      </Routes>
    </>
  );
}

export default App;
