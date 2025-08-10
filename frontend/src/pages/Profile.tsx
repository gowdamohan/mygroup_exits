
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
