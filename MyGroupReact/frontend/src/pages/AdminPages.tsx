
import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { Pages } from '@mui/icons-material';

const AdminPages: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Pages sx={{ mr: 2 }} />
        Pages Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Static Pages Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This section will handle about us, contact us, terms & conditions, 
                privacy policy, and other static pages.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPages;
