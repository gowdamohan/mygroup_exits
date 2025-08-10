
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Search, Add, Edit, LocationOn } from '@mui/icons-material';
import { useApi } from '../hooks/useApi';

interface District {
  id: number;
  district_name: string;
  state_id: number;
  country_id: number;
  status: 'active' | 'inactive';
  created_date: string;
  State?: {
    state_name: string;
  };
  Country?: {
    country_name: string;
  };
}

interface Country {
  id: number;
  country_name: string;
}

interface State {
  id: number;
  state_name: string;
  country_id: number;
}

const AdminDistricts: React.FC = () => {
  const { request, loading } = useApi();
  const [districts, setDistricts] = useState<District[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('');

  const fetchDistricts = async () => {
    try {
      const params: any = {};
      if (countryFilter !== 'all') params.countryId = countryFilter;
      if (stateFilter !== 'all') params.stateId = stateFilter;

      const response = await request({
        url: '/admin/districts',
        method: 'GET',
        params
      });

      if (response.data) {
        setDistricts(response.data.districts || []);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await request({
        url: '/admin/countries',
        method: 'GET'
      });

      if (response.data) {
        setCountries(response.data.countries || []);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async (countryId?: string) => {
    try {
      const response = await request({
        url: '/admin/states',
        method: 'GET',
        params: countryId ? { countryId } : {}
      });

      if (response.data) {
        setStates(response.data.states || []);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchStates();
  }, []);

  useEffect(() => {
    fetchDistricts();
  }, [countryFilter, stateFilter]);

  useEffect(() => {
    if (countryFilter !== 'all') {
      fetchStates(countryFilter);
      setStateFilter('all');
    }
  }, [countryFilter]);

  const filteredDistricts = districts.filter(district =>
    district.district_name.toLowerCase().includes(search.toLowerCase()) ||
    district.State?.state_name.toLowerCase().includes(search.toLowerCase()) ||
    district.Country?.country_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (district: District) => {
    setEditingDistrict(district);
    setSelectedCountry(district.country_id.toString());
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDistrict(null);
    setSelectedCountry('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <LocationOn sx={{ mr: 2 }} />
        Districts Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Total Districts</Typography>
              <Typography variant="h4">{districts.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">Active Districts</Typography>
              <Typography variant="h4">
                {districts.filter(d => d.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search districts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                label="Country"
              >
                <MenuItem value="all">All Countries</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.country_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                label="State"
                disabled={countryFilter === 'all'}
              >
                <MenuItem value="all">All States</MenuItem>
                {states.map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.state_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Add District
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Districts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>District Name</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredDistricts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No districts found</TableCell>
              </TableRow>
            ) : (
              filteredDistricts.map((district) => (
                <TableRow key={district.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{district.district_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {district.State?.state_name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {district.Country?.country_name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={district.status}
                      color={district.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(district.created_date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(district)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDistrict ? 'Edit District' : 'Add District'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="District Name"
            margin="normal"
            defaultValue={editingDistrict?.district_name || ''}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Country</InputLabel>
            <Select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                fetchStates(e.target.value);
              }}
              label="Country"
            >
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.id}>
                  {country.country_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>State</InputLabel>
            <Select
              defaultValue={editingDistrict?.state_id || ''}
              label="State"
              disabled={!selectedCountry}
            >
              {states.filter(s => !selectedCountry || s.country_id.toString() === selectedCountry).map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.state_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained">
            {editingDistrict ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDistricts;
