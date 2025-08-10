
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Group as GroupIcon,
  Person,
  Lock,
  Public,
  CalendarToday,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { groupsAPI } from '../services/api';

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/groups" replace />;
  }

  const {
    data: group,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['group', id],
    queryFn: () => groupsAPI.getGroupById(parseInt(id)),
  });

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          Failed to load group details. Please try again later.
        </Alert>
      </Container>
    );
  }

  if (!group) {
    return (
      <Container maxWidth="lg">
        <Alert severity="info" sx={{ mt: 4 }}>
          Group not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Main Group Info */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                    <GroupIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      {group.group_name}
                    </Typography>
                    <Box display="flex" gap={1} alignItems="center">
                      <Chip
                        icon={group.privacy_type === 'public' ? <Public /> : <Lock />}
                        label={group.privacy_type}
                        size="small"
                        color={group.privacy_type === 'public' ? 'success' : 'default'}
                      />
                      <Chip
                        label={group.status}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    disabled={group.privacy_type === 'private'}
                  >
                    {group.privacy_type === 'public' ? 'Join Group' : 'Private Group'}
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  About this Group
                </Typography>
                <Typography variant="body1" paragraph>
                  {group.group_description || 'No description provided for this group.'}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Created
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday fontSize="small" />
                      <Typography variant="body2">
                        {new Date(group.created_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday fontSize="small" />
                      <Typography variant="body2">
                        {new Date(group.updated_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Creator Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Group Creator
                </Typography>
                {group.creator ? (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {group.creator.first_name && group.creator.last_name
                          ? `${group.creator.first_name} ${group.creator.last_name}`
                          : group.creator.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{group.creator.username}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Creator information not available
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Group Stats */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Group Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="primary" align="center">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Members
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="secondary" align="center">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Posts
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Button variant="outlined" fullWidth disabled>
                    View Members
                  </Button>
                  <Button variant="outlined" fullWidth disabled>
                    Group Posts
                  </Button>
                  <Button variant="outlined" fullWidth disabled>
                    Group Events
                  </Button>
                  <Button variant="outlined" fullWidth disabled>
                    Share Group
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default GroupDetail;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Paper,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { api } from '../services/api';

interface Group {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  memberCount: number;
  createdDate: string;
  image: string;
  admin: {
    name: string;
    avatar: string;
  };
  isJoined: boolean;
  isFavorite: boolean;
}

interface Member {
  id: number;
  name: string;
  avatar: string;
  role: string;
  joinedDate: string;
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
      id={`group-tabpanel-${index}`}
      aria-labelledby={`group-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchGroupDetails(parseInt(id));
      fetchGroupMembers(parseInt(id));
    }
  }, [id]);

  const fetchGroupDetails = async (groupId: number) => {
    try {
      const response = await api.get(`/groups/${groupId}`);
      setGroup(response.data);
    } catch (error) {
      console.error('Failed to fetch group details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMembers = async (groupId: number) => {
    try {
      const response = await api.get(`/groups/${groupId}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch group members:', error);
    }
  };

  const handleJoinGroup = async () => {
    if (!group) return;
    
    try {
      await api.post(`/groups/${group.id}/join`);
      setGroup({ ...group, isJoined: true, memberCount: group.memberCount + 1 });
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  const handleLeaveGroup = async () => {
    if (!group) return;
    
    try {
      await api.post(`/groups/${group.id}/leave`);
      setGroup({ ...group, isJoined: false, memberCount: group.memberCount - 1 });
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!group) return;
    
    try {
      await api.post(`/groups/${group.id}/favorite`);
      setGroup({ ...group, isFavorite: !group.isFavorite });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!group) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" color="error">
          Group not found
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/groups')}>
          Back to Groups
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/groups')}
          sx={{ mb: 2 }}
        >
          Back to Groups
        </Button>
      </Box>

      {/* Group Header Card */}
      <Card sx={{ mb: 3 }}>
        <CardMedia
          component="img"
          height="300"
          image={group.image || '/placeholder-group.jpg'}
          alt={group.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom>
                {group.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {group.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Chip
                  icon={<PeopleIcon />}
                  label={`${group.memberCount} members`}
                  variant="outlined"
                />
                <Chip
                  icon={<LocationIcon />}
                  label={group.location}
                  variant="outlined"
                />
                <Chip
                  icon={<CalendarIcon />}
                  label={`Created ${new Date(group.createdDate).toLocaleDateString()}`}
                  variant="outlined"
                />
                <Chip
                  label={group.category}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={group.admin.avatar} sx={{ width: 32, height: 32 }}>
                  {group.admin.name.charAt(0)}
                </Avatar>
                <Typography variant="body2" color="textSecondary">
                  Admin: {group.admin.name}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {group.isJoined ? (
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleLeaveGroup}
                  >
                    Leave Group
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleJoinGroup}
                  >
                    Join Group
                  </Button>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={handleToggleFavorite} color="primary">
                    {group.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <IconButton color="primary">
                    <ShareIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="group tabs">
          <Tab label="About" />
          <Tab label="Members" />
          <Tab label="Posts" />
          <Tab label="Events" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              About {group.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {group.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="textSecondary">
              Category: {group.category}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Location: {group.location}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Created: {new Date(group.createdDate).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Members ({members.length})
            </Typography>
            <List>
              {members.map((member) => (
                <ListItem key={member.id}>
                  <ListItemAvatar>
                    <Avatar src={member.avatar}>
                      {member.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    secondary={`${member.role} • Joined ${new Date(member.joinedDate).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Group Posts
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Posts feature coming soon...
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Group Events
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Events feature coming soon...
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>
    </Container>
  );
};

export default GroupDetail;
