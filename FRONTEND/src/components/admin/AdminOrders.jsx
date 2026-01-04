import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function AdminOrders() {
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Menu State ---
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${baseurl}/api/bookings`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load bookings. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [baseurl]);

  // --- Handlers ---
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      // 1. Call Backend to update status
      await axios.put(`${baseurl}/api/bookings/${selectedId}`, { status: newStatus });

      // 2. Update UI locally (so we don't have to refresh)
      setOrders(orders.map(order => 
        order._id === selectedId ? { ...order, status: newStatus } : order
      ));
      
      handleMenuClose();
    } catch (err) {
      alert("Failed to update status. Check console.");
      console.error(err);
    }
  };

  // Helper for colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Cancelled': return 'error';
      default: return 'warning'; // Pending
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Bookings
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Customer Name</strong></TableCell>
              <TableCell><strong>Washing Center</strong></TableCell>
              <TableCell><strong>Service</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center"><CircularProgress /></TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No bookings found.</TableCell>
              </TableRow>
            ) : (
              orders.map((row) => (
                <TableRow key={row._id} hover>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.centerName}</TableCell>
                  <TableCell>{row.service}</TableCell>
                  <TableCell>
                    {new Date(row.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      color={getStatusColor(row.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuOpen(e, row._id)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Action Menu --- */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('Pending')}>Mark Pending</MenuItem>
        <MenuItem onClick={() => handleStatusChange('In Progress')}>Accept / In Progress</MenuItem>
        <MenuItem onClick={() => handleStatusChange('Completed')}>Mark Completed</MenuItem>
        <MenuItem onClick={() => handleStatusChange('Cancelled')} sx={{ color: 'red' }}>Cancel Booking</MenuItem>
      </Menu>
    </Box>
  );
}