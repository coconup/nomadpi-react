import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Icon,
  Container,
  MenuItem,
} from '@mui/material';

import NavigationDrawer from '../navigation-drawer/NavigationDrawer';
import VoiceAssistantToggle from '../voice-assistant/VoiceAssistantToggle';

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [state, setState] = useState({
    open: false
  });

  const toggleDrawer = (open) => {
    setState({ ...state, open });
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <NavigationDrawer 
            open={state.open} 
            toggleDrawer={toggleDrawer}
          />
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1
          }}>
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => toggleDrawer(true)}
              >
                <Icon>menu</Icon>
              </IconButton>
            </Box>
            <img 
              src={process.env.PUBLIC_URL + '/vanpi_logo.png'}
              height='64'
            />
          </Box>
          {/*<Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Van name
          </Typography>*/}
          <Box>
            <VoiceAssistantToggle />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;