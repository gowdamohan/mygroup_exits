
import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const getDashboardTitle = () => {
    if (!user) return 'Dashboard';
    
    if (user.group_id === 0) {
      return 'Super Admin Dashboard';
    } else {
      switch (user.username) {
        case 'mymedia':
          return 'My Media Dashboard';
        case 'myneedy':
          return 'My Needy Dashboard';
        case 'myunions':
          return 'My Unions Dashboard';
        default:
          return `${user.username} Dashboard`;
      }
    }
  };

  const renderSuperAdminDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Groups
            </Typography>
            <Typography variant="h5" component="div">
              12
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h5" component="div">
              1,234
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Categories
            </Typography>
            <Typography variant="h5" component="div">
              8
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Ads
            </Typography>
            <Typography variant="h5" component="div">
              45
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activities
          </Typography>
          <Typography variant="body2" color="textSecondary">
            System overview and recent activities will be displayed here.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderMediaDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Media Clients
            </Typography>
            <Typography variant="h5" component="div">
              89
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              God Clients
            </Typography>
            <Typography variant="h5" component="div">
              23
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Channels
            </Typography>
            <Typography variant="h5" component="div">
              15
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Content
            </Typography>
            <Typography variant="h5" component="div">
              456
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderNeedyDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Needy Clients
            </Typography>
            <Typography variant="h5" component="div">
              156
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Services
            </Typography>
            <Typography variant="h5" component="div">
              34
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Completed Orders
            </Typography>
            <Typography variant="h5" component="div">
              89
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Pending Requests
            </Typography>
            <Typography variant="h5" component="div">
              12
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderUnionsDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Member Applications
            </Typography>
            <Typography variant="h5" component="div">
              67
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Director Applications
            </Typography>
            <Typography variant="h5" component="div">
              12
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Staff Applications
            </Typography>
            <Typography variant="h5" component="div">
              8
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Members
            </Typography>
            <Typography variant="h5" component="div">
              234
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderGroupDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Group Members
            </Typography>
            <Typography variant="h5" component="div">
              45
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Ads
            </Typography>
            <Typography variant="h5" component="div">
              8
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Revenue
            </Typography>
            <Typography variant="h5" component="div">
              $1,234
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderDashboardContent = () => {
    if (!user) return null;

    if (user.group_id === 0) {
      return renderSuperAdminDashboard();
    } else {
      switch (user.username) {
        case 'mymedia':
          return renderMediaDashboard();
        case 'myneedy':
          return renderNeedyDashboard();
        case 'myunions':
          return renderUnionsDashboard();
        default:
          return renderGroupDashboard();
      }
    }
  };

  return (
    <AdminLayout title={getDashboardTitle()}>
      <Box>
        <Typography variant="h4" gutterBottom>
          {getDashboardTitle()}
        </Typography>
        {renderDashboardContent()}
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;
