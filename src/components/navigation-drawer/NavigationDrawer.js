import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TerrainIcon from '@mui/icons-material/Terrain';
import TuneIcon from '@mui/icons-material/Tune';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';

import { useLocation } from "wouter";

export default function NavigationDrawer({ open, toggleDrawer }) {
  const [location, setLocation] = useLocation();
  
  const menuItems = [
    {
      label: 'Home',
      icon: <TerrainIcon />,
      path: '/home'
    },
    {
      label: 'Control panel',
      icon: <TuneIcon />,
      path: '/control-panel'
    },
    {
      label: 'Heater',
      icon: <WhatshotIcon />,
      path: '/heater'
    },
    {
      label: 'Monitor',
      icon: <QueryStatsIcon />,
      path: '/monitor'
    },
    {
      label: 'Security',
      icon: <SecurityIcon />,
      path: '/security'
    },
    {
      label: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings'
    },
  ]

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map(({label, icon, path}) => (
          <ListItem key={label} disablePadding>
            <ListItemButton onClick={() => setLocation(path)}>
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/*<Divider />*/}
    </Box>
  );

  return (
    <Drawer
      anchor={'left'}
      open={open}
      onClose={toggleDrawer(false)}
    >
      {list()}
    </Drawer>
  );
}