import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Stack,
  alpha,
  Grid,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";

// Color Constants
const ADMIN_COLOR = "#3182ce"; // Blue
const USER_COLOR = "#38a169"; // Green

function Face() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (role) => setSelected(role);

  // Reusable Card Component function
  const renderSelectionCard = (
    role,
    title,
    description,
    icon,
    color,
    linkTo,
    btnText
  ) => {
    const isSelected = selected === role;
    const isOtherSelected = selected && selected !== role;

    return (
      <Grid size={{ xs: 12, md: 5 }}>
        <Card
          onClick={() => handleSelect(role)}
          variant="outlined"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.3s ease",
            borderColor: isSelected ? color : "rgba(0, 0, 0, 0.08)",
            backgroundColor: "background.paper",
            opacity: isOtherSelected ? 0.5 : 1,
            transform: isSelected ? "scale(1.02)" : "scale(1)",
            boxShadow: isSelected
              ? `0 8px 24px ${alpha(color, 0.2)}`
              : "0 2px 8px rgba(0,0,0,0.05)",
            "&:hover": {
              borderColor: color,
              boxShadow: `0 8px 20px ${alpha(color, 0.15)}`,
            },
          }}
        >
          <CardContent sx={{ flexGrow: 1, p: 4, textAlign: "center" }}>
            {/* Icon Circle */}
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: alpha(color, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              {icon}
            </Box>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {description}
            </Typography>
          </CardContent>

          <CardActions sx={{ p: 3, pt: 0, justifyContent: "center" }}>
            <Button
              component={RouterLink}
              to={linkTo}
              variant={isSelected ? "contained" : "outlined"}
              fullWidth
              disabled={isOtherSelected}
              sx={{
                py: 1.2,
                fontWeight: "bold",
                backgroundColor: isSelected ? color : "transparent",
                color: isSelected ? "#fff" : color,
                borderColor: color,
                "&:hover": {
                  backgroundColor: isSelected
                    ? alpha(color, 0.9)
                    : alpha(color, 0.1),
                  borderColor: color,
                },
              }}
            >
              {btnText}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header / Navbar */}
        <Box component="header">
          {/* Logo Section */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box></Box>
          </Stack>
        </Box>

        {/* Main Content */}
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Create an account
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Choose your role to get started with Washify
            </Typography>
          </Box>

          {/* Grid v2 Layout */}
          <Grid container spacing={4} justifyContent="center">
            {/* Admin Card */}
            {renderSelectionCard(
              "admin",
              "Admin Signup",
              "Register as an administrator to manage washing centers, monitor bookings, and oversee the system.",
              <AdminPanelSettingsIcon
                sx={{ fontSize: 32, color: ADMIN_COLOR }}
              />,
              ADMIN_COLOR,
              "/admin/login", // Changed to standard admin login route
              "Sign up as Admin"
            )}

            {/* User Card */}
            {renderSelectionCard(
              "user",
              "User Signup",
              "Create a user account to find nearby washing centers, request services, and track your history.",
              <PersonIcon sx={{ fontSize: 32, color: USER_COLOR }} />,
              USER_COLOR,
              "/signup", // Changed to standard user signup route
              "Sign up as User"
            )}
          </Grid>
        </Container>
      </Container>
    </Box>
  );
}

export default Face;
