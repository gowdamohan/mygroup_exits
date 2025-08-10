
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
  DialogActions
} from '@mui/material';
import { Search, Add, Edit, Public, Flag } from '@mui/icons-material';
import { useApi } from '../hooks/useApi';

interface Country {
  id: number;
  country_name: string;
  country_code: string;
  flag_image?: string;
  status: 'active' | 'inactive';
  created_date: string;
}

const AdminCountries: React.FC = () => {
  const { request, loading } = useApi();
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

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

  const filteredCountries = countries.filter(country =>
    country.country_name.toLowerCase().includes(search.toLowerCase()) ||
    country.country_code.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCountry(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Public sx={{ mr: 2 }} />
        Countries Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Total Countries</Typography>
              <Typography variant="h4">{countries.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">Active Countries</Typography>
              <Typography variant="h4">
                {countries.filter(c => c.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Add */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Add Country
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Countries Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Flag</TableCell>
              <TableCell>Country Name</TableCell>
              <TableCell>Country Code</TableCell>
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
            ) : filteredCountries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No countries found</TableCell>
              </TableRow>
            ) : (
              filteredCountries.map((country) => (
                <TableRow key={country.id} hover>
                  <TableCell>
                    {country.flag_image ? (
                      <img
                        src={country.flag_image}
                        alt={country.country_name}
                        style={{ width: 30, height: 20 }}
                      />
                    ) : (
                      <Flag color="action" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{country.country_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={country.country_code} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={country.status}
                      color={country.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(country.created_date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(country)}>
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
          {editingCountry ? 'Edit Country' : 'Add Country'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Country Name"
            margin="normal"
            defaultValue={editingCountry?.country_name || ''}
          />
          <TextField
            fullWidth
            label="Country Code"
            margin="normal"
            defaultValue={editingCountry?.country_code || ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained">
            {editingCountry ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCountries;
