
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Avatar,
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Search, FilterList, HelpOutline, Person, LocationOn } from '@mui/icons-material';
import { useApi } from '../hooks/useApi';

interface NeedyService {
  id: number;
  service_title: string;
  service_description: string;
  service_category: string;
  status: 'active' | 'inactive' | 'pending';
  created_date: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  country?: {
    country_name: string;
  };
  state?: {
    state_name: string;
  };
  district?: {
    district_name: string;
  };
}

const AdminNeedy: React.FC = () => {
  const { request, loading } = useApi();
  const [services, setServices] = useState<NeedyService[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchServices = async () => {
    try {
      const response = await request({
        url: '/admin/needy',
        method: 'GET',
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search,
          category: categoryFilter,
          status: statusFilter
        }
      });

      if (response.data) {
        setServices(response.data.services || []);
        setTotalCount(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching needy services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, rowsPerPage, search, categoryFilter, statusFilter]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <HelpOutline sx={{ mr: 2 }} />
        Needy Services Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Total Services</Typography>
              <Typography variant="h4">{totalCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Medical">Medical</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Financial">Financial</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearch('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Services Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Requester</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No services found</TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        {service.service_title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {service.service_description?.length > 100
                          ? `${service.service_description.substring(0, 100)}...`
                          : service.service_description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={service.service_category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                        <Person />
                      </Avatar>
                      {service.user && (
                        <Box>
                          <Typography variant="body2">
                            {service.user.first_name} {service.user.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {service.user.email}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" display="block">
                          {service.country?.country_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {service.state?.state_name}, {service.district?.district_name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={service.status}
                      color={getStatusColor(service.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(service.created_date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default AdminNeedy;
