import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalLaundryService as LaundryIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:4000/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: null, name: '' });
  const [editDialog, setEditDialog] = useState({ open: false, type: '', data: null });
  
  // Search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCenters: 0,
    activeCenters: 0,
    inactiveCenters: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch centers
      const centersRes = await axios.get(`${API_BASE_URL}/centers`);
      const centersData = centersRes.data || [];
      setCenters(centersData);
      
      // Fetch users
      const usersRes = await axios.get(`${API_BASE_URL}/users`);
      const usersData = usersRes.data || [];
      setUsers(usersData);
      
      // Calculate stats
      const activeCenters = centersData.filter(c => c.available).length;
      setStats({
        totalUsers: usersData.length,
        totalCenters: centersData.length,
        activeCenters: activeCenters,
        inactiveCenters: centersData.length - activeCenters,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Delete handlers
  const handleDeleteClick = (type, id, name) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  const handleDeleteConfirm = async () => {
    const { type, id } = deleteDialog;
    try {
      if (type === 'center') {
        await axios.delete(`${API_BASE_URL}/centers/${id}`);
        setCenters(centers.filter(c => c._id !== id));
        showSnackbar('Center deleted successfully');
      } else if (type === 'user') {
        await axios.delete(`${API_BASE_URL}/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
        showSnackbar('User deleted successfully');
      }
      fetchData(); // Refresh stats
    } catch (error) {
      console.error('Error deleting:', error);
      showSnackbar('Failed to delete. Please try again.', 'error');
    }
    setDeleteDialog({ open: false, type: '', id: null, name: '' });
  };

  // Edit handlers
  const handleEditClick = (type, data) => {
    setEditDialog({ open: true, type, data: { ...data } });
  };

  const handleEditSave = async () => {
    const { type, data } = editDialog;
    try {
      if (type === 'center') {
        await axios.put(`${API_BASE_URL}/centers/${data._id}`, data);
        setCenters(centers.map(c => c._id === data._id ? data : c));
        showSnackbar('Center updated successfully');
      } else if (type === 'user') {
        await axios.put(`${API_BASE_URL}/users/${data._id}`, data);
        setUsers(users.map(u => u._id === data._id ? data : u));
        showSnackbar('User updated successfully');
      }
      fetchData();
    } catch (error) {
      console.error('Error updating:', error);
      showSnackbar('Failed to update. Please try again.', 'error');
    }
    setEditDialog({ open: false, type: '', data: null });
  };

  const handleEditChange = (field, value) => {
    setEditDialog(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  // Filter data based on search
  const filteredCenters = centers.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    const centerName = (c.centerName || c.lname || '').toLowerCase();
    const ownerName = (c.ownerName || c.oname || '').toLowerCase();
    const address = (c.address || c.hname || '').toLowerCase();
    return centerName.includes(searchLower) || 
           ownerName.includes(searchLower) || 
           address.includes(searchLower);
  });

  const filteredUsers = users.filter(u => {
    const searchLower = searchTerm.toLowerCase();
    return (u.name || '').toLowerCase().includes(searchLower) ||
           (u.ename || '').toLowerCase().includes(searchLower);
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      {/* App Bar */}
      <AppBar position="sticky" elevation={2} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Container maxWidth="xl">
          <Toolbar>
            <LaundryIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}>
              Washify Admin
            </Typography>
            <Button
              startIcon={<LogoutIcon />}
              onClick={() => {
                sessionStorage.clear();
                navigate('/login');
              }}
              sx={{ color: 'text.secondary' }}
            >
              Logout
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Centers</Typography>
                    <Typography variant="h3" fontWeight="bold">{stats.totalCenters}</Typography>
                  </Box>
                  <BusinessIcon sx={{ fontSize: 48, opacity: 0.15, color: 'rgba(0,0,0,0.3)' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Active Centers</Typography>
                    <Typography variant="h3" fontWeight="bold">{stats.activeCenters}</Typography>
                  </Box>
                  <CheckCircleIcon sx={{ fontSize: 48, opacity: 0.15, color: 'rgba(0,0,0,0.3)' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Inactive Centers</Typography>
                    <Typography variant="h3" fontWeight="bold">{stats.inactiveCenters}</Typography>
                  </Box>
                  <CancelIcon sx={{ fontSize: 48, opacity: 0.15, color: 'rgba(0,0,0,0.3)' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Users</Typography>
                    <Typography variant="h3" fontWeight="bold">{stats.totalUsers}</Typography>
                  </Box>
                  <PersonIcon sx={{ fontSize: 48, opacity: 0.15, color: 'rgba(0,0,0,0.3)' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Paper sx={{ borderRadius: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
                <Tab icon={<BusinessIcon />} label="Manage Centers" iconPosition="start" />
                <Tab icon={<PersonIcon />} label="Manage Users" iconPosition="start" />
              </Tabs>
              
              <TextField
                size="small"
                placeholder={tabValue === 0 ? "Search centers..." : "Search users..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ width: 250 }}
              />
            </Stack>
          </Box>

          {/* Centers Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  All Centers ({filteredCenters.length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/add-center')}
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  Add New Center
                </Button>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Center Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Owner</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Hours</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCenters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No centers found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCenters.map((center) => (
                        <TableRow key={center._id} hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32, fontSize: '0.875rem' }}>
                                {(center.centerName || center.lname || 'C').substring(0, 2).toUpperCase()}
                              </Avatar>
                              <Typography fontWeight="500">{center.centerName || center.lname}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{center.ownerName || center.oname}</TableCell>
                          <TableCell>{center.address || center.hname}</TableCell>
                          <TableCell>
                            {(center.opensAt || center.aname)} - {(center.closesAt || center.iname)}
                          </TableCell>
                          <TableCell>
                            {center.available ? (
                              <Chip icon={<CheckCircleIcon />} label="Available" color="success" size="small" />
                            ) : (
                              <Chip icon={<CancelIcon />} label="Unavailable" color="error" size="small" variant="outlined" />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditClick('center', center)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick('center', center._id, center.centerName || center.lname)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Users Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  All Users ({filteredUsers.length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  Add New User
                </Button>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No users found - User management coming soon</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user._id} hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar sx={{ bgcolor: 'secondary.light', width: 32, height: 32, fontSize: '0.875rem' }}>
                                {(user.name || 'U').substring(0, 2).toUpperCase()}
                              </Avatar>
                              <Typography fontWeight="500">{user.name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{user.ename}</TableCell>
                          <TableCell>
                            <Chip label={user.role || 'user'} size="small" color="primary" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.isActive ? "Active" : "Inactive"} 
                              color={user.isActive ? "success" : "default"} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditClick('user', user)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick('user', user._id, user.name)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', id: null, name: '' })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteDialog.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, type: '', id: null, name: '' })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialog.open} 
        onClose={() => setEditDialog({ open: false, type: '', data: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit {editDialog.type === 'center' ? 'Center' : 'User'}
        </DialogTitle>
        <DialogContent>
          {editDialog.type === 'center' && editDialog.data && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Owner Name"
                value={editDialog.data.ownerName || editDialog.data.oname || ''}
                onChange={(e) => handleEditChange(editDialog.data.ownerName !== undefined ? 'ownerName' : 'oname', e.target.value)}
              />
              <TextField
                fullWidth
                label="Center Name"
                value={editDialog.data.centerName || editDialog.data.lname || ''}
                onChange={(e) => handleEditChange(editDialog.data.centerName !== undefined ? 'centerName' : 'lname', e.target.value)}
              />
              <TextField
                fullWidth
                label="Address"
                value={editDialog.data.address || editDialog.data.hname || ''}
                onChange={(e) => handleEditChange(editDialog.data.address !== undefined ? 'address' : 'hname', e.target.value)}
                multiline
                rows={2}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Opens At"
                  type="time"
                  value={editDialog.data.opensAt || editDialog.data.aname || ''}
                  onChange={(e) => handleEditChange(editDialog.data.opensAt !== undefined ? 'opensAt' : 'aname', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Closes At"
                  type="time"
                  value={editDialog.data.closesAt || editDialog.data.iname || ''}
                  onChange={(e) => handleEditChange(editDialog.data.closesAt !== undefined ? 'closesAt' : 'iname', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editDialog.data.available}
                    onChange={(e) => handleEditChange('available', e.target.checked)}
                  />
                }
                label="Available"
              />
            </Stack>
          )}
          
          {editDialog.type === 'user' && editDialog.data && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={editDialog.data.name || ''}
                onChange={(e) => handleEditChange('name', e.target.value)}
              />
              <TextField
                fullWidth
                label="Email (ename)"
                type="email"
                value={editDialog.data.ename || ''}
                onChange={(e) => handleEditChange('ename', e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editDialog.data.role || 'user'}
                  label="Role"
                  onChange={(e) => handleEditChange('role', e.target.value)}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="owner">Owner</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editDialog.data.isActive !== false}
                    onChange={(e) => handleEditChange('isActive', e.target.checked)}
                  />
                }
                label="Active Status"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, type: '', data: null })}>
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;