
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Tab,
  Tabs,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalGroups: number;
  pendingApprovals: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  createdAt: string;
  lastLogin: string;
  group: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalGroups: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchAdminStats();
    fetchUsers();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleUserAction = async (action: string, userId: number) => {
    try {
      await api.post(`/admin/users/${userId}/${action}`);
      fetchUsers(); // Refresh users list
      handleMenuClose();
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'pending':
        return 'warning';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon fontSize="small" />;
      case 'pending':
        return <WarningIcon fontSize="small" />;
      case 'blocked':
        return <BlockIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Check if user has admin permissions
  if (user?.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="error" textAlign="center">
          Access Denied
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mt: 2 }}>
          You don't have permission to access this page.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalUsers.toLocaleString()}
                  </Typography>
                </Box>
                <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Users
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.activeUsers.toLocaleString()}
                  </Typography>
                </Box>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Groups
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalGroups.toLocaleString()}
                  </Typography>
                </Box>
                <GroupIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Approvals
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.pendingApprovals}
                  </Typography>
                </Box>
                <WarningIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
          <Tab label="Users" icon={<PeopleIcon />} />
          <Tab label="Groups" icon={<GroupIcon />} />
          <Tab label="Analytics" icon={<AnalyticsIcon />} />
          <Tab label="Settings" icon={<SettingsIcon />} />
        </Tabs>
      </Paper>

      {/* Users Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardHeader
            title="User Management"
            subheader="Manage all registered users"
            action={
              <Button variant="contained" startIcon={<AddIcon />}>
                Add User
              </Button>
            }
          />
          <CardContent>
            {loading ? (
              <LinearProgress />
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Group</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Login</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar>{user.name.charAt(0)}</Avatar>
                            <Box>
                              <Typography variant="subtitle2">{user.name}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                ID: {user.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{user.email}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.phone}
                          </Typography>
                        </TableCell>
                        <TableCell>{user.group}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.status}
                            color={getStatusColor(user.status) as any}
                            icon={getStatusIcon(user.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={(e) => handleMenuClick(e, user)}>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* Groups Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Group Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Group management features will be implemented here.
        </Typography>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Analytics & Reports
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Analytics dashboard with charts and reports will be implemented here.
        </Typography>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>
          System Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          System configuration and settings will be implemented here.
        </Typography>
      </TabPanel>

      {/* User Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => setEditDialogOpen(true)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={() => selectedUser && handleUserAction('activate', selectedUser.id)}>
          <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
          Activate
        </MenuItem>
        <MenuItem onClick={() => selectedUser && handleUserAction('block', selectedUser.id)}>
          <BlockIcon fontSize="small" sx={{ mr: 1 }} />
          Block User
        </MenuItem>
        <MenuItem onClick={() => selectedUser && handleUserAction('delete', selectedUser.id)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={selectedUser?.name || ''}
                onChange={() => {}}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={selectedUser?.email || ''}
                onChange={() => {}}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={selectedUser?.phone || ''}
                onChange={() => {}}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedUser?.status || ''}
                  label="Status"
                  onChange={() => {}}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;
