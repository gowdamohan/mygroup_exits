
import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { Category } from '@mui/icons-material';

const AdminCategories: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Category sx={{ mr: 2 }} />
        Categories Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Category Management System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This section will handle group categories, labor categories, 
                needy service categories, and other classification systems.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminCategories;
