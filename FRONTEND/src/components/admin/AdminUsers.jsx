import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";

const AdminUsers = () => {
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      // Ensure your backend has router.get('/', ...) in userRoute.js
      const response = await axios.get(`${baseurl}/api`); 
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError("Could not load users. (Ensure backend GET /api route exists)");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${baseurl}/api/${id}`);
        fetchUsers(); // Refresh list
      } catch (err) {
        alert("Error deleting user");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        User Management
      </Typography>

      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Username / Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                  {user._id}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon color="action" />
                    {user.ename || user.email || "No Name"}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.role || "User"} 
                    color={user.role === 'admin' ? "primary" : "default"} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleDelete(user._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
             {users.length === 0 && !error && (
                <TableRow>
                    <TableCell colSpan={4} align="center">No users found</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminUsers;