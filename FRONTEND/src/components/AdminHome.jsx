import React, { useEffect, useState } from "react";
import {Box,
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
import { Edit, Logout, People, PostAdd, ShoppingCart } from "@mui/icons-material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";




/**
 * AdminHome - Admin dashboard / center management page
 * - Owner (Admin) Information
 * - Center Details
 * - Time Details (Opens At / Closes At / Availability)
 * - Welcome message "Welcome, [Owner Name]"
 * - Summary cards: Total Orders, Active Orders, Completed Orders, Total Earnings
 * - Navigation buttons: Add New Center, Manage Orders, View Customers, Edit Center Info, Log Out
 *
 * This file is intended to replace /src/components/AdminHome.jsx
 */

const AdminHome = () => {
const baseurl = import.meta.env.VITE_API_BASE_URL;
const navigate = useNavigate();
const location = useLocation();

// If a center object is passed via navigation state, use it to prefill the form
const passedCenter = (location && location.state && location.state.pro) || null;

const [owner, setOwner] = useState({
    name: passedCenter?.ownerName || "",
    contact: passedCenter?.contact || "",
    email: passedCenter?.email || "",
});

const [center, setCenter] = useState({
    name: passedCenter?.centerName || "",
    address: passedCenter?.address || "",
    services: passedCenter?.services || "",
    description: passedCenter?.description || "",
    opensAt: passedCenter?.opensAt || "09:00",
    closesAt: passedCenter?.closesAt || "18:00",
    available: passedCenter?.available ?? true,
    _id: passedCenter?._id || null,
});

const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalEarnings: 0,
});

// Load statistics and (optionally) fresh center data
useEffect(() => {
    // fetch stats (best-effort; endpoints may differ on your backend)
    const fetchStats = async () => {
        try {
            const resp = await axios.get(`${baseurl}/admin/stats`);
            if (resp?.data) {
                setStats({
                    totalOrders: resp.data.totalOrders ?? 0,
                    activeOrders: resp.data.activeOrders ?? 0,
                    completedOrders: resp.data.completedOrders ?? 0,
                    totalEarnings: resp.data.totalEarnings ?? 0,
                });
            }
        } catch (err) {
            // ignore errors; keep defaults
            console.warn("Could not fetch stats", err);
        }
    };

    // fetch center info if we have an id and want the latest
    const fetchCenter = async () => {
        if (center._id) {
            try {
                const resp = await axios.get(`${baseurl}/centers/${center._id}`);
                if (resp?.data) {
                    const c = resp.data;
                    setCenter((prev) => ({
                        ...prev,
                        name: c.centerName ?? prev.name,
                        address: c.address ?? prev.address,
                        services: c.services ?? prev.services,
                        description: c.description ?? prev.description,
                        opensAt: c.opensAt ?? prev.opensAt,
                        closesAt: c.closesAt ?? prev.closesAt,
                        available: c.available ?? prev.available,
                    }));
                    setOwner((prev) => ({
                        ...prev,
                        name: c.ownerName ?? prev.name,
                        contact: c.contact ?? prev.contact,
                        email: c.email ?? prev.email,
                    }));
                }
            } catch (err) {
                console.warn("Could not fetch center", err);
            }
        }
    };

    fetchStats();
    fetchCenter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [baseurl]);

const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwner((p) => ({ ...p, [name]: value }));
};

const handleCenterChange = (e) => {
    const { name, value } = e.target;
    setCenter((p) => ({ ...p, [name]: value }));
};

const toggleAvailability = async (e) => {
    const newVal = e.target.checked;
    setCenter((p) => ({ ...p, available: newVal }));
    // persist change
    if (center._id) {
        try {
            await axios.put(`${baseurl}/centers/${center._id}/availability`, {
                available: newVal,
            });
        } catch (err) {
            console.warn("Failed to update availability", err);
        }
    }
};

const saveCenter = async () => {
    // Instead of saving center here, show signup info and offer an edit option.
    const infoLines = [
        `Owner Name: ${owner.name || "<not set>"}`,
        `Contact: ${owner.contact || "<not set>"}`,
        `Email: ${owner.email || "<not set>"}`,
        ``,
        `Center Name: ${center.name || "<not set>"}`,
        `Address: ${center.address || "<not set>"}`,
        `Services: ${center.services || "<not set>"}`,
        `Opens At: ${center.opensAt}`,
        `Closes At: ${center.closesAt}`,
        `Available: ${center.available ? "Yes" : "No"}`,
        ``,
        `Press OK to proceed to Signup (passes this info).`,
        `Press Cancel to edit the center information.`,
    ];
    const message = infoLines.join("\n");

    const proceedToSignup = window.confirm(message);

    if (proceedToSignup) {
        // navigate to a signup page and pass the current info in state
        navigate("/signup", { state: { owner, center } });
    } else {
        // navigate to edit-center screen so user can update details
        navigate("/edit-center", { state: { pro: center } });
    }
};

