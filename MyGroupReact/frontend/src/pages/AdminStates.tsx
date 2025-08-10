
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
import { Search, Add, Edit, Map } from '@mui/icons-material';
import { useApi } from '../hooks/useApi';

interface State {
  id: number;
  state_name: string;
  country_id: number;
  status: 'active' | 'inactive';
  created_date: string;
  Country?: {
    country_name: string;
  };
}

interface Country {
  id: number;
  country_name: string;
}

const AdminStates: React.FC = () => {
  const { request, loading } = useApi();
  const [states, setStates] = useState<State[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingState, setEditingState] = useState<State | null>(null);

  const fetchStates = async () => {
    try {
      const response = await request({
        url: '/admin/states',
        method: 'GET',
        params: countryFilter !== 'all' ? { countryId: countryFilter } : {}
      });

      if (response.data) {
        setStates(response.data.states || []);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
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

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchStates();
  }, [countryFilter]);

  const filteredStates = states.filter(state =>
    state.state_name.toLowerCase().includes(search.toLowerCase()) ||
    state.Country?.country_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (state: State) => {
    setEditingState(state);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingState(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Map sx={{ mr: 2 }} />
        States Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Total States</Typography>
              <Typography variant="h4">{states.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">Active States</Typography>
              <Typography variant="h4">
                {states.filter(s => s.status === 'active').length}
              </Typography>
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
              placeholder="Search states..."
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
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Add State
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* States Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>State Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredStates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No states found</TableCell>
              </TableRow>
            ) : (
              filteredStates.map((state) => (
                <TableRow key={state.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{state.state_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {state.Country?.country_name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={state.status}
                      color={state.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(state.created_date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(state)}>
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
          {editingState ? 'Edit State' : 'Add State'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="State Name"
            margin="normal"
            defaultValue={editingState?.state_name || ''}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Country</InputLabel>
            <Select
              defaultValue={editingState?.country_id || ''}
              label="Country"
            >
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.id}>
                  {country.country_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained">
            {editingState ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminStates;
