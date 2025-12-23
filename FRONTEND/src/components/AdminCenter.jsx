import React, { useState } from 'react';
import {AppBar,
    Toolbar,
    IconButton,
    Container,
    Paper,
    Typography,
    TextField,
    Box,
    FormControlLabel,
    Switch,
    Button,
    CssBaseline,
    ThemeProvider,
    createTheme,
    Snackbar,
    Alert,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// /E:/washify/EMPLOYEE_APP-main/EMPLOYEE_APP-main/FRONTEND/src/components/AdminCenter.jsx
    
const theme = createTheme({
    palette: {
        primary: { main: '#294494' }, // button background / primary accents
        secondary: { main: '#002289' }, // headings / darker accent
        success: { main: '#28a745' },
    },
    typography: {
        fontFamily: "'Montserrat', sans-serif",
        h4: { fontWeight: 700 },
    },
});

export default function AdminCenter() {
    const [input, setInput] = useState({
        oname: '',
        lname: '',
        hname: '',
        gname: '',
        sname: '',
        aname: '',
        iname: '',
        available: true,
    });
    const [snack, setSnack] = useState({ open: false, severity: 'success', message: '' });

    const inputHandler = (e) => {
        const { name, type, value, checked } = e.target;
        setInput((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const validate = () => {
        if (!input.oname.trim()) return 'Center Name is required';
        if (!input.hname.trim()) return 'Operating Hours is required';
        if (!input.aname.trim() || !input.iname.trim()) return 'Opening and closing times are required';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validate();
        if (error) {
            setSnack({ open: true, severity: 'error', message: error });
            return;
        }

        // Replace below with real API call
        try {
            // Example payload
            const payload = { ...input };
            console.log('Submitting center:', payload);

            // Simulate success
            setSnack({ open: true, severity: 'success', message: 'Center added successfully' });

            // Reset form
            setInput({
                oname: '',
                lname: '',
                hname: '',
                gname: '',
                sname: '',
                aname: '',
                iname: '',
                available: true,
            });
        } catch (err) {
            setSnack({ open: true, severity: 'error', message: 'Failed to add center' });
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" color="primary" elevation={0}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Add Center
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: { xs: 2, md: 4 } }} elevation={3}>
                    <form onSubmit={handleSubmit}>
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 700,
                                color: '#002289ff',
                                mb: 2,
                            }}
                        >
                            <i>Center Details</i>
                        </Typography>

                        <TextField
                            fullWidth
                            label="Center Name"
                            variant="outlined"
                            margin="normal"
                            name="oname"
                            value={input.oname}
                            onChange={inputHandler}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Center Address"
                            variant="outlined"
                            margin="normal"
                            name="lname"
                            value={input.lname}
                            onChange={inputHandler}
                            multiline
                            rows={3}
                        />

                        <TextField
                            fullWidth
                            label="Operating Hours"
                            variant="outlined"
                            margin="normal"
                            name="hname"
                            value={input.hname}
                            onChange={inputHandler}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Services Provide"
                            variant="outlined"
                            margin="normal"
                            name="gname"
                            value={input.gname}
                            onChange={inputHandler}
                            multiline
                            rows={3}
                        />

                        <TextField
                            fullWidth
                            label="Center Description"
                            variant="outlined"
                            margin="normal"
                            name="sname"
                            value={input.sname}
                            onChange={inputHandler}
                            multiline
                            rows={3}
                        />

                        {/* Opens At / to / Closes At arranged side-by-side */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                            <TextField
                                label="Opens At"
                                sx={{ width: { xs: '100%', sm: '30%' } }}
                                variant="outlined"
                                margin="normal"
                                name="aname"
                                value={input.aname}
                                onChange={inputHandler}
                                required
                            />

                            <Typography sx={{ mx: 1, minWidth: 24, textAlign: 'center' }}>to</Typography>

                            <TextField
                                label="Closes At"
                                sx={{ width: { xs: '100%', sm: '30%' } }}
                                variant="outlined"
                                margin="normal"
                                name="iname"
                                value={input.iname}
                                onChange={inputHandler}
                                required
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        color="success"
                                        name="available"
                                        checked={input.available}
                                        onChange={inputHandler}
                                    />
                                }
                                label="Available"
                                sx={{ mt: 2, color: '#424242' }}
                            />
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{
                                    backgroundColor: '#294494ff',
                                    color: 'white',
                                    '&:hover': { backgroundColor: '#190e90ff' },
                                }}
                            >
                                <b>Finish Sign Up</b>
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>

            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={() => setSnack((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnack((s) => ({ ...s, open: false }))}
                    severity={snack.severity}
                    sx={{ width: '100%' }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}