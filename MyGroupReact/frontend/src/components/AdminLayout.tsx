
import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Drawer } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#2c3e50'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2">
            Welcome, {user?.username}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
        sx={{
          width: sidebarOpen ? 250 : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? 250 : 60,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
            backgroundColor: '#34495e',
            color: 'white',
            '& .MuiListItemIcon-root': {
              color: 'white'
            },
            '& .MuiListItemText-root': {
              color: 'white'
            }
          },
        }}
      >
        <Toolbar />
        <AdminSidebar open={sidebarOpen} />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#ecf0f1',
          p: 3,
          transition: 'margin 0.3s',
          marginLeft: sidebarOpen ? 0 : '-190px',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
