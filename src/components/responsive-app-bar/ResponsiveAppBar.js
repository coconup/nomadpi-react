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

import { selectSetting } from '../../app/store';
import { useSelector } from 'react-redux';

import NavigationDrawer from '../navigation-drawer/NavigationDrawer';
import VoiceAssistantToggle from '../voice-assistant/VoiceAssistantToggle';

function ResponsiveAppBar() {
  const displayNameSetting = useSelector(selectSetting('appearance_display_name')) || {};
  const displayName = displayNameSetting.value || '';

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
    <AppBar
      position="static"
      sx={{ pt: "env(safe-area-inset-top)" }}
    >
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
            <Typography sx={{ fontFamily: 'Honk', fontSize: '42px' }}>{ displayName }</Typography>
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