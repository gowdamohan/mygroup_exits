import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Labor from './pages/Labor';
import Media from './pages/Media';
import Needy from './pages/Needy';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    {/* Add more admin routes here as needed */}
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Regular User Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/groups/:id" element={<GroupDetail />} />
                    <Route path="/labor" element={<Labor />} />
                    <Route path="/media" element={<Media />} />
                    <Route path="/needy" element={<Needy />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/admin" element={<Admin />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;