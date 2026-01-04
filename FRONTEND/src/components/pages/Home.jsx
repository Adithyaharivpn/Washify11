import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider,
  Stack,
  Grid 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import StarIcon from "@mui/icons-material/Star";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Home() {
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  
  const [centersData, setCentersData] = useState([]); 
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  
  // Dialog & Booking State
  const [sel, setSel] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    service: ""
  });

  // Notification State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("success");

  // 1. FETCH DATA
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(`${baseurl}/api/centers`);
        setCentersData(res.data);
      } catch (err) {
        console.error("Error fetching centers:", err);
      }
    };
    fetchCenters();
  }, [baseurl]);

  // Helper to open dialog and reset form
  const handleOpenDialog = (center) => {
    // Process services array safely
    const services = typeof center.services === 'string' 
      ? center.services.split(',').map(s => s.trim()) 
      : (center.services || []);

    setSel({ ...center, servicesArray: services });
    
    // Reset booking form with defaults
    setBookingForm({
      date: new Date().toISOString().split('T')[0], // Today's date
      time: "09:00",
      service: services.length > 0 ? services[0] : ""
    });
  };

  // 2. HANDLE BOOKING SUBMISSION
  const handleBook = async () => {
    // Check Login
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
      setMsg("Please login to book a service!");
      setSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    const user = JSON.parse(userStr);

    // Validation
    if (!bookingForm.date || !bookingForm.time || !bookingForm.service) {
      setMsg("Please select a date, time, and service.");
      setSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      // Combine Date and Time for backend
      const combinedDate = new Date(`${bookingForm.date}T${bookingForm.time}`);

      await axios.post(`${baseurl}/api/bookings`, {
        customerName: user.ename || user.email,
        centerName: sel.name,
        service: bookingForm.service,
        date: combinedDate,
        status: "Pending"
      });
      
      setMsg(`Booking Request Sent! (${bookingForm.service} at ${bookingForm.time})`);
      setSeverity("success");
      setSnackbarOpen(true);
      setSel(null); // Close dialog
    } catch (err) {
      console.error(err);
      setMsg("Booking failed. Please try again.");
      setSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  // 3. FILTER & SORT
  const centres = useMemo(() => {
    const qq = q.trim().toLowerCase();
    
    let list = centersData.map(c => ({
      ...c,
      servicesArray: typeof c.services === 'string' ? c.services.split(',').map(s => s.trim()) : (c.services || []),
      distanceKm: c.distanceKm || (Math.random() * 10).toFixed(1)
    }));

    list = list.filter(c => {
      const matchesQ = !qq || 
        (c.name && c.name.toLowerCase().includes(qq)) || 
        (c.address && c.address.toLowerCase().includes(qq)) || 
        c.servicesArray.some(s => s.toLowerCase().includes(qq));
      return matchesQ;
    });

    if (sortBy === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "distance") list.sort((a, b) => a.distanceKm - b.distanceKm);
    else if (sortBy === "name-asc") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    
    return list;
  }, [q, sortBy, centersData]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", pb: 4 }}>
      
      {/* --- Hero Section --- */}
      <Box sx={{ bgcolor: "#fff", py: 4, mb: 3, borderBottom: "1px solid #e0e0e0" }}>
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Find nearby washing centres
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Search by name, service, or address.
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search centres..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
                  ),
                }}
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth sx={{ bgcolor: "white" }}>
                <InputLabel>Sort by</InputLabel>
                <Select value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value)}>
                  <MenuItem value="recommended">Recommended</MenuItem>
                  <MenuItem value="rating">Highest Rating</MenuItem>
                  <MenuItem value="distance">Nearest</MenuItem>
                  <MenuItem value="name-asc">Name (A–Z)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* --- Main Content --- */}
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ mb: 2 }}><Typography variant="subtitle2" color="text.secondary">{centres.length} centre(s) found</Typography></Box>

            <Stack spacing={2}>
              {centres.map((c) => (
                <Card key={c._id || c.id} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 2, alignItems: 'center', transition: '0.3s', '&:hover': { boxShadow: 4 } }}>
                  <Box sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: '#3182ce', fontSize: 24 }}>
                      {c.name ? c.name.substring(0, 2).toUpperCase() : "WC"}
                    </Avatar>
                  </Box>

                  <CardContent sx={{ flex: 1, p: '0 !important' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" fontWeight="bold">{c.name}</Typography>
                      <Chip icon={<StarIcon sx={{ fontSize: '1rem !important' }} />} label={c.rating ? c.rating.toFixed(1) : "N/A"} size="small" color="warning" variant="outlined" sx={{ fontWeight: 'bold' }} />
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="body2">{c.address} ({c.distanceKm} km)</Typography>
                    </Stack>
                    <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {c.servicesArray.map((svc, idx) => (
                        <Chip key={idx} label={svc} size="small" sx={{ bgcolor: '#ebf8ff', color: '#2c5282' }} />
                      ))}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, gap: 1, ml: { sm: 2 } }}>
                    <Button variant="contained" fullWidth onClick={() => handleOpenDialog(c)} sx={{ bgcolor: '#3182ce' }}>
                      Book Now
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: "white" }}>
              <Typography variant="h6" gutterBottom>Map Preview</Typography>
              <Box sx={{ height: 250, bgcolor: "#e2e8f0", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
                [ Map Integration Placeholder ]
              </Box>
            </Paper>
          </Grid>

        </Grid>
      </Container>

      {/* --- BOOKING DIALOG (UPDATED) --- */}
      <Dialog 
        open={Boolean(sel)} 
        onClose={() => setSel(null)} 
        maxWidth="sm" 
        fullWidth
      >
        {sel && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid #eee' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight="bold">Book {sel.name}</Typography>
                <Chip icon={<StarIcon />} label={sel.rating || "N/A"} color="warning" />
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              {/* Center Info Header */}
              <Stack spacing={1} sx={{ mb: 3, bgcolor: '#f8f9fa', p: 2, borderRadius: 2 }}>
                 <Box display="flex" gap={1} alignItems="center">
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2">{sel.address}</Typography>
                 </Box>
                 <Box display="flex" gap={1} alignItems="center">
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">{sel.hours || "9:00 AM - 9:00 PM"}</Typography>
                 </Box>
              </Stack>

              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon color="primary"/> Select Details
              </Typography>
              
              {/* BOOKING FORM INPUTS */}
              <Grid container spacing={2}>
                {/* 1. Date Picker */}
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* 2. Time Picker */}
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Time"
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* 3. Service Dropdown */}
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Service</InputLabel>
                    <Select
                      value={bookingForm.service}
                      label="Select Service"
                      onChange={(e) => setBookingForm({...bookingForm, service: e.target.value})}
                    >
                      {sel.servicesArray.length > 0 ? (
                        sel.servicesArray.map((s, i) => (
                          <MenuItem key={i} value={s}>{s}</MenuItem>
                        ))
                      ) : (
                        <MenuItem value="General Wash">General Wash</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

            </DialogContent>
            
            <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
              <Button onClick={() => setSel(null)} color="inherit">Cancel</Button>
              <Button 
                variant="contained" 
                onClick={handleBook}
                sx={{ bgcolor: '#3182ce', px: 4 }}
              >
                Confirm Booking
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }} variant="filled">
          {msg}
        </Alert>
      </Snackbar>

    </Box>
  );
}