
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Divider,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Palette as ThemeIcon,
  Privacy as PrivacyIcon,
  AccountCircle as AccountIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    showPhone: boolean;
    allowMessages: boolean;
  };
  preferences: {
    language: string;
    theme: string;
    timezone: string;
    currency: string;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
  };
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
      allowMessages: true
    },
    preferences: {
      language: 'en',
      theme: 'light',
      timezone: 'Asia/Kolkata',
      currency: 'INR'
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginAlerts: true
    }
  });

  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/user/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSettingChange = (category: keyof UserSettings, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await api.put('/user/settings', settings);
      // Show success message
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // Show error message
      return;
    }

    try {
      await api.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      // Show success message
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Account Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<AccountIcon />}
              title="Account Settings"
              subheader="Manage your account information"
            />
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar
                  src={user?.avatar}
                  sx={{ width: 64, height: 64 }}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{user?.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user?.email}
                  </Typography>
                </Box>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => setPasswordDialog(true)}
                sx={{ mt: 2 }}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<NotificationsIcon />}
              title="Notifications"
              subheader="Configure notification preferences"
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive updates via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.email}
                      onChange={(e) =>
                        handleSettingChange('notifications', 'email', e.target.checked)
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="SMS Notifications"
                    secondary="Receive updates via SMS"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.sms}
                      onChange={(e) =>
                        handleSettingChange('notifications', 'sms', e.target.checked)
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Receive push notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.push}
                      onChange={(e) =>
                        handleSettingChange('notifications', 'push', e.target.checked)
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Marketing Emails"
                    secondary="Receive promotional content"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.marketing}
                      onChange={(e) =>
                        handleSettingChange('notifications', 'marketing', e.target.checked)
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<PrivacyIcon />}
              title="Privacy"
              subheader="Control your privacy settings"
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Profile Visibility"
                    secondary="Make your profile visible to others"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.privacy.profileVisible}
                      onChange={(e) =>
                        handleSettingChange('privacy', 'profileVisible', e.target.checked)
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Show Email"
                    secondary="Display email on your profile"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.privacy.showEmail}
                      onChange={(e) =>
                        handleSettingChange('privacy', 'showEmail', e.target.checked)
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Show Phone"
                    secondary="Display phone number on your profile"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.privacy.showPhone}
                      onChange={(e) =>
                        handleSettingChange('privacy', 'showPhone', e.target.checked)
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Allow Messages"
                    secondary="Allow others to send you messages"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.privacy.allowMessages}
                      onChange={(e) =>
                        handleSettingChange('privacy', 'allowMessages', e.target.checked)
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<LanguageIcon />}
              title="Preferences"
              subheader="Customize your experience"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={settings.preferences.language}
                      onChange={(e) =>
                        handleSettingChange('preferences', 'language', e.target.value)
                      }
                      label="Language"
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="hi">Hindi</MenuItem>
                      <MenuItem value="te">Telugu</MenuItem>
                      <MenuItem value="ta">Tamil</MenuItem>
                      <MenuItem value="kn">Kannada</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={settings.preferences.theme}
                      onChange={(e) =>
                        handleSettingChange('preferences', 'theme', e.target.value)
                      }
                      label="Theme"
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="system">System</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={settings.preferences.timezone}
                      onChange={(e) =>
                        handleSettingChange('preferences', 'timezone', e.target.value)
                      }
                      label="Timezone"
                    >
                      <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                      <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                      <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                      <MenuItem value="Asia/Tokyo">Asia/Tokyo (JST)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={settings.preferences.currency}
                      onChange={(e) =>
                        handleSettingChange('preferences', 'currency', e.target.value)
                      }
                      label="Currency"
                    >
                      <MenuItem value="INR">Indian Rupee (₹)</MenuItem>
                      <MenuItem value="USD">US Dollar ($)</MenuItem>
                      <MenuItem value="EUR">Euro (€)</MenuItem>
                      <MenuItem value="GBP">British Pound (£)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              avatar={<SecurityIcon />}
              title="Security"
              subheader="Manage your account security"
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.twoFactorEnabled}
                        onChange={(e) =>
                          handleSettingChange('security', 'twoFactorEnabled', e.target.checked)
                        }
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                  <Typography variant="caption" display="block" color="textSecondary">
                    Add an extra layer of security to your account
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Session Timeout (minutes)</InputLabel>
                    <Select
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        handleSettingChange('security', 'sessionTimeout', e.target.value)
                      }
                      label="Session Timeout (minutes)"
                    >
                      <MenuItem value={15}>15 minutes</MenuItem>
                      <MenuItem value={30}>30 minutes</MenuItem>
                      <MenuItem value={60}>1 hour</MenuItem>
                      <MenuItem value={120}>2 hours</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.loginAlerts}
                        onChange={(e) =>
                          handleSettingChange('security', 'loginAlerts', e.target.checked)
                        }
                      />
                    }
                    label="Login Alerts"
                  />
                  <Typography variant="caption" display="block" color="textSecondary">
                    Get notified of new logins to your account
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="end" gap={2}>
            <Button variant="outlined">
              Reset to Defaults
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              disabled={loading}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                required
                error={
                  passwordData.confirmPassword !== '' &&
                  passwordData.newPassword !== passwordData.confirmPassword
                }
                helperText={
                  passwordData.confirmPassword !== '' &&
                  passwordData.newPassword !== passwordData.confirmPassword
                    ? 'Passwords do not match'
                    : ''
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              passwordData.newPassword !== passwordData.confirmPassword
            }
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
