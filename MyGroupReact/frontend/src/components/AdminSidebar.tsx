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
  Avatar,
  ListSubheader
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Group as GroupIcon,
  Work as WorkIcon,
  SupportAgent as SupportAgentIcon,
  OndemandVideo as OndemandVideoIcon,
  Business as BusinessIcon,
  Public as PublicIcon,
  LocationOn as LocationOnIcon,
  Place as PlaceIcon,
  Article as ArticleIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Campaign as CampaignIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Assessment as AssessmentIcon,
  ExitToApp as ExitToAppIcon,
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
          {renderMenuItem('/admin/dashboard', <DashboardIcon />, 'Dashboard')}
        </ListItem>

        {/* Core Admin Sections */}
        <ListItem button component={Link} to="/admin/users">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="User Management" />
        </ListItem>

        <ListItem button component={Link} to="/admin/groups">
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Group Management" />
        </ListItem>

        <ListItem button component={Link} to="/admin/labor">
          <ListItemIcon>
            <WorkIcon />
          </ListItemIcon>
          <ListItemText primary="Labor Management" />
        </ListItem>

        <ListItem button component={Link} to="/admin/needy">
          <ListItemIcon>
            <SupportAgentIcon />
          </ListItemIcon>
          <ListItemText primary="Needy Services" />
        </ListItem>

        <ListItem button component={Link} to="/admin/media">
          <ListItemIcon>
            <OndemandVideoIcon />
          </ListItemIcon>
          <ListItemText primary="Media Management" />
        </ListItem>

        <ListItem button component={Link} to="/admin/franchise">
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText primary="Franchise" />
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Geographic Management */}
        <ListSubheader component="div" inset>
          Geographic Management
        </ListSubheader>

        <ListItem button component={Link} to="/admin/countries">
          <ListItemIcon>
            <PublicIcon />
          </ListItemIcon>
          <ListItemText primary="Countries" />
        </ListItem>

        <ListItem button component={Link} to="/admin/states">
          <ListItemIcon>
            <LocationOnIcon />
          </ListItemIcon>
          <ListItemText primary="States" />
        </ListItem>

        <ListItem button component={Link} to="/admin/districts">
          <ListItemIcon>
            <PlaceIcon />
          </ListItemIcon>
          <ListItemText primary="Districts" />
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Content Management */}
        <ListSubheader component="div" inset>
          Content Management
        </ListSubheader>

        <ListItem button component={Link} to="/admin/pages">
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Pages" />
        </ListItem>

        <ListItem button component={Link} to="/admin/galleries">
          <ListItemIcon>
            <PhotoLibraryIcon />
          </ListItemIcon>
          <ListItemText primary="Galleries" />
        </ListItem>

        <ListItem button component={Link} to="/admin/advertisements">
          <ListItemIcon>
            <CampaignIcon />
          </ListItemIcon>
          <ListItemText primary="Advertisements" />
        </ListItem>

        <ListItem button component={Link} to="/admin/categories">
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* System Management */}
        <ListSubheader component="div" inset>
          System Management
        </ListSubheader>

        {/* Profile Section - Only for group_id == 0 (Super Admin) */}
        {user.group_id === 0 && (
          <ListItem disablePadding>
            {renderExpandableMenu('profile', <SettingsIcon />, 'Profile', (
              <>
                {renderMenuItem('/admin/groups', <GroupIcon />, 'Group', true)}
                {renderMenuItem('/admin/create', <Create />, 'Created', true)}
                {renderMenuItem('/admin/group-accounts', <PeopleIcon />, 'Group Account', true)}
                {renderMenuItem('/admin/change-password', <SettingsIcon />, 'Change Password', true)}
              </>
            ))}
          </ListItem>
        )}

        {/* Advertisement Section - Only for group_id != 0 */}
        {user.group_id !== 0 && (
          <ListItem disablePadding>
            {renderExpandableMenu('advertisement', <CampaignIcon />, 'Advertisement', (
              <>
                {renderMenuItem('/admin/popup-ads', <AdUnits />, 'Popup Add', true)}
                {renderMenuItem('/admin/header-ads', <CampaignIcon />, 'Header Add', true)}
              </>
            ))}
          </ListItem>
        )}

        {/* Content Section - Only for group_id == 0 */}
        {user.group_id === 0 && (
          <ListItem disablePadding>
            {renderExpandableMenu('content', <ContentPaste />, 'Content', (
              <>
                {renderExpandableMenu('country-list', <PublicIcon />, 'Country List', (
                  <>
                    {renderMenuItem('/admin/continents', <PublicIcon />, 'Continent', true)}
                    {renderMenuItem('/admin/countries', <PublicIcon />, 'Country', true)}
                    {renderMenuItem('/admin/states', <PublicIcon />, 'State', true)}
                    {renderMenuItem('/admin/districts', <PublicIcon />, 'District', true)}
                  </>
                ))}
                {renderMenuItem('/admin/languages', <School />, 'Language', true)}
                {renderMenuItem('/admin/education', <School />, 'Education', true)}
                {renderMenuItem('/admin/professions', <WorkIcon />, 'Profession', true)}
              </>
            ))}
          </ListItem>
        )}

        {/* Create Category Section - Only for group_id == 0 */}
        {user.group_id === 0 && (
          <ListItem disablePadding>
            {renderExpandableMenu('create-category', <CategoryIcon />, 'Create Category', (
              <>
                {renderMenuItem('/admin/category/mymedia', <CategoryIcon />, 'My Media', true)}
                {renderMenuItem('/admin/category/myjoy', <CategoryIcon />, 'My Joy', true)}
                {renderMenuItem('/admin/category/myshop', <CategoryIcon />, 'My Shop', true)}
                {renderMenuItem('/admin/category/myfriend', <CategoryIcon />, 'My Friend', true)}
                {renderMenuItem('/admin/category/myunions', <CategoryIcon />, 'My Unions', true)}
                {renderMenuItem('/admin/category/mybiz', <CategoryIcon />, 'My Biz', true)}
                {renderMenuItem('/admin/category/mytv', <CategoryIcon />, 'My TV', true)}
                {renderMenuItem('/admin/category/myneedy', <CategoryIcon />, 'My Needy', true)}
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
            {renderMenuItem('/admin/corporate-login', <BusinessIcon />, 'Corporate Login')}
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
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default AdminSidebar;