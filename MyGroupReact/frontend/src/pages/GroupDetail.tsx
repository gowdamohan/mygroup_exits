
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
