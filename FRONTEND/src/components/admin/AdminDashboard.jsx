import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  Edit,
  Logout,
  People,
  PostAdd,
  ShoppingCart,
} from "@mui/icons-material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  // If a center object is passed via navigation state
  const passedCenter = (location && location.state && location.state.pro) || null;

  const [owner, setOwner] = useState({
    name: passedCenter?.ownerName || "Admin User",
    contact: passedCenter?.contact || "",
    email: passedCenter?.email || "",
  });

  // Mock stats
  const [stats, setStats] = useState({
    totalOrders: 12,
    activeOrders: 5,
    completedOrders: 7,
    totalEarnings: 4500,
  });

  const onLogout = () => {
    sessionStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="home-page">
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Welcome, {owner.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admin Dashboard Overview
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton color="error" onClick={onLogout} title="Log Out">
              <Logout />
            </IconButton>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Total Orders</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{stats.totalOrders}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Active Orders</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{stats.activeOrders}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Completed Orders</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{stats.completedOrders}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Total Earnings</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>₹{stats.totalEarnings}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Main Content Area - Quick Actions */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Button
                            fullWidth
                            variant="outlined"
                            component={RouterLink}
                            to="/admin/centers"
                            startIcon={<PostAdd />}
                            sx={{ py: 2, justifyContent: 'flex-start' }}
                        >
                            Manage Centers
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            fullWidth
                            variant="outlined"
                            component={RouterLink}
                            to="/admin/orders"
                            startIcon={<ShoppingCart />}
                            sx={{ py: 2, justifyContent: 'flex-start' }}
                        >
                            Manage Orders
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            fullWidth
                            variant="outlined"
                            component={RouterLink}
                            to="/admin/users"
                            startIcon={<People />}
                            sx={{ py: 2, justifyContent: 'flex-start' }}
                        >
                            Manage Users
                        </Button>
                    </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Status Summary */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">System Status</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                   System Status: <b>Operational</b>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                   Backend Connection: <b>{baseurl ? "Connected" : "Unknown"}</b>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default AdminDashboard;