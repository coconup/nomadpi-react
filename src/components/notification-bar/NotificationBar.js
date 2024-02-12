import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  Alert,
  Box,
  Icon,
  IconButton,
  Snackbar,
  useMediaQuery
} from '@mui/material';

import Slide from '@mui/material/Slide';

export default function NotificationBar() {
  const [open, setOpen] = useState(false);
  
  const state = useSelector(state => state.notification_bar) || {};

  const {
    success: successMessage,
    error: errorMessage
  } = state;

  useEffect(() => {
    const {
      success,
      error
    } = state;

    if(success || error) setOpen(true);
  }, [state]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      // TransitionComponent={SlideTransition}
    >
      <Alert 
        onClose={handleClose}
        icon={<Icon>check</Icon>}
        severity={errorMessage ? "error" : "success"}
        variant="filled"
      >
        { errorMessage || successMessage }
      </Alert>
    </Snackbar>
  );
}