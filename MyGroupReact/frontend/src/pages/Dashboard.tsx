import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Avatar
} from '@mui/material';
import {
  People as PeopleIcon,
  Groups as GroupIcon,
  Work as WorkIcon,
  HelpOutline as HelpIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { getUserDashboard, getActivityFeed } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard
  } = useApi(() => getUserDashboard());

  const {
    data: activityData,
    loading: activityLoading,
    error: activityError
  } = useApi(() => getActivityFeed(10));

  const stats = dashboardData || {};
  const activities = activityData?.activities || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'group': return <GroupIcon />;
      case 'labor': return <WorkIcon />;
      case 'service': return <HelpIcon />;
      default: return <GroupIcon />;
    }
  };

  if (dashboardLoading) {
    return <LoadingSpinner fullPage message="Loading dashboard..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.first_name}!
      </Typography>

      <ErrorAlert error={dashboardError} />

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <GroupIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    My Groups
                  </Typography>
                  <Typography variant="h5" component="div">
                    {stats.groups?.length || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <WorkIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Labor Profiles
                  </Typography>
                  <Typography variant="h5" component="div">
                    {stats.laborProfiles?.length || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <HelpIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Service Requests
                  </Typography>
                  <Typography variant="h5" component="div">
                    {stats.needyServices?.length || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Profile Status
                  </Typography>
                  <Typography variant="h6" component="div">
                    {stats.user?.profile ? (
                      <Chip label="Complete" color="success" size="small" />
                    ) : (
                      <Chip label="Incomplete" color="warning" size="small" />
                    )}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <ErrorAlert error={activityError} />
            {activityLoading ? (
              <LoadingSpinner message="Loading activities..." />
            ) : activities.length > 0 ? (
              <List>
                {activities.map((activity: any) => (
                  <ListItem key={activity.id} divider>
                    <Avatar sx={{ mr: 2, bgcolor: 'grey.100' }}>
                      {getActivityIcon(activity.type)}
                    </Avatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="textSecondary">
                            {activity.user && 
                              `${activity.user.first_name} ${activity.user.last_name}`
                            }
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            • {formatDate(activity.date)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No recent activity to display.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                fullWidth
                href="/groups"
              >
                Create Group
              </Button>
              <Button
                variant="outlined"
                startIcon={<WorkIcon />}
                fullWidth
                href="/labor"
              >
                Add Labor Profile
              </Button>
              <Button
                variant="outlined"
                startIcon={<HelpIcon />}
                fullWidth
                href="/needy"
              >
                Request Service
              </Button>
              <Button
                variant="outlined"
                fullWidth
                href="/profile"
              >
                Update Profile
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;