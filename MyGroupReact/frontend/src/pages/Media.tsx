
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
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
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Fab,
  Avatar,
  Divider,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Radio as RadioIcon,
  Tv as TvIcon,
  YouTube as YouTubeIcon,
  Language as WebIcon,
  Article as MagazineIcon,
  Description as EPaperIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface MediaItem {
  id: number;
  title: string;
  description: string;
  media_type: 'tv' | 'radio' | 'youtube' | 'web' | 'magazine' | 'epaper';
  media_url: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  created_by: number;
  created_at: string;
  is_public: boolean;
  is_featured: boolean;
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
      id={`media-tabpanel-${index}`}
      aria-labelledby={`media-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const Media: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [filterType, setFilterType] = useState('');

  const [newMedia, setNewMedia] = useState({
    title: '',
    description: '',
    media_type: 'tv' as 'tv' | 'radio' | 'youtube' | 'web' | 'magazine' | 'epaper',
    media_url: '',
    is_public: true
  });

  const mediaTypes = [
    { value: 'tv', label: 'My TV', icon: <TvIcon />, color: '#1976d2' },
    { value: 'radio', label: 'My Radio', icon: <RadioIcon />, color: '#388e3c' },
    { value: 'youtube', label: 'YouTube', icon: <YouTubeIcon />, color: '#d32f2f' },
    { value: 'web', label: 'Web News', icon: <WebIcon />, color: '#f57c00' },
    { value: 'magazine', label: 'Magazine', icon: <MagazineIcon />, color: '#7b1fa2' },
    { value: 'epaper', label: 'E-Paper', icon: <EPaperIcon />, color: '#5d4037' }
  ];

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const response = await api.get('/media');
      setMediaItems(response.data);
    } catch (error) {
      console.error('Failed to fetch media items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateMedia = async () => {
    try {
      const response = await api.post('/media', newMedia);
      setMediaItems([response.data, ...mediaItems]);
      setCreateDialogOpen(false);
      setNewMedia({
        title: '',
        description: '',
        media_type: 'tv',
        media_url: '',
        is_public: true
      });
    } catch (error) {
      console.error('Failed to create media:', error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, media: MediaItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedMedia(media);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMedia(null);
  };

  const getMediaTypeIcon = (type: string) => {
    const mediaType = mediaTypes.find(mt => mt.value === type);
    return mediaType ? mediaType.icon : <TvIcon />;
  };

  const getMediaTypeColor = (type: string) => {
    const mediaType = mediaTypes.find(mt => mt.value === type);
    return mediaType ? mediaType.color : '#1976d2';
  };

  const filteredMedia = mediaItems.filter(media => {
    if (!filterType) return true;
    return media.media_type === filterType;
  });

  const renderMediaCard = (media: MediaItem) => (
    <Card key={media.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={media.thumbnail || '/assets/default-media.png'}
        alt={media.title}
        sx={{ position: 'relative' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="h2" noWrap>
            {media.title}
          </Typography>
          <IconButton size="small" onClick={(e) => handleMenuClick(e, media)}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Avatar
            sx={{ 
              width: 24, 
              height: 24, 
              bgcolor: getMediaTypeColor(media.media_type),
              fontSize: '12px'
            }}
          >
            {getMediaTypeIcon(media.media_type)}
          </Avatar>
          <Chip
            label={mediaTypes.find(mt => mt.value === media.media_type)?.label}
            size="small"
            sx={{ bgcolor: getMediaTypeColor(media.media_type), color: 'white' }}
          />
          {media.is_featured && (
            <Chip label="Featured" size="small" color="warning" />
          )}
        </Box>

        <Typography variant="body2" color="textSecondary" paragraph>
          {media.description}
        </Typography>

        <Box display="flex" justify-content="space-between" alignItems="center" mt={2}>
          <Box display="flex" gap={2}>
            <Typography variant="caption" color="textSecondary">
              {media.views} views
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {media.likes} likes
            </Typography>
          </Box>
          {media.duration && (
            <Typography variant="caption" color="textSecondary">
              {media.duration}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small" startIcon={<PlayIcon />}>
          Play
        </Button>
        <Button size="small" startIcon={<ShareIcon />}>
          Share
        </Button>
        <Button size="small" startIcon={<DownloadIcon />}>
          Download
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          My Media
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          size="large"
        >
          Add Media
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="media tabs">
          <Tab label="All Media" />
          <Tab label="My Content" />
          <Tab label="Featured" />
          <Tab label="Categories" />
        </Tabs>
      </Paper>

      {/* Media Type Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="body2" color="textSecondary">
            Filter by type:
          </Typography>
          <Button
            variant={!filterType ? "contained" : "outlined"}
            size="small"
            onClick={() => setFilterType('')}
          >
            All
          </Button>
          {mediaTypes.map((type) => (
            <Button
              key={type.value}
              variant={filterType === type.value ? "contained" : "outlined"}
              size="small"
              startIcon={type.icon}
              onClick={() => setFilterType(type.value)}
              sx={{
                bgcolor: filterType === type.value ? type.color : 'transparent',
                borderColor: type.color,
                color: filterType === type.value ? 'white' : type.color,
                '&:hover': {
                  bgcolor: type.color,
                  color: 'white'
                }
              }}
            >
              {type.label}
            </Button>
          ))}
        </Box>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {filteredMedia.map((media) => (
            <Grid item xs={12} md={6} lg={4} key={media.id}>
              {renderMediaCard(media)}
            </Grid>
          ))}
          {filteredMedia.length === 0 && (
            <Grid item xs={12}>
              <Box textAlign="center" py={8}>
                <TvIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No media content found
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={3}>
                  Start creating your media content to engage your audience.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Add Media Content
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          My Media Content
        </Typography>
        {/* Content for user's own media */}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Featured Content
        </Typography>
        {/* Content for featured media */}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>
          Media Categories
        </Typography>
        {/* Content for media categories */}
      </TabPanel>

      {/* Create Media Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Media Content</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newMedia.title}
                onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Media Type</InputLabel>
                <Select
                  value={newMedia.media_type}
                  onChange={(e) => setNewMedia({ ...newMedia, media_type: e.target.value as any })}
                  label="Media Type"
                  required
                >
                  {mediaTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {type.icon}
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Media URL"
                value={newMedia.media_url}
                onChange={(e) => setNewMedia({ ...newMedia, media_url: e.target.value })}
                placeholder="https://..."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newMedia.description}
                onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Visibility</InputLabel>
                <Select
                  value={newMedia.is_public ? 'public' : 'private'}
                  onChange={(e) => setNewMedia({ ...newMedia, is_public: e.target.value === 'public' })}
                  label="Visibility"
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateMedia}
            variant="contained"
            disabled={!newMedia.title || !newMedia.media_url || !newMedia.media_type}
          >
            Add Media
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Actions Menu */}
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
          <ListItemText>Edit Content</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
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

export default Media;
