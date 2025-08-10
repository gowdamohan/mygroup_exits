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

// Admin Components
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminGroups from './pages/AdminGroups';

// Lazy load other admin components
const AdminLabor = React.lazy(() => import('./pages/AdminLabor'));
const AdminNeedy = React.lazy(() => import('./pages/AdminNeedy'));
const AdminMedia = React.lazy(() => import('./pages/AdminMedia'));
const AdminFranchise = React.lazy(() => import('./pages/AdminFranchise'));
const AdminCountries = React.lazy(() => import('./pages/AdminCountries'));
const AdminStates = React.lazy(() => import('./pages/AdminStates'));
const AdminDistricts = React.lazy(() => import('./pages/AdminDistricts'));
const AdminPages = React.lazy(() => import('./pages/AdminPages'));
const AdminGalleries = React.lazy(() => import('./pages/AdminGalleries'));
const AdminAdvertisements = React.lazy(() => import('./pages/AdminAdvertisements'));
const AdminCategories = React.lazy(() => import('./pages/AdminCategories'));

// Assume AdminLayout and AdminProtectedRoute are defined elsewhere
// import AdminLayout from './components/AdminLayout';
// import AdminProtectedRoute from './components/AdminProtectedRoute';

// Placeholder for AdminLayout and AdminProtectedRoute if they are not provided
const AdminLayout = ({ children }) => <div>{children}</div>;
const AdminProtectedRoute = ({ children, requiredRole }) => <div>{children}</div>;


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
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="groups" element={<AdminGroups />} />
                      <Route path="labor" element={<AdminLabor />} />
                      <Route path="needy" element={<AdminNeedy />} />
                      <Route path="media" element={<AdminMedia />} />
                      <Route path="franchise" element={<AdminFranchise />} />
                      <Route path="countries" element={<AdminCountries />} />
                      <Route path="states" element={<AdminStates />} />
                      <Route path="districts" element={<AdminDistricts />} />
                      <Route path="pages" element={<AdminPages />} />
                      <Route path="galleries" element={<AdminGalleries />} />
                      <Route path="advertisements" element={<AdminAdvertisements />} />
                      <Route path="categories" element={<AdminCategories />} />
                    </Routes>
                  </AdminLayout>
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