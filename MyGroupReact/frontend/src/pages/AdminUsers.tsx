
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  active: boolean;
  created_on: string;
  last_login: string;
  profile?: {
    profession: string;
    city: string;
    state: string;
    country: string;
  };
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');

  const { data: usersData, loading, error, refetch } = useApi('/admin/users');

  useEffect(() => {
    if (usersData) {
      setUsers(usersData.users || []);
    }
  }, [usersData]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.active : !user.active
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleOpenDialog = (mode: 'view' | 'edit' | 'create', user?: User) => {
    setDialogMode(mode);
    setSelectedUser(user || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ active: !currentStatus })
      });
      refetch();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const getStatusChip = (active: boolean) => (
    <Chip
      label={active ? 'Active' : 'Inactive'}
      color={active ? 'success' : 'error'}
      size="small"
    />
  );

  const getRoleChip = (role: string) => {
    const colors: { [key: string]: 'primary' | 'secondary' | 'warning' | 'info' } = {
      admin: 'primary',
      user: 'secondary',
      moderator: 'warning',
      client: 'info'
    };
    
    return (
      <Chip
        label={role.charAt(0).toUpperCase() + role.slice(1)}
        color={colors[role] || 'default'}
        size="small"
      />
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search Users"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 250 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="moderator">Moderator</MenuItem>
                <MenuItem value="client">Client</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('create')}
            >
              Add User
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Registered</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell>{getStatusChip(user.active)}</TableCell>
                    <TableCell>
                      {new Date(user.created_on).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.last_login 
                        ? new Date(user.last_login).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog('view', user)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog('edit', user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.active ? 'Block User' : 'Activate User'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleUserStatus(user.id, user.active)}
                        >
                          {user.active ? <BlockIcon /> : <CheckCircleIcon />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* User Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' && 'Create New User'}
          {dialogMode === 'edit' && 'Edit User'}
          {dialogMode === 'view' && 'User Details'}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedUser.first_name} {selectedUser.last_name}
              </Typography>
              <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedUser.phone || 'Not provided'}</Typography>
              <Typography><strong>Role:</strong> {selectedUser.role}</Typography>
              <Typography><strong>Status:</strong> {selectedUser.active ? 'Active' : 'Inactive'}</Typography>
              <Typography><strong>Registered:</strong> {new Date(selectedUser.created_on).toLocaleString()}</Typography>
              
              {selectedUser.profile && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Profile Information</Typography>
                  <Typography><strong>Profession:</strong> {selectedUser.profile.profession}</Typography>
                  <Typography><strong>Location:</strong> {selectedUser.profile.city}, {selectedUser.profile.state}, {selectedUser.profile.country}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogMode !== 'view' && (
            <Button variant="contained" onClick={handleCloseDialog}>
              {dialogMode === 'create' ? 'Create' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;
