
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
