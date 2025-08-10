
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, geographicAPI } from '../services/api';
import { ProfileUpdateData, ChangePasswordData, Country, State, District } from '../types';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const { user, profile, updateUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Geographic data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    watch,
    formState: { errors: profileErrors },
  } = useForm<ProfileUpdateData>();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordData>();

  const watchCountry = watch('country_id');
  const watchState = watch('state_id');
  const newPassword = watchPassword('newPassword');

  useEffect(() => {
    // Load countries
    const loadCountries = async () => {
      try {
        const countriesData = await geographicAPI.getCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Failed to load countries:', error);
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    // Load states when country changes
    if (watchCountry) {
      const loadStates = async () => {
        try {
          const statesData = await geographicAPI.getStates(watchCountry);
          setStates(statesData);
          setDistricts([]); // Clear districts
        } catch (error) {
          console.error('Failed to load states:', error);
        }
      };
      loadStates();
    }
  }, [watchCountry]);

  useEffect(() => {
    // Load districts when state changes
    if (watchState) {
      const loadDistricts = async () => {
        try {
          const districtsData = await geographicAPI.getDistricts(watchState);
          setDistricts(districtsData);
        } catch (error) {
          console.error('Failed to load districts:', error);
        }
      };
      loadDistricts();
    }
  }, [watchState]);

  useEffect(() => {
    // Populate form with existing data
    if (user && profile) {
      resetProfile({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        full_name: profile.full_name || '',
        gender: profile.gender || undefined,
        dob: profile.dob ? profile.dob.split('T')[0] : '',
        mobile: profile.mobile || '',
        alternate_mobile: profile.alternate_mobile || '',
        address: profile.address || '',
        pincode: profile.pincode || '',
        country_id: profile.country_id || undefined,
        state_id: profile.state_id || undefined,
        district_id: profile.district_id || undefined,
        profession_id: profile.profession_id || undefined,
        education_id: profile.education_id || undefined,
      });
    }
  }, [user, profile, resetProfile]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setMessage('');
    setError('');
  };

  const onProfileSubmit = async (data: ProfileUpdateData) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await usersAPI.updateProfile(data);
      setMessage('Profile updated successfully!');
      
      // Refresh user data
      const userData = await usersAPI.getProfile();
      updateUser(userData.user, userData.profile);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordData) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await usersAPI.changePassword(data);
      setMessage('Password changed successfully!');
      resetPassword();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Profile Information" />
              <Tab label="Change Password" />
            </Tabs>
          </Box>

          {message && (
            <Alert severity="success" sx={{ m: 2 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" gutterBottom>
              Profile Information
            </Typography>

            <Box component="form" onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    {...registerProfile('first_name')}
                    error={!!profileErrors.first_name}
                    helperText={profileErrors.first_name?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    {...registerProfile('last_name')}
                    error={!!profileErrors.last_name}
                    helperText={profileErrors.last_name?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    {...registerProfile('full_name')}
                    error={!!profileErrors.full_name}
                    helperText={profileErrors.full_name?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      label="Gender"
                      {...registerProfile('gender')}
                      error={!!profileErrors.gender}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...registerProfile('dob')}
                    error={!!profileErrors.dob}
                    helperText={profileErrors.dob?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile"
                    {...registerProfile('mobile')}
                    error={!!profileErrors.mobile}
                    helperText={profileErrors.mobile?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Alternate Mobile"
                    {...registerProfile('alternate_mobile')}
                    error={!!profileErrors.alternate_mobile}
                    helperText={profileErrors.alternate_mobile?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={3}
                    {...registerProfile('address')}
                    error={!!profileErrors.address}
                    helperText={profileErrors.address?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    {...registerProfile('pincode')}
                    error={!!profileErrors.pincode}
                    helperText={profileErrors.pincode?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                      label="Country"
                      {...registerProfile('country_id')}
                      error={!!profileErrors.country_id}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.id} value={country.id}>
                          {country.country_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select
                      label="State"
                      {...registerProfile('state_id')}
                      error={!!profileErrors.state_id}
                      disabled={!watchCountry}
                    >
                      {states.map((state) => (
                        <MenuItem key={state.id} value={state.id}>
                          {state.state_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>District</InputLabel>
                    <Select
                      label="District"
                      {...registerProfile('district_id')}
                      error={!!profileErrors.district_id}
                      disabled={!watchState}
                    >
                      {districts.map((district) => (
                        <MenuItem key={district.id} value={district.id}>
                          {district.district_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" gutterBottom>
              Change Password
            </Typography>

            <Box component="form" onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    {...registerPassword('currentPassword', {
                      required: 'Current password is required',
                    })}
                    error={!!passwordErrors.currentPassword}
                    helperText={passwordErrors.currentPassword?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    {...registerPassword('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword?.message}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Alert,
  IconButton,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
  Notifications as NotificationIcon,
  Privacy as PrivacyIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    date_of_birth: user?.date_of_birth || '',
    gender: user?.gender || '',
    profession: user?.profession || '',
    country_id: user?.country_id || '',
    state_id: user?.state_id || '',
    district_id: user?.district_id || '',
    address: user?.address || '',
    pincode: user?.pincode || '',
    bio: user?.bio || ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    profile_visibility: 'public',
    show_email: false,
    show_phone: false
  });

  useEffect(() => {
    fetchGeographicData();
  }, []);

  const fetchGeographicData = async () => {
    try {
      const [countriesRes, statesRes, districtsRes] = await Promise.all([
        api.get('/geographic/countries'),
        formData.country_id ? api.get(`/geographic/states?country_id=${formData.country_id}`) : Promise.resolve({ data: [] }),
        formData.state_id ? api.get(`/geographic/districts?state_id=${formData.state_id}`) : Promise.resolve({ data: [] })
      ]);
      
      setCountries(countriesRes.data);
      setStates(statesRes.data);
      setDistricts(districtsRes.data);
    } catch (error) {
      console.error('Failed to fetch geographic data:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (e: any) => {
    setFormData(prev => ({ ...prev, [name]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await api.put('/users/profile', formData);
      updateUser(response.data);
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage('New passwords do not match');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      await api.put('/users/change-password', passwordData);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setMessage('Password changed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to change password');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.post('/users/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser({ ...user, profile_image: response.data.avatar_url });
      setMessage('Profile picture updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage('Failed to upload profile picture');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {message && (
        <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label="Profile Information" />
          <Tab label="Security" />
          <Tab label="Settings" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Profile Header */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={3} mb={4}>
                <Box position="relative">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                        sx={{
                          backgroundColor: 'background.paper',
                          boxShadow: 1,
                          '&:hover': { backgroundColor: 'background.paper' }
                        }}
                      >
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={handleAvatarUpload}
                        />
                        <PhotoCameraIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <Avatar
                      sx={{ width: 120, height: 120 }}
                      src={user?.profile_image}
                    >
                      {user?.first_name?.charAt(0)}
                    </Avatar>
                  </Badge>
                </Box>
                <Box flex={1}>
                  <Typography variant="h5" fontWeight="bold">
                    {user?.first_name} {user?.last_name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {user?.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Member since {new Date(user?.created_at || '').toLocaleDateString()}
                  </Typography>
                </Box>
                <Button
                  variant={editing ? "outlined" : "contained"}
                  startIcon={editing ? <CancelIcon /> : <EditIcon />}
                  onClick={() => setEditing(!editing)}
                  color={editing ? "error" : "primary"}
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        disabled={!editing}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        disabled={!editing}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editing}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!editing}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        disabled={!editing}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={formData.gender}
                          onChange={handleSelectChange('gender')}
                          disabled={!editing}
                          label="Gender"
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Profession"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        disabled={!editing}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!editing}
                        multiline
                        rows={3}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Address Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Address Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Country</InputLabel>
                        <Select
                          value={formData.country_id}
                          onChange={handleSelectChange('country_id')}
                          disabled={!editing}
                          label="Country"
                        >
                          {countries.map((country: any) => (
                            <MenuItem key={country.id} value={country.id}>
                              {country.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>State</InputLabel>
                        <Select
                          value={formData.state_id}
                          onChange={handleSelectChange('state_id')}
                          disabled={!editing || !formData.country_id}
                          label="State"
                        >
                          {states.map((state: any) => (
                            <MenuItem key={state.id} value={state.id}>
                              {state.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>District</InputLabel>
                        <Select
                          value={formData.district_id}
                          onChange={handleSelectChange('district_id')}
                          disabled={!editing || !formData.state_id}
                          label="District"
                        >
                          {districts.map((district: any) => (
                            <MenuItem key={district.id} value={district.id}>
                              {district.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!editing}
                        multiline
                        rows={2}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        disabled={!editing}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {editing && (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Change Password
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={loading || !passwordData.current_password || !passwordData.new_password}
                      >
                        Update Password
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notification Settings
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText primary="Email Notifications" />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.email_notifications}
                            onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked })}
                          />
                        }
                        label=""
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText primary="SMS Notifications" />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.sms_notifications}
                            onChange={(e) => setSettings({ ...settings, sms_notifications: e.target.checked })}
                          />
                        }
                        label=""
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Privacy Settings
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <PrivacyIcon />
                      </ListItemIcon>
                      <ListItemText primary="Profile Visibility" />
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={settings.profile_visibility}
                          onChange={(e) => setSettings({ ...settings, profile_visibility: e.target.value })}
                        >
                          <MenuItem value="public">Public</MenuItem>
                          <MenuItem value="friends">Friends Only</MenuItem>
                          <MenuItem value="private">Private</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText primary="Show Email" />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.show_email}
                            onChange={(e) => setSettings({ ...settings, show_email: e.target.checked })}
                          />
                        }
                        label=""
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText primary="Show Phone" />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.show_phone}
                            onChange={(e) => setSettings({ ...settings, show_phone: e.target.checked })}
                          />
                        }
                        label=""
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Profile;
