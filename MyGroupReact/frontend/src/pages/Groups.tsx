
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, Add, Group as GroupIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { groupsAPI } from '../services/api';
import { Group } from '../types';

const Groups: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: groupsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['groups', page, debouncedSearch],
    queryFn: () => groupsAPI.getAllGroups(page, 12, debouncedSearch),
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          Failed to load groups. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            Groups
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/groups/create"
          >
            Create Group
          </Button>
        </Box>

        {/* Search */}
        <Box mb={4}>
          <TextField
            fullWidth
            placeholder="Search groups..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Loading */}
        {isLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Groups Grid */}
        {groupsData && (
          <>
            <Grid container spacing={3}>
              {groupsData.groups.map((group: Group) => (
                <Grid item xs={12} sm={6} md={4} key={group.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <GroupIcon color="primary" />
                        <Typography variant="h6" component="h3" noWrap>
                          {group.group_name}
                        </Typography>
                      </Box>
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2,
                        }}
                      >
                        {group.group_description || 'No description available.'}
                      </Typography>

                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                          label={group.privacy_type}
                          size="small"
                          color={group.privacy_type === 'public' ? 'success' : 'default'}
                        />
                        <Chip label="Active" size="small" color="primary" />
                      </Box>

                      {group.creator && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Created by: {group.creator.username}
                        </Typography>
                      )}
                    </CardContent>
                    
                    <CardActions>
                      <Button
                        size="small"
                        component={Link}
                        to={`/groups/${group.id}`}
                      >
                        View Details
                      </Button>
                      {group.privacy_type === 'public' && (
                        <Button size="small" color="primary">
                          Join Group
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* No results */}
            {groupsData.groups.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary">
                  {debouncedSearch ? 'No groups found matching your search.' : 'No groups available yet.'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  component={Link}
                  to="/groups/create"
                  sx={{ mt: 2 }}
                >
                  Be the first to create a group
                </Button>
              </Box>
            )}

            {/* Pagination */}
            {groupsData.totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={groupsData.totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Groups;
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Skeleton
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface Group {
  id: number;
  group_name: string;
  group_description: string;
  group_category: string;
  group_type: 'public' | 'private';
  group_logo: string;
  created_by: number;
  member_count: number;
  created_at: string;
  is_member: boolean;
  is_admin: boolean;
}

const Groups: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newGroup, setNewGroup] = useState({
    group_name: '',
    group_description: '',
    group_category: '',
    group_type: 'public' as 'public' | 'private'
  });

  const groupCategories = [
    'Education',
    'Technology',
    'Business',
    'Social',
    'Health',
    'Sports',
    'Arts',
    'Music',
    'Travel',
    'Food',
    'Other'
  ];

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const response = await api.post('/groups', newGroup);
      setGroups([response.data, ...groups]);
      setCreateDialogOpen(false);
      setNewGroup({
        group_name: '',
        group_description: '',
        group_category: '',
        group_type: 'public'
      });
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    try {
      await api.post(`/groups/${groupId}/join`);
      setGroups(groups.map(group => 
        group.id === groupId 
          ? { ...group, is_member: true, member_count: group.member_count + 1 }
          : group
      ));
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  const handleLeaveGroup = async (groupId: number) => {
    try {
      await api.post(`/groups/${groupId}/leave`);
      setGroups(groups.map(group => 
        group.id === groupId 
          ? { ...group, is_member: false, member_count: group.member_count - 1 }
          : group
      ));
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, group: Group) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  const renderGroupCard = (group: Group) => (
    <Card key={group.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={group.group_logo || '/assets/default-group.png'}
        alt={group.group_name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="h2" gutterBottom>
            {group.group_name}
          </Typography>
          <IconButton 
            size="small" 
            onClick={(e) => handleMenuClick(e, group)}
            disabled={!group.is_member && !group.is_admin}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          {group.group_description}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mt={2}>
          <Chip 
            label={group.group_category} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            icon={group.group_type === 'public' ? <PublicIcon /> : <PrivateIcon />}
            label={group.group_type}
            size="small"
            color={group.group_type === 'public' ? 'success' : 'warning'}
            variant="outlined"
          />
        </Box>

        <Box display="flex" alignItems="center" mt={2}>
          <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
            <PeopleIcon sx={{ fontSize: 16 }} />
          </Avatar>
          <Typography variant="body2" color="textSecondary">
            {group.member_count} members
          </Typography>
        </Box>
      </CardContent>

      <CardActions>
        {!group.is_member ? (
          <Button 
            size="small" 
            variant="contained" 
            onClick={() => handleJoinGroup(group.id)}
            fullWidth
          >
            Join Group
          </Button>
        ) : (
          <Box display="flex" gap={1} width="100%">
            <Button 
              size="small" 
              variant="outlined"
              href={`/groups/${group.id}`}
              sx={{ flex: 1 }}
            >
              View
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              color="error"
              onClick={() => handleLeaveGroup(group.id)}
              sx={{ flex: 1 }}
            >
              Leave
            </Button>
          </Box>
        )}
      </CardActions>
    </Card>
  );

  const renderSkeletonCard = () => (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={140} />
      <CardContent>
        <Skeleton variant="text" height={32} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} width="60%" />
        <Box display="flex" gap={1} mt={2}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={60} height={24} />
        </Box>
      </CardContent>
      <CardActions>
        <Skeleton variant="rounded" width="100%" height={36} />
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          My Groups
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          size="large"
        >
          Create Group
        </Button>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              {renderSkeletonCard()}
            </Grid>
          ))
        ) : groups.length > 0 ? (
          groups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              {renderGroupCard(group)}
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No groups found
              </Typography>
              <Typography variant="body1" color="textSecondary" mb={3}>
                Create your first group to start building your community!
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
                size="large"
              >
                Create Group
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Create Group Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Group Name"
              value={newGroup.group_name}
              onChange={(e) => setNewGroup({ ...newGroup, group_name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={newGroup.group_description}
              onChange={(e) => setNewGroup({ ...newGroup, group_description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={newGroup.group_category}
                onChange={(e) => setNewGroup({ ...newGroup, group_category: e.target.value })}
                label="Category"
                required
              >
                {groupCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Privacy</InputLabel>
              <Select
                value={newGroup.group_type}
                onChange={(e) => setNewGroup({ ...newGroup, group_type: e.target.value as 'public' | 'private' })}
                label="Privacy"
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateGroup}
            variant="contained"
            disabled={!newGroup.group_name || !newGroup.group_description || !newGroup.group_category}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>

      {/* Group Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedGroup?.is_admin && (
          <>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Group</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Group Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Delete Group</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default Groups;
