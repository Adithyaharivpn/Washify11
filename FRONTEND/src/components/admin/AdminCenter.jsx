import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Stack,
  Alert,
  Snackbar,
  Grid, // ✅ Keeping your standard Grid import
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function AdminCenter() {
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  // ✅ Point to the correct centers route
  const API_URL = `${baseurl}/api/centers`; 

  const [centers, setCenters] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // ✅ FIXED: Form state now matches your Mongoose Schema exactly
  const [form, setForm] = useState({
    name: "",
    location: "",
    services: "",
    description: "",
    contact: "",
    price: 0
  });

  // 1. GET (Read)
  const fetchCenters = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/centers/`);
      setCenters(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
      showSnackbar("Error fetching data. Ensure backend is running.", "error");
    }
  };

  useEffect(() => {
    fetchCenters();
  }, [baseurl]);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open Dialog for Add
  const handleAddOpen = () => {
    setForm({ name: "", location: "", services: "", description: "", contact: "", price: 0 });
    setIsEdit(false);
    setOpen(true);
  };

  // Open Dialog for Edit
  const handleEditOpen = (row) => {
    setForm({
      name: row.name,
      location: row.location,
      services: row.services,
      description: row.description,
      contact: row.contact,
      price: row.price || 0
    });
    setCurrentId(row._id);
    setIsEdit(true);
    setOpen(true);
  };

  // 2. POST (Create) & 3. PUT (Update)
  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!form.name || !form.location) {
        showSnackbar("Name and Location are required!", "warning");
        return;
      }

      if (isEdit) {
        // Update
        await axios.put(`${API_URL}/${currentId}`, form);
        showSnackbar("Center updated successfully!", "success");
      } else {
        // Create
        await axios.post(API_URL, form);
        showSnackbar("Center added successfully!", "success");
      }
      setOpen(false);
      fetchCenters(); // Refresh list
    } catch (error) {
      showSnackbar("Operation failed. Check server logs.", "error");
      console.error(error);
    }
  };

  // 4. DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this center?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        showSnackbar("Deleted successfully", "warning");
        fetchCenters();
      } catch (error) {
        showSnackbar("Error deleting record", "error");
      }
    }
  };

  const showSnackbar = (msg, severity) => {
    setSnackbar({ open: true, message: msg, severity });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Manage Washing Centers</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddOpen}>
          Add Center
        </Button>
      </Stack>

      {/* Data Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><strong>Center Name</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Services</strong></TableCell>
              <TableCell><strong>Contact</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {centers.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.services}</TableCell>
                <TableCell>{row.contact}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEditOpen(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(row._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {centers.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No centers found. Click "Add Center" to create one.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? "Edit Center Details" : "Add New Center"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            
            {/* Row 1: Name & Location (Required) */}
            <Grid item xs={12} md={6}>
              <TextField 
                label="Center Name" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                fullWidth 
                required 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                label="Location" 
                name="location" 
                value={form.location} 
                onChange={handleChange} 
                fullWidth 
                required
                placeholder="e.g. Thrissur"
              />
            </Grid>

            {/* Row 2: Contact & Price */}
            <Grid item xs={12} md={6}>
              <TextField 
                label="Contact Number" 
                name="contact" 
                value={form.contact} 
                onChange={handleChange} 
                fullWidth 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                label="Base Price" 
                name="price" 
                type="number"
                value={form.price} 
                onChange={handleChange} 
                fullWidth 
              />
            </Grid>

            {/* Row 3: Services & Description */}
            <Grid item xs={12}>
              <TextField 
                label="Services (comma separated)" 
                name="services" 
                value={form.services} 
                onChange={handleChange} 
                fullWidth 
                placeholder="e.g. Dry Clean, Wash & Fold, Polishing"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Description" 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                fullWidth 
                multiline
                rows={3}
              />
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}