const onLogout = () => {
    // clear any auth tokens and navigate to login
    localStorage.removeItem("token");
    navigate("/login");
};

return (

       <div className="home-page">



            <header className="home-header">
                <div className="brand"><div className="logo-box"><div className="gradient-text"><i>W</i></div></div><div className="brand-text"><div className="brand-title">Washify</div><div className="brand-sub">Connect · Book · Track</div></div></div>
                </header>




    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Welcome, {owner.name || "Owner"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage your center and view performance at a glance
                </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                    startIcon={<PostAdd />}
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/add-center"
                    sx={{ textTransform: "none" }}
                >
                    Add New Center
                </Button>

                <IconButton color="inherit" onClick={onLogout} title="Log Out">
                    <Logout />
                </IconButton>
            </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Total Orders
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {stats.totalOrders}
                    </Typography>
                </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Active Orders
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {stats.activeOrders}
                    </Typography>
                </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Completed Orders
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {stats.completedOrders}
                    </Typography>
                </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Total Earnings
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        ₹{stats.totalEarnings}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>

        <Grid container spacing={3}>
            {/* Left: Owner & Center form */}
            <Grid item xs={12} md={7}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Typography variant="h6">Owner (Admin) Information</Typography>
                            <Button
                                size="small"
                                startIcon={<Edit />}
                                component={RouterLink}
                                to="/edit-owner"
                                state={{ owner }}
                            >
                                Edit
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Owner Name"
                                    fullWidth
                                    name="name"
                                    value={owner.name}
                                    onChange={handleOwnerChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Contact"
                                    fullWidth
                                    name="contact"
                                    value={owner.contact}
                                    onChange={handleOwnerChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    name="email"
                                    value={owner.email}
                                    onChange={handleOwnerChange}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ height: 16 }} />

                        <Typography variant="h6" sx={{ mt: 1 }}>
                            Center Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Center Name"
                                    fullWidth
                                    name="name"
                                    value={center.name}
                                    onChange={handleCenterChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Address"
                                    fullWidth
                                    name="address"
                                    multiline
                                    rows={2}
                                    value={center.address}
                                    onChange={handleCenterChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Services Provided"
                                    fullWidth
                                    name="services"
                                    multiline
                                    rows={2}
                                    value={center.services}
                                    onChange={handleCenterChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Center Description"
                                    fullWidth
                                    name="description"
                                    multiline
                                    rows={2}
                                    value={center.description}
                                    onChange={handleCenterChange}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ height: 16 }} />

                        <Typography variant="h6" sx={{ mt: 1 }}>
                            Time Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Opens At"
                                    fullWidth
                                    type="time"
                                    name="opensAt"
                                    value={center.opensAt}
                                    onChange={handleCenterChange}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ step: 300 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Closes At"
                                    fullWidth
                                    type="time"
                                    name="closesAt"
                                    value={center.closesAt}
                                    onChange={handleCenterChange}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ step: 300 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Switch checked={!!center.available} onChange={toggleAvailability} color="success" />
                                <Typography>{center.available ? "Available" : "Not Available"}</Typography>
                            </Grid>
                        </Grid>

                        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
                            <Button variant="outlined" onClick={() => navigate("/manage-orders")} startIcon={<ShoppingCart />}>
                                Manage Orders
                            </Button>
                            <Button variant="contained" onClick={saveCenter}>
                                Save Center
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Right: Quick navigation and customers summary */}
            <Grid item xs={12} md={5}>
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Quick Actions</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Button component={RouterLink} to="/add-center" startIcon={<PostAdd />}>
                                Add New Center
                            </Button>
                            <Button component={RouterLink} to="/manage-orders" startIcon={<ShoppingCart />}>
                                Manage Orders
                            </Button>
                            <Button component={RouterLink} to="/customers" startIcon={<People />}>
                                View Customers
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/edit-center"
                                state={{ pro: center }}
                                startIcon={<Edit />}
                            >
                                Edit Center Info
                            </Button>
                            <Button color="error" onClick={onLogout} startIcon={<Logout />}>
                                Log Out
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6">Status Summary</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                            Center: <b>{center.name || "Not set"}</b>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Opens: <b>{center.opensAt}</b> — Closes: <b>{center.closesAt}</b>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Availability: <b>{center.available ? "Available" : "Not Available"}</b>
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Contact</Typography>
                            <Typography variant="body2">{owner.name}</Typography>
                            <Typography variant="body2">{owner.contact}</Typography>
                            <Typography variant="body2">{owner.email}</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </Box>
    </div>
);
};

export default AdminHome;