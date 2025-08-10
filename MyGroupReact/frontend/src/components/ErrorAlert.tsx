
import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorAlertProps {
  error: string | null;
  title?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  onClose?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  title = 'Error',
  severity = 'error',
  onClose
}) => {
  if (!error) return null;

  return (
    <Box mb={2}>
      <Alert severity={severity} onClose={onClose}>
        <AlertTitle>{title}</AlertTitle>
        {error}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
