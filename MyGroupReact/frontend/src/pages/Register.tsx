import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  FormControlLabel,
  Checkbox,
  Link,
  Divider,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Country {
  id: number;
  name: string;
}

interface State {
  id: number;
  name: string;
  country_id: number;
}

interface District {
  id: number;
  name: string;
  state_id: number;
}

const Register: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Info
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',

    // Address Info
    country_id: '',
    state_id: '',
    district_id: '',
    address: '',
    pincode: '',

    // Additional Info
    date_of_birth: '',
    gender: '',
    profession: '',

    // Terms
    agree_terms: false,
    newsletter: false
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const steps = ['Basic Information', 'Address Details', 'Additional Info'];

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData.country_id) {
      fetchStates(parseInt(formData.country_id));
    }
  }, [formData.country_id]);

  useEffect(() => {
    if (formData.state_id) {
      fetchDistricts(parseInt(formData.state_id));
    }
  }, [formData.state_id]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchCountries = async () => {
    try {
      const response = await api.get('/geographic/countries');
      setCountries(response.data);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const fetchStates = async (countryId: number) => {
    try {
      const response = await api.get(`/geographic/states?country_id=${countryId}`);
      setStates(response.data);
      setFormData(prev => ({ ...prev, state_id: '', district_id: '' }));
      setDistricts([]);
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  const fetchDistricts = async (stateId: number) => {
    try {
      const response = await api.get(`/geographic/districts?state_id=${stateId}`);
      setDistricts(response.data);
      setFormData(prev => ({ ...prev, district_id: '' }));
    } catch (error) {
      console.error('Failed to fetch districts:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name: string) => (e: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.target.value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return formData.first_name !== '' && formData.last_name !== '' && formData.email !== '' &&
               formData.password !== '' && formData.confirmPassword !== '' && formData.phone !== '' &&
               formData.password === formData.confirmPassword;
      case 1:
        return formData.country_id !== '' && formData.state_id !== '' && formData.district_id !== '' &&
               formData.address !== '' && formData.pincode !== '';
      case 2:
        return formData.date_of_birth !== '' && formData.gender !== '' && formData.agree_terms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setError('');
    } else {
      setError('Please fill all required fields in the current step.');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agree_terms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : ''}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Country</InputLabel>
                <Select
                  value={formData.country_id}
                  label="Country"
                  onChange={handleSelectChange('country_id')}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required disabled={!formData.country_id}>
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.state_id}
                  label="State"
                  onChange={handleSelectChange('state_id')}
                >
                  {states.map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required disabled={!formData.state_id}>
                <InputLabel>District</InputLabel>
                <Select
                  value={formData.district_id}
                  label="District"
                  onChange={handleSelectChange('district_id')}
                >
                  {districts.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="pincode"
                label="Pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="address"
                label="Full Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={handleSelectChange('gender')}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="profession"
                label="Profession (Optional)"
                value={formData.profession}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agree_terms"
                    checked={formData.agree_terms}
                    onChange={handleChange}
                    required
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link href="#" color="primary">Terms and Conditions</Link>
                    {' '}and{' '}
                    <Link href="#" color="primary">Privacy Policy</Link>
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                  />
                }
                label="Subscribe to our newsletter for updates"
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 4, marginBottom: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box textAlign="center" mb={4}>
            <Typography component="h1" variant="h4" color="primary" fontWeight="bold">
              Join My Group
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Create your account to connect with communities
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !validateStep(activeStep)}
                  size="large"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={!validateStep(activeStep)}
                  size="large"
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" color="primary">
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;