
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import {
  Tv,
  Radio,
  Article,
  YouTube,
  Web,
  MenuBook,
  Edit,
  Delete,
  Add
} from '@mui/icons-material';

const AdminMedia: React.FC = () => {
  const [mediaStats] = useState({
    tv: 15,
    radio: 8,
    newspaper: 12,
    youtube: 25,
    website: 18,
    magazine: 6
  });

  const mediaItems = [
    { id: 1, name: 'MyTV Channel 1', type: 'TV', status: 'active', viewers: 1500 },
    { id: 2, name: 'MyRadio FM', type: 'Radio', status: 'active', viewers: 800 },
    { id: 3, name: 'Daily News', type: 'Newspaper', status: 'active', viewers: 2000 },
    { id: 4, name: 'MyGroup YouTube', type: 'YouTube', status: 'active', viewers: 5000 }
  ];

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'TV': return <Tv />;
      case 'Radio': return <Radio />;
      case 'Newspaper': return <Article />;
      case 'YouTube': return <YouTube />;
      case 'Website': return <Web />;
      case 'Magazine': return <MenuBook />;
      default: return <Article />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Tv sx={{ mr: 2 }} />
        Media Management
      </Typography>

      {/* Media Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={2}>
          <Card sx={{ textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Tv sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{mediaStats.tv}</Typography>
              <Typography variant="body2">TV Channels</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
            <CardContent>
              <Radio sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{mediaStats.radio}</Typography>
              <Typography variant="body2">Radio Stations</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
            <CardContent>
              <Article sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{mediaStats.newspaper}</Typography>
              <Typography variant="body2">Newspapers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ textAlign: 'center', bgcolor: 'error.light', color: 'white' }}>
            <CardContent>
              <YouTube sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{mediaStats.youtube}</Typography>
              <Typography variant="body2">YouTube Channels</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Web sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{mediaStats.website}</Typography>
              <Typography variant="body2">Websites</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <MenuBook sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{mediaStats.magazine}</Typography>
              <Typography variant="body2">Magazines</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Media Items */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Media Items</Typography>
          <Button variant="contained" startIcon={<Add />}>
            Add Media
          </Button>
        </Box>

        <List>
          {mediaItems.map((item) => (
            <ListItem key={item.id} divider>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {getMediaIcon(item.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip label={item.type} size="small" sx={{ mr: 1 }} />
                    <Chip
                      label={item.status}
                      size="small"
                      color={item.status === 'active' ? 'success' : 'default'}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="caption">
                      {item.viewers} viewers
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" sx={{ mr: 1 }}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" color="error">
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default AdminMedia;
