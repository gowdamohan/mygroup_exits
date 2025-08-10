
import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { PhotoLibrary } from '@mui/icons-material';

const AdminGalleries: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <PhotoLibrary sx={{ mr: 2 }} />
        Galleries Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Media Galleries Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This section will handle image galleries, photo albums, 
                and media content organization.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminGalleries;
