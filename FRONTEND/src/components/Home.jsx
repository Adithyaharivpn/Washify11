import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Material UI Components
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Avatar,
  Stack,
  Paper,
  CircularProgress,
  Skeleton,
} from "@mui/material";

// Material UI Icons
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import PhoneIcon from "@mui/icons-material/Phone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Configure your backend URL
const API_BASE_URL = "http://localhost:4000";

export default function Home() {
  const navigate = useNavigate();

  // State
  const [q, setQ] = useState("");
  const [svc, setSvc] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [sel, setSel] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("success");
  
  // Backend data state
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Session Mock
  const userName = typeof window !== "undefined" ? sessionStorage.getItem("userName") : null;
  const role = typeof window !== "undefined" ? sessionStorage.getItem("role") : null;

  // Fetch centers from backend
  const fetchCentres = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/centers`);
      setCentres(response.data);
    } catch (err) {
      console.error("Error fetching centers:", err);
      setError("Failed to load centres. Please try again.");
      showMessage("Failed to load centres", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentres();
  }, []);

  // Transform backend data to match display format
  const transformedCentres = useMemo(() => {
    return centres.map((c) => ({
      id: c._id,
      name: c.lname || "Unnamed Centre",
      ownerName: c.oname,
      address: c.aname || "Address not provided",
      houseName: c.hname,
      gramPanchayat: c.gname,
      street: c.sname,
      image: c.iname,
      rating: Math.random() * 1.5 + 3.5, // Mock rating, add to your schema later
      distanceKm: Math.random() * 5, // Mock distance, calculate based on user location
      services: c.available || [],
      hours: "08:00 - 20:00", // Add to your schema
      phone: "+91 " + Math.floor(Math.random() * 9000000000 + 1000000000), // Add to schema
      notes: "Contact for more details",
      available: c.available,
    }));
  }, [centres]);

  // Derived Data - Extract unique services
  const services = useMemo(() => {
    const s = new Set();
    transformedCentres.forEach((c) => {
      if (Array.isArray(c.services)) {
        c.services.forEach((x) => s.add(x));
      }
    });
    return ["All", ...Array.from(s)];
  }, [transformedCentres]);

  // Filter and sort centres
  const filteredCentres = useMemo(() => {
    const qq = q.trim().toLowerCase();
    let list = transformedCentres.filter((c) => {
      const matchesQ =
        !qq ||
        c.name.toLowerCase().includes(qq) ||
        c.address.toLowerCase().includes(qq) ||
        (c.ownerName && c.ownerName.toLowerCase().includes(qq)) ||
        (Array.isArray(c.services) && c.services.join(" ").toLowerCase().includes(qq));
      
      const matchesSvc = svc === "All" || (Array.isArray(c.services) && c.services.includes(svc));
      return matchesQ && matchesSvc;
    });

    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "distance") list.sort((a, b) => a.distanceKm - b.distanceKm);
    else if (sortBy === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [q, svc, sortBy, transformedCentres]);

  // Handlers
  const showMessage = (message, sev = "success") => {
    setMsg(message);
    setSeverity(sev);
    setSnackbarOpen(true);
  };

  const handleBook = (id) => {
    const c = transformedCentres.find((x) => x.id === id);
    showMessage(`Booking request sent to "${c.name}". They will contact you shortly!`);
    setSel(null);
  };

  const handleCopyAddress = (address) => {
    navigator.clipboard?.writeText(address);
    showMessage("Address copied to clipboard!");
  };

  const handleRefresh = () => {
    fetchCentres();
    showMessage("Refreshing centres list...", "info");
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Grid container spacing={2}>
      {[1, 2, 3].map((i) => (
        <Grid item xs={12} key={i}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={50} height={50} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={100} height={24} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      {/* --- App Bar --- */}
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <LocalLaundryServiceIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1, color: "primary.main", fontSize: 32 }} />
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: "flex", fontWeight: 800, letterSpacing: "-0.5px", color: "primary.main" }}
            >
              Washify
            </Typography>

            <Box sx={{ flexGrow: 0 }}>
              {userName ? (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="body2" sx={{ color: "text.secondary", display: { xs: "none", sm: "block" } }}>
                    Welcome, <strong>{userName}</strong>
                  </Typography>
                  {role && <Chip label={role} size="small" color="primary" variant="outlined" />}
                  <Button variant="text" size="small" onClick={() => {
                    sessionStorage.clear();
                    navigate("/login");
                  }}>
                    Logout
                  </Button>
                </Stack>
              ) : (
                <Button variant="contained" size="small" onClick={() => navigate("/signin")} disableElevation>
                  Sign In
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* --- Hero / Main Content --- */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* LEFT COLUMN: Search & List */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ color: "text.primary" }}>
                Find Laundry Centres Nearby
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Search, compare, and book professional laundry services instantly.
              </Typography>
              
              {!loading && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label={`${transformedCentres.length} Centres Available`} 
                    color="success" 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip label="Real-time Updates" size="small" />
                </Stack>
              )}
            </Box>

            {/* Filters */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <FilterListIcon />
                <Typography variant="h6" fontWeight="bold">Search & Filter</Typography>
              </Stack>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    placeholder="Search by name, location, owner..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    size="small"
                    sx={{ 
                      bgcolor: "white", 
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "transparent" }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControl fullWidth size="small" sx={{ bgcolor: "white", borderRadius: 1 }}>
                    <InputLabel>Service Type</InputLabel>
                    <Select
                      value={svc}
                      label="Service Type"
                      onChange={(e) => setSvc(e.target.value)}
                    >
                      {services.map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControl fullWidth size="small" sx={{ bgcolor: "white", borderRadius: 1 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="recommended">Recommended</MenuItem>
                      <MenuItem value="rating">Highest Rating</MenuItem>
                      <MenuItem value="distance">Nearest</MenuItem>
                      <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {filteredCentres.length} result(s) found
                </Typography>
                <Button
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Box>
            </Paper>

            {/* Error State */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} action={
                <Button color="inherit" size="small" onClick={handleRefresh}>
                  Retry
                </Button>
              }>
                {error}
              </Alert>
            )}

            {/* Loading State */}
            {loading && <LoadingSkeleton />}

            {/* Results Grid */}
            {!loading && (
              <Grid container spacing={2}>
                {filteredCentres.map((c) => (
                  <Grid item xs={12} key={c.id}>
                    <Card 
                      sx={{ 
                        display: "flex", 
                        flexDirection: { xs: "column", sm: "row" }, 
                        borderRadius: 3, 
                        transition: "all 0.3s ease",
                        "&:hover": { 
                          boxShadow: 6,
                          transform: "translateY(-4px)"
                        } 
                      }}
                    >
                      <CardContent sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar 
                              sx={{ 
                                bgcolor: "primary.main", 
                                width: 56, 
                                height: 56, 
                                fontWeight: "bold",
                                fontSize: "1.25rem"
                              }}
                            >
                              {c.name.substring(0, 2).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" component="div" fontWeight="bold">
                                {c.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <LocationOnIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5 }} />
                                {c.address}
                              </Typography>
                              {c.ownerName && (
                                <Typography variant="caption" color="text.secondary">
                                  Owner: {c.ownerName}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                          <Chip
                            icon={<StarIcon sx={{ fontSize: "1rem !important" }} />}
                            label={c.rating.toFixed(1)}
                            color="warning"
                            size="small"
                            sx={{ fontWeight: "bold" }}
                          />
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 0.5 }}>
                          {Array.isArray(c.services) && c.services.length > 0 ? (
                            c.services.map((s) => (
                              <Chip
                                key={s}
                                label={s}
                                size="small"
                                sx={{ bgcolor: "#e0f2fe", color: "#0284c7", fontWeight: 500 }}
                              />
                            ))
                          ) : (
                            <Chip label="Contact for Services" size="small" variant="outlined" />
                          )}
                        </Stack>

                        <Stack direction="row" spacing={3} sx={{ mt: 2, color: "text.secondary", fontSize: "0.875rem" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <LocationOnIcon fontSize="small" color="primary" /> {c.distanceKm.toFixed(1)} km away
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <AccessTimeIcon fontSize="small" color="primary" /> {c.hours}
                          </Box>
                        </Stack>
                      </CardContent>
                      <CardActions
                        sx={{
                          borderLeft: { sm: "1px solid #eee" },
                          p: 2,
                          flexDirection: { xs: "row", sm: "column" },
                          justifyContent: "center",
                          gap: 1,
                          minWidth: { sm: 140 }
                        }}
                      >
                        <Button fullWidth variant="outlined" onClick={() => setSel(c)} sx={{ borderRadius: 2 }}>
                          View Details
                        </Button>
                        <Button 
                          fullWidth 
                          variant="contained" 
                          disableElevation 
                          onClick={() => handleBook(c.id)}
                          sx={{ borderRadius: 2 }}
                        >
                          Book Now
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}

                {filteredCentres.length === 0 && !loading && (
                  <Grid item xs={12}>
                    <Paper sx={{ textAlign: "center", py: 8, borderRadius: 3 }}>
                      <FilterListIcon sx={{ fontSize: 80, opacity: 0.2, color: "text.secondary" }} />
                      <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
                        No centres match your search
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Try adjusting your filters or search terms
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ mt: 3 }}
                        onClick={() => {
                          setQ("");
                          setSvc("All");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>

          {/* RIGHT COLUMN: Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: "sticky", top: 90 }}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  📍 Service Area
                </Typography>
                <Box
                  sx={{
                    bgcolor: "grey.100",
                    height: 200,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.disabled",
                    border: "2px dashed #cbd5e1",
                    backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h20v20H0z\" fill=\"none\"/%3E%3Cpath d=\"M10 0L0 10l10 10 10-10z\" fill=\"%23e2e8f0\" fill-opacity=\"0.4\"/%3E%3C/svg%3E')",
                  }}
                >
                  <Stack alignItems="center" spacing={1}>
                    <LocationOnIcon sx={{ fontSize: 40 }} />
                    <Typography variant="body2">Map Integration</Typography>
                    <Typography variant="caption">Coming Soon</Typography>
                  </Stack>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>📊 Statistics:</strong>
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">Total Centres:</Typography>
                      <Chip label={transformedCentres.length} size="small" color="primary" />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">Showing:</Typography>
                      <Chip label={filteredCentres.length} size="small" />
                    </Box>
                  </Stack>
                </Box>
              </Paper>

              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  ⚡ Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                      setQ("");
                      setSvc("All");
                      setSortBy("recommended");
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    Reset All Filters
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    disableElevation
                    onClick={() => navigate("/add-center")}
                    sx={{ 
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    }}
                  >
                    + List Your Centre
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* --- Footer --- */}
      <Box sx={{ py: 4, textAlign: "center", color: "text.secondary", borderTop: "1px solid #e0e0e0", mt: 6, bgcolor: "white" }}>
        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
          Washify - Professional Laundry Solutions
        </Typography>
        <Typography variant="caption">
          © {new Date().getFullYear()} Washify. All rights reserved.
        </Typography>
      </Box>

      {/* --- Detail Dialog --- */}
      <Dialog open={Boolean(sel)} onClose={() => setSel(null)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
        {sel && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                  {sel.name.substring(0, 2).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">{sel.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{sel.ownerName}</Typography>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    📍 Address
                  </Typography>
                  <Typography variant="body2">{sel.address}</Typography>
                  {sel.houseName && <Typography variant="caption" display="block">House: {sel.houseName}</Typography>}
                  {sel.street && <Typography variant="caption" display="block">Street: {sel.street}</Typography>}
                  {sel.gramPanchayat && <Typography variant="caption" display="block">Panchayat: {sel.gramPanchayat}</Typography>}
                </Paper>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Rating:</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <StarIcon sx={{ color: "warning.main", fontSize: 20 }} />
                    <Typography variant="body1" fontWeight="bold">{sel.rating.toFixed(1)}</Typography>
                    <Typography variant="caption" color="text.secondary">/5.0</Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Services Available:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                    {Array.isArray(sel.services) && sel.services.length > 0 ? (
                      sel.services.map((s) => (
                        <Chip key={s} label={s} size="small" color="primary" variant="outlined" />
                      ))
                    ) : (
                      <Typography variant="caption">Contact for service details</Typography>
                    )}
                  </Stack>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Contact:</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <PhoneIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2">{sel.phone}</Typography>
                  </Stack>
                </Box>

                <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "info.50", borderColor: "info.200" }}>
                  <Typography variant="caption" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                    💡 Note: {sel.notes}
                  </Typography>
                </Paper>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
              <Button onClick={() => handleCopyAddress(sel.address)} variant="outlined" sx={{ borderRadius: 2 }}>
                Copy Address
              </Button>
              <Button variant="contained" onClick={() => handleBook(sel.id)} disableElevation sx={{ borderRadius: 2 }}>
                Confirm Booking
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* --- Snackbar Notification --- */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}