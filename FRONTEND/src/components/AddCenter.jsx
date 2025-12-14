import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Container,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCenter = () => {
  const [input, setInput] = useState({
    oname: "", // Owner Name
    lname: "", // Center Name
    hname: "", // Address
    gname: "", // Gram Panchayat
    sname: "", // Street
    aname: "", // Opens At
    iname: "", // Closes At
    available: true,
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });
  const [errors, setErrors] = useState({});

  const baseurl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!input.oname.trim()) newErrors.oname = "Owner name is required";
    if (!input.lname.trim()) newErrors.lname = "Center name is required";
    if (!input.hname.trim()) newErrors.hname = "Address is required";
    if (!input.aname.trim()) newErrors.aname = "Opening time is required";
    if (!input.iname.trim()) newErrors.iname = "Closing time is required";
    
    // Validate time format (basic check for HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (input.aname && !timeRegex.test(input.aname)) {
      newErrors.aname = "Invalid time format (use HH:MM, e.g., 08:00)";
    }
    if (input.iname && !timeRegex.test(input.iname)) {
      newErrors.iname = "Invalid time format (use HH:MM, e.g., 20:00)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix the errors in the form",
        severity: "error"
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        oname: input.oname.trim(),
        lname: input.lname.trim(),
        hname: input.hname.trim(),
        gname: input.gname.trim(),
        sname: input.sname.trim(),
        aname: input.aname.trim(),
        iname: input.iname.trim(),
        available: input.available,
      };

      const res = await axios.post(`${baseurl}/a/add-center`, payload);
      
      setSnackbar({
        open: true,
        message: res.data?.message || "Center added successfully!",
        severity: "success"
      });
      
      // Navigate after short delay
      setTimeout(() => {
        navigate("/home");
      }, 1500);
      
    } catch (err) {
      console.error("Error adding center:", err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to add center. Please try again.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput({
      oname: "",
      lname: "",
      hname: "",
      gname: "",
      sname: "",
      aname: "",
      iname: "",
      available: true,
    });
    setErrors({});
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      {/* App Bar */}
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)" }}>
        <Container maxWidth="lg">
          <Toolbar>
            <IconButton edge="start" onClick={() => navigate("/home")} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <LocalLaundryServiceIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Washify
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <AddBusinessIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Add Washing Centre
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fill in the details to list your laundry centre
              </Typography>
            </Box>
          </Stack>

          {/* Form */}
          <Grid container spacing={3}>
            {/* Owner Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
                Owner Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Owner Name"
                name="oname"
                value={input.oname}
                onChange={handleChange}
                error={!!errors.oname}
                helperText={errors.oname || "Full name of the owner"}
                placeholder="e.g., John Doe"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Centre Name"
                name="lname"
                value={input.lname}
                onChange={handleChange}
                error={!!errors.lname}
                helperText={errors.lname || "Name of your laundry centre"}
                placeholder="e.g., Wash Hub"
              />
            </Grid>

            {/* Location Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ mb: 1, mt: 2 }}>
                Location Details
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Address"
                name="hname"
                value={input.hname}
                onChange={handleChange}
                error={!!errors.hname}
                helperText={errors.hname || "Main address or house name"}
                placeholder="e.g., Building No. 123, Main Road"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Street"
                name="sname"
                value={input.sname}
                onChange={handleChange}
                helperText="Street or area name (optional)"
                placeholder="e.g., MG Road"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Gram Panchayat / City"
                name="gname"
                value={input.gname}
                onChange={handleChange}
                helperText="Panchayat or city name (optional)"
                placeholder="e.g., Irinjalakuda"
              />
            </Grid>

            {/* Operating Hours */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ mb: 1, mt: 2 }}>
                Operating Hours
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Opens At"
                name="aname"
                value={input.aname}
                onChange={handleChange}
                error={!!errors.aname}
                helperText={errors.aname || "Format: HH:MM (e.g., 08:00)"}
                placeholder="08:00"
                type="time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Closes At"
                name="iname"
                value={input.iname}
                onChange={handleChange}
                error={!!errors.iname}
                helperText={errors.iname || "Format: HH:MM (e.g., 20:00)"}
                placeholder="20:00"
                type="time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ mb: 1, mt: 2 }}>
                Availability Status
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={input.available}
                      onChange={handleChange}
                      name="available"
                      color="success"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        Currently Available
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Check this if your centre is currently accepting bookings
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button 
                  variant="outlined" 
                  onClick={() => navigate("/home")}
                  disabled={loading}
                  size="large"
                  sx={{ minWidth: 120 }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleReset}
                  disabled={loading}
                  size="large"
                  sx={{ minWidth: 120 }}
                >
                  Reset
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading ? null : <SaveIcon />}
                  size="large"
                  sx={{ 
                    minWidth: 140,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  }}
                >
                  {loading ? "Adding..." : "Add Centre"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Help Section */}
        <Paper elevation={0} variant="outlined" sx={{ p: 3, mt: 3, borderRadius: 3, bgcolor: "info.50" }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            📝 Tips for listing your centre:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>Provide accurate operating hours to avoid customer confusion</li>
              <li>Make sure the address is complete and easy to find</li>
              <li>Keep the availability status updated</li>
              <li>Use the centre name that customers will recognize</li>
            </ul>
          </Typography>
        </Paper>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddCenter;