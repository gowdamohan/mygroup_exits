
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
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
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

interface Group {
  id: number;
  group_name: string;
  group_description: string;
  group_category: string;
  group_type: string;
  member_count: number;
  created_by: number;
  creator_name: string;
  country: string;
  state: string;
  district: string;
  status: string;
  created_date: string;
  group_logo?: string;
}

const AdminGroups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');

  const { data: groupsData, loading, error, refetch } = useApi('/admin/groups');

  useEffect(() => {
    if (groupsData) {
      setGroups(groupsData.groups || []);
    }
  }, [groupsData]);

  useEffect(() => {
    let filtered = groups;

    if (searchTerm) {
      filtered = filtered.filter(group =>
        group.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.group_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.creator_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(group => group.group_category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(group => group.status === statusFilter);
    }

    setFilteredGroups(filtered);
  }, [groups, searchTerm, categoryFilter, statusFilter]);

  const handleOpenDialog = (mode: 'view' | 'edit' | 'create', group?: Group) => {
    setDialogMode(mode);
    setSelectedGroup(group || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedGroup(null);
  };

  const getStatusChip = (status: string) => {
    const colors: { [key: string]: 'success' | 'warning' | 'error' | 'info' } = {
      active: 'success',
      pending: 'warning',
      suspended: 'error',
      archived: 'info'
    };
    
    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={colors[status] || 'default'}
        size="small"
      />
    );
  };

  const getCategoryChip = (category: string) => {
    const colors: { [key: string]: 'primary' | 'secondary' | 'warning' | 'info' } = {
      'Business': 'primary',
      'Social': 'secondary',
      'Educational': 'info',
      'Religious': 'warning',
      'Sports': 'success'
    };
    
    return (
      <Chip
        label={category}
        color={colors[category] || 'default'}
        size="small"
      />
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Group Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{groups.length}</Typography>
                  <Typography color="textSecondary">Total Groups</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {groups.filter(g => g.status === 'active').length}
                  </Typography>
                  <Typography color="textSecondary">Active Groups</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {groups.filter(g => g.status === 'pending').length}
                  </Typography>
                  <Typography color="textSecondary">Pending Approval</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {groups.reduce((sum, g) => sum + g.member_count, 0)}
                  </Typography>
                  <Typography color="textSecondary">Total Members</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search Groups"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 250 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Social">Social</MenuItem>
                <MenuItem value="Educational">Educational</MenuItem>
                <MenuItem value="Religious">Religious</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
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
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('create')}
            >
              Create Group
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Group</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Creator</TableCell>
                  <TableCell>Members</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={group.group_logo}
                          sx={{ mr: 2, width: 40, height: 40 }}
                        >
                          <GroupIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{group.group_name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {group.group_description.substring(0, 50)}...
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{getCategoryChip(group.group_category)}</TableCell>
                    <TableCell>{group.creator_name}</TableCell>
                    <TableCell>{group.member_count}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {group.district}, {group.state}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {group.country}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(group.status)}</TableCell>
                    <TableCell>
                      {new Date(group.created_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog('view', group)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Group">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog('edit', group)}
                        >
                          <EditIcon />
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

      {/* Group Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' && 'Create New Group'}
          {dialogMode === 'edit' && 'Edit Group'}
          {dialogMode === 'view' && 'Group Details'}
        </DialogTitle>
        <DialogContent>
          {selectedGroup && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    {selectedGroup.group_name}
                  </Typography>
                  <Typography paragraph>{selectedGroup.group_description}</Typography>
                  <Typography><strong>Category:</strong> {selectedGroup.group_category}</Typography>
                  <Typography><strong>Type:</strong> {selectedGroup.group_type}</Typography>
                  <Typography><strong>Creator:</strong> {selectedGroup.creator_name}</Typography>
                  <Typography><strong>Members:</strong> {selectedGroup.member_count}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Location & Status</Typography>
                  <Typography><strong>Country:</strong> {selectedGroup.country}</Typography>
                  <Typography><strong>State:</strong> {selectedGroup.state}</Typography>
                  <Typography><strong>District:</strong> {selectedGroup.district}</Typography>
                  <Typography><strong>Status:</strong> {selectedGroup.status}</Typography>
                  <Typography><strong>Created:</strong> {new Date(selectedGroup.created_date).toLocaleString()}</Typography>
                </Grid>
              </Grid>
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

export default AdminGroups;
