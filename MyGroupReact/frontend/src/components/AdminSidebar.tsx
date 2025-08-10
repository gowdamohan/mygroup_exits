
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
  Avatar
} from '@mui/material';
import {
  Dashboard,
  Settings,
  Campaign,
  ContentPaste,
  Category,
  AdUnits,
  Business,
  ExpandLess,
  ExpandMore,
  Group,
  Create,
  Language,
  School,
  Work,
  Public,
  People,
  Build,
  Feedback,
  ExitToApp,
  BookmarkBorder,
  Database,
  Support,
  Assignment
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface AdminSidebarProps {
  open: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (
    path: string,
    icon: React.ReactNode,
    text: string,
    isSubmenu = false
  ) => (
    <ListItemButton
      component={Link}
      to={path}
      selected={isActive(path)}
      sx={{
        pl: isSubmenu ? 4 : 2,
        backgroundColor: isActive(path) ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(0, 123, 255, 0.05)',
        }
      }}
    >
      <ListItemIcon sx={{ color: isActive(path) ? 'primary.main' : 'inherit' }}>
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={text} 
        sx={{ color: isActive(path) ? 'primary.main' : 'inherit' }}
      />
    </ListItemButton>
  );

  const renderExpandableMenu = (
    key: string,
    icon: React.ReactNode,
    text: string,
    children: React.ReactNode
  ) => (
    <>
      <ListItemButton onClick={() => toggleMenu(key)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
        {openMenus[key] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openMenus[key]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children}
        </List>
      </Collapse>
    </>
  );

  if (!user) return null;

  return (
    <Box sx={{ width: open ? 250 : 60, transition: 'width 0.3s' }}>
      {/* User Info */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Avatar sx={{ mx: 'auto', mb: 1 }}>{user.username?.[0]?.toUpperCase()}</Avatar>
        {open && (
          <Typography variant="subtitle2" noWrap>
            {user.username}
          </Typography>
        )}
      </Box>
      
      <Divider />

      <List>
        {/* Dashboard */}
        <ListItem disablePadding>
          {renderMenuItem('/admin/dashboard', <Dashboard />, 'Dashboard')}
        </ListItem>

        {/* Profile Section - Only for group_id == 0 (Super Admin) */}
        {user.group_id === 0 && (
          <ListItem disablePadding>
            {renderExpandableMenu('profile', <Settings />, 'Profile', (
              <>
                {renderMenuItem('/admin/groups', <Group />, 'Group', true)}
                {renderMenuItem('/admin/create', <Create />, 'Created', true)}
                {renderMenuItem('/admin/group-accounts', <People />, 'Group Account', true)}
                {renderMenuItem('/admin/change-password', <Settings />, 'Change Password', true)}
              </>
            ))}
          </ListItem>
        )}

        {/* Advertisement Section - Only for group_id != 0 */}
        {user.group_id !== 0 && (
          <ListItem disablePadding>
            {renderExpandableMenu('advertisement', <Campaign />, 'Advertisement', (
              <>
                {renderMenuItem('/admin/popup-ads', <AdUnits />, 'Popup Add', true)}
                {renderMenuItem('/admin/header-ads', <Campaign />, 'Header Add', true)}
              </>
            ))}
          </ListItem>
        )}

        {/* Content Section - Only for group_id == 0 */}
        {user.group_id === 0 && (
          <ListItem disablePadding>
            {renderExpandableMenu('content', <ContentPaste />, 'Content', (
              <>
                {renderExpandableMenu('country-list', <Public />, 'Country List', (
                  <>
                    {renderMenuItem('/admin/continents', <Public />, 'Continent', true)}
                    {renderMenuItem('/admin/countries', <Public />, 'Country', true)}
                    {renderMenuItem('/admin/states', <Public />, 'State', true)}
                    {renderMenuItem('/admin/districts', <Public />, 'District', true)}
                  </>
                ))}
                {renderMenuItem('/admin/languages', <Language />, 'Language', true)}
                {renderMenuItem('/admin/education', <School />, 'Education', true)}
                {renderMenuItem('/admin/professions', <Work />, 'Profession', true)}
              </>
            ))}
          </ListItem>
        )}

        {/* Create Category Section - Only for group_id == 0 */}
        {user.group_id === 0 && (
          <ListItem disablePadding>
            {renderExpandableMenu('create-category', <Category />, 'Create Category', (
              <>
                {renderMenuItem('/admin/category/mymedia', <Category />, 'My Media', true)}
                {renderMenuItem('/admin/category/myjoy', <Category />, 'My Joy', true)}
                {renderMenuItem('/admin/category/myshop', <Category />, 'My Shop', true)}
                {renderMenuItem('/admin/category/myfriend', <Category />, 'My Friend', true)}
                {renderMenuItem('/admin/category/myunions', <Category />, 'My Unions', true)}
                {renderMenuItem('/admin/category/mybiz', <Category />, 'My Biz', true)}
                {renderMenuItem('/admin/category/mytv', <Category />, 'My TV', true)}
                {renderMenuItem('/admin/category/myneedy', <Category />, 'My Needy', true)}
              </>
            ))}
          </ListItem>
        )}

        {/* My Ads Section - Only for group_id == 0 */}
        {user.group_id === 0 && (
          <ListItem disablePadding>
            {renderMenuItem('/admin/my-ads', <AdUnits />, 'My Ads')}
          </ListItem>
        )}

        {/* Corporate Login Section - Only for group_id == 0 */}
        {user.group_id === 0 && (
          <ListItem disablePadding>
            {renderMenuItem('/admin/corporate-login', <Business />, 'Corporate Login')}
          </ListItem>
        )}

        {/* Media Specific Sections - Only for username == 'mymedia' */}
        {user.username === 'mymedia' && (
          <>
            <ListItem disablePadding>
              {renderMenuItem('/admin/media/god-clients', <BookmarkBorder />, 'My God Client')}
            </ListItem>
            <ListItem disablePadding>
              {renderMenuItem('/admin/media/clients', <BookmarkBorder />, 'My Media Client')}
            </ListItem>
          </>
        )}

        {/* Needy Specific Sections - Only for username == 'myneedy' */}
        {user.username === 'myneedy' && (
          <ListItem disablePadding>
            {renderMenuItem('/admin/needy/clients', <BookmarkBorder />, 'Needy Client')}
          </ListItem>
        )}

        {/* Union Specific Sections - Only for username == 'myunions' */}
        {user.username === 'myunions' && (
          <>
            <ListItem disablePadding>
              {renderMenuItem('/admin/union/member-applications', <Assignment />, 'Member Applications')}
            </ListItem>
            <ListItem disablePadding>
              {renderMenuItem('/admin/union/director-applications', <Assignment />, 'Director Applications')}
            </ListItem>
            <ListItem disablePadding>
              {renderMenuItem('/admin/union/leader-applications', <Assignment />, 'Header/Leader Applications')}
            </ListItem>
            <ListItem disablePadding>
              {renderMenuItem('/admin/union/staff-applications', <Assignment />, 'Staff Applications')}
            </ListItem>
            <ListItem disablePadding>
              {renderExpandableMenu('database', <Database />, 'Data Base', (
                <>
                  {renderMenuItem('/admin/union/client-database', <Database />, 'Client Database', true)}
                  {renderMenuItem('/admin/union/public-database', <Database />, 'Public Database', true)}
                  {renderMenuItem('/admin/union/login-chart', <Database />, 'Public Login Chart', true)}
                  {renderMenuItem('/admin/union/career-applications', <Database />, 'Career Applications', true)}
                </>
              ))}
            </ListItem>
          </>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Logout */}
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default AdminSidebar;
