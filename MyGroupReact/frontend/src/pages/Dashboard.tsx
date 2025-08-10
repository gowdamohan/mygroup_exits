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
  Avatar,
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
  Badge
} from '@mui/material';
import {
  Groups as GroupsIcon,
  Store as StoreIcon,
  Tv as TvIcon,
  HelpOutline as NeedyIcon,
  Work as LaborIcon,
  AccountBalance as BankIcon,
  Chat as ChatIcon,
  PhotoLibrary as MediaIcon,
  Business as BizIcon,
  FavoriteBorder as JoyIcon,
  Create as CreationIcon,
  Notifications as NotificationIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface DashboardStats {
  total_groups: number;
  my_groups: number;
  total_connections: number;
  pending_requests: number;
  recent_activities: any[];
  notifications: any[];
}

interface Module {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  path: string;
  isNew?: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const modules: Module[] = [
    {
      id: 'groups',
      name: 'My Groups',
      icon: <GroupsIcon />,
      description: 'Create and manage your groups',
      color: '#2196F3',
      path: '/groups'
    },
    {
      id: 'shop',
      name: 'My Shop',
      icon: <StoreIcon />,
      description: 'Manage your online store',
      color: '#4CAF50',
      path: '/shop'
    },
    {
      id: 'tv',
      name: 'My TV',
      icon: <TvIcon />,
      description: 'Media and broadcasting',
      color: '#FF5722',
      path: '/tv'
    },
    {
      id: 'needy',
      name: 'My Needy',
      icon: <NeedyIcon />,
      description: 'Help and support services',
      color: '#9C27B0',
      path: '/needy'
    },
    {
      id: 'labor',
      name: 'My Labor',
      icon: <LaborIcon />,
      description: 'Labor and workforce management',
      color: '#795548',
      path: '/labor'
    },
    {
      id: 'bank',
      name: 'My Bank',
      icon: <BankIcon />,
      description: 'Financial services',
      color: '#607D8B',
      path: '/bank'
    },
    {
      id: 'chat',
      name: 'My Chat',
      icon: <ChatIcon />,
      description: 'Communication and messaging',
      color: '#00BCD4',
      path: '/chat'
    },
    {
      id: 'media',
      name: 'My Media',
      icon: <MediaIcon />,
      description: 'Media management',
      color: '#E91E63',
      path: '/media'
    },
    {
      id: 'biz',
      name: 'My Biz',
      icon: <BizIcon />,
      description: 'Business management',
      color: '#3F51B5',
      path: '/biz'
    },
    {
      id: 'joy',
      name: 'My Joy',
      icon: <JoyIcon />,
      description: 'Entertainment and activities',
      color: '#FFEB3B',
      path: '/joy'
    },
    {
      id: 'creation',
      name: 'My Creation',
      icon: <CreationIcon />,
      description: 'Creative content management',
      color: '#FF9800',
      path: '/creation'
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {/* Header Section */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)' }}
              src={user?.profile_image}
            >
              {user?.first_name?.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight="bold">
              {getGreeting()}, {user?.first_name}!
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Welcome back to My Group. Here's what's happening in your community.
            </Typography>
          </Grid>
          <Grid item>
            <IconButton color="inherit">
              <Badge badgeContent={stats?.notifications?.length || 0} color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.total_groups || 0}
                  </Typography>
                  <Typography variant="body2">Total Groups</Typography>
                </Box>
                <GroupsIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.my_groups || 0}
                  </Typography>
                  <Typography variant="body2">My Groups</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.total_connections || 0}
                  </Typography>
                  <Typography variant="body2">Connections</Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.pending_requests || 0}
                  </Typography>
                  <Typography variant="body2">Pending Requests</Typography>
                </Box>
                <StarIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Modules Grid */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
            My Group Modules
          </Typography>
          <Grid container spacing={2}>
            {modules.map((module) => (
              <Grid item xs={12} sm={6} md={4} key={module.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: module.color, mr: 2 }}>
                        {module.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {module.name}
                        </Typography>
                        {module.isNew && (
                          <Chip label="New" size="small" color="secondary" />
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {module.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Open Module
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Recent Activities */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Recent Activities
              </Typography>
              {loading ? (
                <LinearProgress />
              ) : (
                <List>
                  {stats?.recent_activities?.slice(0, 5).map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <GroupsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.title || 'Activity'}
                          secondary={activity.time || 'Recent'}
                        />
                      </ListItem>
                      {index < 4 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  )) || (
                    <ListItem>
                      <ListItemText
                        primary="No recent activities"
                        secondary="Start exploring modules to see activities here"
                      />
                    </ListItem>
                  )}
                </List>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Notifications
              </Typography>
              <List>
                {stats?.notifications?.slice(0, 3).map((notification, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <NotificationIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.title || 'Notification'}
                        secondary={notification.message || 'New notification'}
                      />
                    </ListItem>
                    {index < 2 && <Divider />}
                  </React.Fragment>
                )) || (
                  <ListItem>
                    <ListItemText
                      primary="No new notifications"
                      secondary="You're all caught up!"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;