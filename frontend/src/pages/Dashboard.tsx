
import React from 'react';
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
} from '@mui/material';
import {
  Group,
  Person,
  Work,
  HelpOutline,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();

  const quickActions = [
    {
      title: 'My Groups',
      description: 'View and manage your groups',
      icon: <Group />,
      link: '/groups',
      color: '#1976d2',
    },
    {
      title: 'Profile',
      description: 'Update your profile information',
      icon: <Person />,
      link: '/profile',
      color: '#388e3c',
    },
    {
      title: 'Labor Services',
      description: 'Browse labor opportunities',
      icon: <Work />,
      link: '/labor',
      color: '#f57c00',
    },
    {
      title: 'Needy Services',
      description: 'Find help and assistance',
      icon: <HelpOutline />,
      link: '/needy',
      color: '#d32f2f',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                      Welcome back, {user?.first_name || user?.username}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {user?.email}
                    </Typography>
                    {profile?.full_name && (
                      <Typography variant="body2" color="text.secondary">
                        {profile.full_name}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              Quick Actions
            </Typography>
          </Grid>

          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Box sx={{ color: action.color }}>
                      {action.icon}
                    </Box>
                    <Typography variant="h6" component="h3">
                      {action.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={action.link}
                    sx={{ color: action.color }}
                  >
                    Go to {action.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}

          {/* Stats Section */}
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              Statistics
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  My Groups
                </Typography>
                <Typography variant="h3" color="primary">
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Groups you're part of
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Connections
                </Typography>
                <Typography variant="h3" color="secondary">
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  People in your network
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Activities
                </Typography>
                <Typography variant="h3" color="success.main">
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recent activities
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
