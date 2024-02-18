import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import {
  Box,
  Divider,
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Slide,
} from '@mui/material';

import { useLocation } from "wouter";

export default function NavigationDrawer({ open, toggleDrawer }) {
  const theme = useTheme();

  const [location, setLocation] = useLocation();
  const [subMenu, setSubMenu] = useState(false);
  
  const mainMenuItems = [
    {
      label: 'Home',
      icon: <Icon>terrain</Icon>,
      path: '/'
    },
    {
      label: 'Control panel',
      icon: <Icon>tune</Icon>,
      path: '/control-panel'
    },
    {
      label: 'Heater',
      icon: <Icon>whatshot</Icon>,
      path: '/heater'
    },
    {
      label: 'Monitor',
      icon: <Icon>query_stats</Icon>,
      path: '/monitor'
    },
    {
      label: 'Security',
      icon: <Icon>security</Icon>,
      path: '/security'
    },
    {
      label: 'Settings',
      icon: <Icon>settings</Icon>,
      path: '/settings',
      subMenuItems: [
        {
          type: 'subheader',
          label: 'General'
        },
        {
          label: 'Appearance',
          icon: <Icon>palette</Icon>,
          path: '/settings/general#appearance'
        },
        {
          label: 'Devices',
          icon: <Icon>usb</Icon>,
          path: '/settings/general#devices'
        },
        {
          label: 'Weather and maps',
          icon: <Icon>map</Icon>,
          path: '/settings/general#weather-and-maps'
        },
        {
          label: 'Voice assistant',
          icon: <Icon>settings_voice</Icon>,
          path: '/settings/general#voice-assistant'
        },
        {
          label: 'Notifications',
          icon: <Icon>notifications_active</Icon>,
          path: '/settings/general#notifications'
        },
        {
          label: 'Remote access',
          icon: <Icon>devices</Icon>,
          path: '/settings/general#cloudflare'
        },
        {
          label: 'Cloud sync',
          icon: <Icon>cloud_upload</Icon>,
          path: '/settings/general#nextcloud'
        },

        {
          type: 'subheader',
          label: 'Switches'
        },
        {
          label: 'Control panel',
          icon: <Icon>grid_view</Icon>,
          path: '/settings/switch-groups'
        },
        {
          label: 'Relays',
          icon: <Icon>toggle_on</Icon>,
          path: '/settings/relays'
        },
        {
          label: 'WiFi relays',
          icon: <Icon>toggle_on</Icon>,
          path: '/settings/wifi-relays'
        },
        {
          label: 'Mode switches',
          icon: <Icon>toggle_on</Icon>,
          path: '/settings/mode-switches'
        },
        {
          label: 'Action switches',
          icon: <Icon>double_arrow</Icon>,
          path: '/settings/action-switches'
        },

        {
          type: 'subheader',
          label: 'Power'
        },
        {
          label: 'Batteries',
          icon: <Icon>bolt</Icon>,
          path: '/settings/batteries'
        },
        {
          label: 'Solar charge controllers',
          icon: <Icon>solar_power</Icon>,
          path: '/settings/solar-charge-controllers'
        },

        {
          type: 'subheader',
          label: 'Water'
        },
        {
          label: 'Water tanks',
          icon: <Icon>water</Icon>,
          path: '/settings/water-tanks'
        },

        {
          type: 'subheader',
          label: 'Temperature'
        },
        {
          label: 'Heaters',
          icon: <Icon>whatshot</Icon>,
          path: '/settings/heaters'
        },
        {
          label: 'Temperature sensors',
          icon: <Icon>thermostat</Icon>,
          path: '/settings/temperature-sensors'
        },

        {
          type: 'subheader',
          label: 'Security'
        },
        {
          label: 'Security alarm',
          icon: <Icon>security</Icon>,
          path: '/settings/security-alarm'
        },
        {
          label: 'Cameras',
          icon: <Icon>camera</Icon>,
          path: '/settings/cameras'
        },
        {
          type: 'subheader',
          label: 'Other'
        },
        {
          label: 'Sensors',
          icon: <Icon>sensors</Icon>,
          path: '/settings/sensors'
        }
      ]
    },
  ];

  const [menuItems, setMenuItems] = useState(mainMenuItems);

  const handleClick = ({ path, subMenuItems }) => {
    if(subMenuItems) {
      setSubMenu(true);
      setMenuItems(subMenuItems);
    } else {
      toggleDrawer(false);
      setLocation(path);
    }
  };

  const handleSubMenuClose = () => {
    setMenuItems(mainMenuItems);
    setSubMenu(false);
  }

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      <List sx={subMenu ? { padding: 0 } : {}}>
        {
          subMenu && (
            <Box>

              <ListItem 
                disablePadding
                sx={{ 
                  backgroundColor: theme.palette.grey[100], 
                  pt: '8px' 
                }}
              >
                <ListItemButton onClick={handleSubMenuClose}>
                  <ListItemIcon>
                    <Icon>arrow_back</Icon>
                  </ListItemIcon>
                  <ListItemText primary="Main menu" sx={{ color: theme.palette.text.secondary }} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </Box>
          )
        }
        {menuItems.map(({type, label, icon, path, subMenuItems}) => {
          if(type === 'divider') {
            return <Divider />
          } else if(type === 'subheader') {
            return (
              <Box>
                <Divider />
                <ListSubheader sx={{ backgroundColor: theme.palette.grey[100] }}>
                  {label}
                </ListSubheader>
              </Box>
            )
          } else {
            return (
              <ListItem key={label} disablePadding>
                <ListItemButton onClick={() => handleClick({ path, subMenuItems })}>
                  <ListItemIcon>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            )
          }
        })}
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor={'left'}
      open={open}
      onClose={() => toggleDrawer(false)}
    >
      <Slide
        key={`${subMenu ? 'sub-' : ''}menu`} 
        direction={subMenu ? 'left' : 'right'}
        in={true}
      >
        {list()}
      </Slide>
    </Drawer>
  );
}