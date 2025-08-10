
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
import { Search, FilterList, Person, Work, LocationOn } from '@mui/icons-material';
import { useApi } from '../hooks/useApi';

interface Labor {
  id: number;
  labor_name: string;
  labor_category: string;
  phone: string;
  email: string;
  experience: string;
  status: 'active' | 'inactive';
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

const AdminLabor: React.FC = () => {
  const { request, loading } = useApi();
  const [labor, setLabor] = useState<Labor[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchLabor = async () => {
    try {
      const response = await request({
        url: '/admin/labor',
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
        setLabor(response.data.labor || []);
        setTotalCount(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching labor:', error);
    }
  };

  useEffect(() => {
    fetchLabor();
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
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Work sx={{ mr: 2 }} />
        Labor Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Total Labor</Typography>
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
              placeholder="Search labor..."
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
                <MenuItem value="Construction">Construction</MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
                <MenuItem value="Plumbing">Plumbing</MenuItem>
                <MenuItem value="Carpentry">Carpentry</MenuItem>
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

      {/* Labor Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Labor</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : labor.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No labor found</TableCell>
              </TableRow>
            ) : (
              labor.map((laborItem) => (
                <TableRow key={laborItem.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{laborItem.labor_name}</Typography>
                        {laborItem.user && (
                          <Typography variant="caption" color="text.secondary">
                            {laborItem.user.first_name} {laborItem.user.last_name}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={laborItem.labor_category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{laborItem.phone}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {laborItem.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{laborItem.experience}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" display="block">
                          {laborItem.country?.country_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {laborItem.state?.state_name}, {laborItem.district?.district_name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={laborItem.status}
                      color={getStatusColor(laborItem.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(laborItem.created_date).toLocaleDateString()}
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

export default AdminLabor;
