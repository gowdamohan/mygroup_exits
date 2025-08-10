
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
  Divider,
  Paper,
  Tab,
  Tabs,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Favorite as FavoriteIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface NeedyService {
  id: number;
  title: string;
  description: string;
  service_type: 'financial' | 'medical' | 'education' | 'food' | 'shelter' | 'clothing' | 'other';
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  required_amount: number;
  raised_amount: number;
  beneficiary_name: string;
  beneficiary_phone: string;
  beneficiary_email: string;
  location: string;
  target_date: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  created_by: number;
  created_at: string;
  documents: string[];
  supporters_count: number;
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
      id={`needy-tabpanel-${index}`}
      aria-labelledby={`needy-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const Needy: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [needyServices, setNeedyServices] = useState<NeedyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedService, setSelectedService] = useState<NeedyService | null>(null);
  const [filterType, setFilterType] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');

  const [newService, setNewService] = useState({
    title: '',
    description: '',
    service_type: 'financial' as 'financial' | 'medical' | 'education' | 'food' | 'shelter' | 'clothing' | 'other',
    urgency_level: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    required_amount: 0,
    beneficiary_name: '',
    beneficiary_phone: '',
    beneficiary_email: '',
    location: '',
    target_date: ''
  });

  const serviceTypes = [
    { value: 'financial', label: 'Financial Aid', color: '#2e7d32' },
    { value: 'medical', label: 'Medical Support', color: '#d32f2f' },
    { value: 'education', label: 'Education', color: '#1976d2' },
    { value: 'food', label: 'Food Support', color: '#f57c00' },
    { value: 'shelter', label: 'Shelter', color: '#5d4037' },
    { value: 'clothing', label: 'Clothing', color: '#7b1fa2' },
    { value: 'other', label: 'Other', color: '#616161' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: '#4caf50' },
    { value: 'medium', label: 'Medium', color: '#ff9800' },
    { value: 'high', label: 'High', color: '#f44336' },
    { value: 'critical', label: 'Critical', color: '#9c27b0' }
  ];

  const statusColors = {
    active: 'success',
    completed: 'info',
    cancelled: 'error',
    pending: 'warning'
  } as const;

  useEffect(() => {
    fetchNeedyServices();
  }, []);

  const fetchNeedyServices = async () => {
    try {
      const response = await api.get('/needy-services');
      setNeedyServices(response.data);
    } catch (error) {
      console.error('Failed to fetch needy services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateService = async () => {
    try {
      const response = await api.post('/needy-services', newService);
      setNeedyServices([response.data, ...needyServices]);
      setCreateDialogOpen(false);
      setNewService({
        title: '',
        description: '',
        service_type: 'financial',
        urgency_level: 'medium',
        required_amount: 0,
        beneficiary_name: '',
        beneficiary_phone: '',
        beneficiary_email: '',
        location: '',
        target_date: ''
      });
    } catch (error) {
      console.error('Failed to create needy service:', error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, service: NeedyService) => {
    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedService(null);
  };

  const getServiceTypeColor = (type: string) => {
    const serviceType = serviceTypes.find(st => st.value === type);
    return serviceType ? serviceType.color : '#616161';
  };

  const getUrgencyColor = (urgency: string) => {
    const urgencyLevel = urgencyLevels.find(ul => ul.value === urgency);
    return urgencyLevel ? urgencyLevel.color : '#616161';
  };

  const calculateProgress = (raised: number, required: number) => {
    return required > 0 ? (raised / required) * 100 : 0;
  };

  const filteredServices = needyServices.filter(service => {
    const typeMatch = !filterType || service.service_type === filterType;
    const urgencyMatch = !filterUrgency || service.urgency_level === filterUrgency;
    return typeMatch && urgencyMatch;
  });

  const renderServiceCard = (service: NeedyService) => {
    const progress = calculateProgress(service.raised_amount, service.required_amount);
    
    return (
      <Card key={service.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Typography variant="h6" component="h2">
              {service.title}
            </Typography>
            <IconButton size="small" onClick={(e) => handleMenuClick(e, service)}>
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Chip
              label={serviceTypes.find(st => st.value === service.service_type)?.label}
              size="small"
              sx={{ bgcolor: getServiceTypeColor(service.service_type), color: 'white' }}
            />
            <Chip
              label={urgencyLevels.find(ul => ul.value === service.urgency_level)?.label}
              size="small"
              sx={{ bgcolor: getUrgencyColor(service.urgency_level), color: 'white' }}
            />
            <Chip
              label={service.status}
              size="small"
              color={statusColors[service.status]}
              variant="outlined"
            />
          </Box>

          <Typography variant="body2" color="textSecondary" paragraph>
            {service.description}
          </Typography>

          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" fontWeight="bold">
                ₹{service.raised_amount.toLocaleString()} raised
              </Typography>
              <Typography variant="body2" color="textSecondary">
                of ₹{service.required_amount.toLocaleString()}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(progress, 100)}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="textSecondary">
              {progress.toFixed(1)}% funded
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" color="textSecondary">
              {service.beneficiary_name}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2" color="textSecondary">
              {service.location}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <FavoriteIcon fontSize="small" color="action" />
            <Typography variant="body2" color="textSecondary">
              {service.supporters_count} supporters
            </Typography>
          </Box>

          {service.target_date && (
            <Box display="flex" alignItems="center" gap={1}>
              <ScheduleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Target: {new Date(service.target_date).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </CardContent>

        <CardActions>
          <Button size="small" variant="contained" color="primary">
            Support
          </Button>
          <Button size="small" startIcon={<ViewIcon />}>
            Details
          </Button>
          <Button size="small" startIcon={<FavoriteIcon />}>
            {service.supporters_count}
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Needy Services
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          size="large"
        >
          Add Service Request
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="needy tabs">
          <Tab label="All Services" />
          <Tab label="My Requests" />
          <Tab label="Supported" />
          <Tab label="Categories" />
        </Tabs>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Service Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Service Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {serviceTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Urgency Level</InputLabel>
              <Select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                label="Urgency Level"
              >
                <MenuItem value="">All Levels</MenuItem>
                {urgencyLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary">
              {filteredServices.length} services found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {filteredServices.map((service) => (
            <Grid item xs={12} md={6} lg={4} key={service.id}>
              {renderServiceCard(service)}
            </Grid>
          ))}
          {filteredServices.length === 0 && (
            <Grid item xs={12}>
              <Box textAlign="center" py={8}>
                <FavoriteIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No needy services found
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={3}>
                  Help make a difference by creating or supporting service requests.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Create Service Request
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          My Service Requests
        </Typography>
        {/* Content for user's own requests */}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Services I Support
        </Typography>
        {/* Content for supported services */}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>
          Service Categories
        </Typography>
        {/* Content for service categories */}
      </TabPanel>

      {/* Create Service Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Service Request</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Title"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={newService.service_type}
                  onChange={(e) => setNewService({ ...newService, service_type: e.target.value as any })}
                  label="Service Type"
                  required
                >
                  {serviceTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Urgency Level</InputLabel>
                <Select
                  value={newService.urgency_level}
                  onChange={(e) => setNewService({ ...newService, urgency_level: e.target.value as any })}
                  label="Urgency Level"
                  required
                >
                  {urgencyLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Required Amount (₹)"
                type="number"
                value={newService.required_amount}
                onChange={(e) => setNewService({ ...newService, required_amount: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Date"
                type="date"
                value={newService.target_date}
                onChange={(e) => setNewService({ ...newService, target_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Beneficiary Name"
                value={newService.beneficiary_name}
                onChange={(e) => setNewService({ ...newService, beneficiary_name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Beneficiary Phone"
                value={newService.beneficiary_phone}
                onChange={(e) => setNewService({ ...newService, beneficiary_phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Beneficiary Email"
                type="email"
                value={newService.beneficiary_email}
                onChange={(e) => setNewService({ ...newService, beneficiary_email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={newService.location}
                onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateService}
            variant="contained"
            disabled={!newService.title || !newService.beneficiary_name || !newService.location}
          >
            Create Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service Actions Menu */}
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
          <ListItemText>Edit Request</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Support This</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Request</ListItemText>
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

export default Needy;
