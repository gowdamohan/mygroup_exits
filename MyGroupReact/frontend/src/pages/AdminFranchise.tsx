
import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { Business } from '@mui/icons-material';

const AdminFranchise: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Business sx={{ mr: 2 }} />
        Franchise Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Franchise Management System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This section will handle franchise applications, branch office management, 
                corporate login details, and franchise operations.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminFranchise;
