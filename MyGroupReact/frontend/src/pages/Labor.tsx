
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Fab,
  Rating,
  Divider,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import {
  Add as AddIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface LaborProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  sub_category: string;
  experience_years: number;
  skills: string[];
  hourly_rate: number;
  availability: 'available' | 'busy' | 'unavailable';
  location: string;
  rating: number;
  total_jobs: number;
  profile_image: string;
  description: string;
  created_at: string;
  is_verified: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`labor-tabpanel-${index}`}
      aria-labelledby={`labor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const Labor: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [laborProfiles, setLaborProfiles] = useState<LaborProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProfile, setSelectedProfile] = useState<LaborProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [newProfile, setNewProfile] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    sub_category: '',
    experience_years: 0,
    skills: '',
    hourly_rate: 0,
    location: '',
    description: ''
  });

  const laborCategories = [
    'Construction',
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Cleaning',
    'Gardening',
    'Mechanical',
    'Welding',
    'Masonry',
    'Roofing',
    'HVAC',
    'Other'
  ];

  const availabilityColors = {
    available: 'success',
    busy: 'warning',
    unavailable: 'error'
  } as const;

  useEffect(() => {
    fetchLaborProfiles();
  }, []);

  const fetchLaborProfiles = async () => {
    try {
      const response = await api.get('/labor');
      setLaborProfiles(response.data);
    } catch (error) {
      console.error('Failed to fetch labor profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateProfile = async () => {
    try {
      const profileData = {
        ...newProfile,
        skills: newProfile.skills.split(',').map(skill => skill.trim())
      };
      
      const response = await api.post('/labor', profileData);
      setLaborProfiles([response.data, ...laborProfiles]);
      setCreateDialogOpen(false);
      setNewProfile({
        name: '',
        email: '',
        phone: '',
        category: '',
        sub_category: '',
        experience_years: 0,
        skills: '',
        hourly_rate: 0,
        location: '',
        description: ''
      });
    } catch (error) {
      console.error('Failed to create labor profile:', error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, profile: LaborProfile) => {
    setAnchorEl(event.currentTarget);
    setSelectedProfile(profile);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProfile(null);
  };

  const filteredProfiles = laborProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filterCategory || profile.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const renderLaborCard = (profile: LaborProfile) => (
    <Card key={profile.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={profile.profile_image}
              alt={profile.name}
              sx={{ width: 56, height: 56 }}
            >
              {profile.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h2">
                {profile.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Rating value={profile.rating} readOnly size="small" />
                <Typography variant="body2" color="textSecondary">
                  ({profile.total_jobs} jobs)
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton size="small" onClick={(e) => handleMenuClick(e, profile)}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Chip 
            label={profile.category} 
            size="small" 
            color="primary"
          />
          <Chip 
            label={profile.availability}
            size="small"
            color={availabilityColors[profile.availability]}
            variant="outlined"
          />
          {profile.is_verified && (
            <Chip 
              label="Verified"
              size="small"
              color="success"
              icon={<StarIcon />}
            />
          )}
        </Box>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          {profile.sub_category} • {profile.experience_years} years experience
        </Typography>

        <Typography variant="body2" paragraph>
          {profile.description}
        </Typography>

        <Box display="flex" flex-wrap="wrap" gap={0.5} mb={2}>
          {profile.skills.slice(0, 3).map((skill, index) => (
            <Chip key={index} label={skill} size="small" variant="outlined" />
          ))}
          {profile.skills.length > 3 && (
            <Chip label={`+${profile.skills.length - 3} more`} size="small" variant="outlined" />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justify-content="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2" color="textSecondary">
              {profile.location}
            </Typography>
          </Box>
          <Typography variant="h6" color="primary">
            ₹{profile.hourly_rate}/hr
          </Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small" startIcon={<PhoneIcon />}>
          Contact
        </Button>
        <Button size="small" startIcon={<ViewIcon />}>
          View Profile
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Labor Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          size="large"
        >
          Add Labor Profile
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="labor tabs">
          <Tab label="All Profiles" />
          <Tab label="My Profiles" />
          <Tab label="Contractors" />
          <Tab label="Categories" />
        </Tabs>
      </Paper>

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name, category, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {laborCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary">
              {filteredProfiles.length} profiles found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {filteredProfiles.map((profile) => (
            <Grid item xs={12} md={6} lg={4} key={profile.id}>
              {renderLaborCard(profile)}
            </Grid>
          ))}
          {filteredProfiles.length === 0 && (
            <Grid item xs={12}>
              <Box textAlign="center" py={8}>
                <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No labor profiles found
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={3}>
                  Try adjusting your search criteria or add a new labor profile.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Add Labor Profile
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          My Labor Profiles
        </Typography>
        {/* Content for user's own profiles */}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Contractors
        </Typography>
        {/* Content for contractors */}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        {/* Content for categories */}
      </TabPanel>

      {/* Create Profile Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Labor Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={newProfile.name}
                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newProfile.email}
                onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={newProfile.phone}
                onChange={(e) => setNewProfile({ ...newProfile, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={newProfile.location}
                onChange={(e) => setNewProfile({ ...newProfile, location: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newProfile.category}
                  onChange={(e) => setNewProfile({ ...newProfile, category: e.target.value })}
                  label="Category"
                  required
                >
                  {laborCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sub Category"
                value={newProfile.sub_category}
                onChange={(e) => setNewProfile({ ...newProfile, sub_category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Experience (Years)"
                type="number"
                value={newProfile.experience_years}
                onChange={(e) => setNewProfile({ ...newProfile, experience_years: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hourly Rate (₹)"
                type="number"
                value={newProfile.hourly_rate}
                onChange={(e) => setNewProfile({ ...newProfile, hourly_rate: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills (comma separated)"
                value={newProfile.skills}
                onChange={(e) => setNewProfile({ ...newProfile, skills: e.target.value })}
                placeholder="e.g., Welding, Metal Fabrication, Blueprint Reading"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newProfile.description}
                onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateProfile}
            variant="contained"
            disabled={!newProfile.name || !newProfile.email || !newProfile.phone || !newProfile.category}
          >
            Add Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Profile</ListItemText>
        </MenuItem>
      </Menu>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default Labor;
