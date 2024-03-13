import { Children, cloneElement, useState, useEffect } from 'react';
import { isPlatform } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import axios from 'axios';

import { Router, Route, Switch, Redirect } from "wouter";
import { useSelector, useDispatch } from 'react-redux';

import { selectSetting } from './app/store';
import { selectApiBaseUrl } from './app/store';
import store from './app/store';

import {
  Box,
  Button,
  Icon,
  useMediaQuery,
  Typography
} from '@mui/material';

import AppStateProvider from './components/app-state-provider/AppStateProvider';
import MobileInitScreen from './components/mobile-init-screen/MobileInitScreen';
import DayNightIndicator from './components/day-night-indicator/DayNightIndicator';

import Loading from './components/ui/Loading';
import Container from './components/ui/Container';

import { ThemeProvider } from '@mui/material/styles';
import theme from './app/theme';

function Init({ children }) {
  const dispatch = useDispatch();

  const apiBaseUrl = useSelector(selectApiBaseUrl).http;
  
  const primaryColorSetting = useSelector(selectSetting('appearance_primary_color'));
  const { value: primaryColor } = primaryColorSetting || { value: '#e9724c' };

  const urlParams = new URLSearchParams(window.location.search);
  const [demo] = useState(!!urlParams.get('demo'));
  
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [nightMode, setNightMode] = useState(prefersDarkMode);

  const [showInitScreen, setShowInitScreen] = useState(false);

  const [localHostname, setLocalHostname] = useState(null);
  const [remoteHostname, setRemoteHostname] = useState(null);

  const [localHostnameReachable, setLocalHostnameReachable] = useState(null);
  const [remoteHostnameReachable, setRemoteHostnameReachable] = useState(null);

  const setApiBaseUrlAction = (value) => {
    return {
      type: 'SET_API_BASE_URL',
      payload: value
    };
  };

  const resetState = () => {
    setLocalHostname(null);
    setRemoteHostname(null);
    setLocalHostnameReachable(null);
    setRemoteHostnameReachable(null);
    dispatch(setApiBaseUrlAction(null));
  };

  useEffect(() => {
    if(isPlatform('mobile')) {
      const fetchPreferences = async () => {
        const { value: localHostnamePref } = await Preferences.get({ key: 'local-hostname' });
        const { value: remoteHostnamePref } = await Preferences.get({ key: 'remote-hostname' });
        if(!localHostnamePref) {
          setShowInitScreen(true);
        } else {
          setLocalHostname(localHostnamePref);
          setRemoteHostname(remoteHostnamePref || '');
        }
      };

      fetchPreferences();
    } else {
      const { 
        protocol,
        hostname
      } = window.location;

      const raspberryPiHostname = process.env.REACT_APP_RPI_HOSTNAME || 'nomadpi.local';

      if([raspberryPiHostname, 'localhost', '0.0.0.0'].includes(hostname)) {
        setLocalHostname(raspberryPiHostname)
      } else if (protocol === 'https:') {
        const host = hostname.split('.').slice(1).join('.');
        setRemoteHostname(host);
      };
    }
  }, [showInitScreen, localHostname, remoteHostname]);

  useEffect(() => {
    const checkLocalHostStatus = async () => {
      try {
        const response = await axios.get(`http://${localHostname}:3001/status`, { timeout: 3000 });
        if(response.status === 200) {
          setLocalHostnameReachable(true);
          return;
        }
      } catch(err) {}
      setLocalHostnameReachable(false);
    };

    const checkRemoteHostStatus = async () => { 
      if(remoteHostname) { 
        try {
          const response = await axios.get(`https://api.${remoteHostname}/status`, { timeout: 3000 });
          if(response.status === 200) {
            setRemoteHostnameReachable(true);
            return;
          }
        } catch(err) {}
      }
      setRemoteHostnameReachable(false);
    };

    if(localHostname !== null) checkLocalHostStatus();
    if(remoteHostname !== null) checkRemoteHostStatus();
  }, [localHostname, remoteHostname]);

  useEffect(() => {
    if(localHostnameReachable) {
      dispatch(setApiBaseUrlAction(`http://${localHostname || 'localhost'}:3001`));
    } else if (remoteHostnameReachable) {
      dispatch(setApiBaseUrlAction(`https://api.${remoteHostname}`));
    }
  }, [localHostnameReachable, remoteHostnameReachable]);

  const handleNightModeChange = (isNight) => {
    if(nightMode !== isNight) {
      console.log(`Night mode is ${isNight ? 'on' : 'off'}`);
      setNightMode(isNight);  
    }
  };

  let content;
  if(showInitScreen) {
    content = (
      <MobileInitScreen
        onSave={() => setShowInitScreen(false)}
      />
    )
  } else if (localHostnameReachable === false && remoteHostnameReachable === false) {
    content = (
      <Container sx={{ pt: 'env(safe-area-inset-top)' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon sx={{ fontSize: 64, color: 'text.disabled' }}>cloud_off</Icon>
          <Typography
            variant="h6"
            sx={{ mt: '20px' }}
          >
            nomadPi cannot be reached :(
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              mt: '20px',
              mb: '20px'
            }}
          >
            The following hostnames could not be reached:
          </Typography>
          {
            localHostname && (
              <Typography variant="body2" color="text.secondary">{localHostname}</Typography>
            )
          }
          {
            remoteHostname && (
              <Typography variant="body2" color="text.secondary">{remoteHostname}</Typography>
            )
          }
          <Typography
            sx={{
              textAlign: 'center',
              mt: '20px'
            }}
          >
            If connecting locally, make sure you are using the same WiFi network as the nomadPi.
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              mt: '20px'
            }}
          >
            If the location of your nomadPi has changed, update the settings by clicking the button below.
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              mt: '20px'
            }}
          >
            If you believe this is a mistake, click on Retry.
          </Typography>
          <Box sx={{ margin: '20px', maxWidth: '400px' }}>
            <Button
              sx={{ width: '100%' }}
              variant="contained"
              startIcon={<Icon>replay</Icon>}
              onClick={resetState}
            >
              Retry
            </Button>
            <Button
              sx={{ mt: '20px', width: '100%' }}
              variant="contained"
              startIcon={<Icon>settings</Icon>}
              onClick={() => setShowInitScreen(true)}
            >
              Connection settings
            </Button>
          </Box>
        </Box>
      </Container>
    )
  } else if(apiBaseUrl) {
    if(!primaryColorSetting) {
      content = (
        <Box>
          <AppStateProvider />
          <Loading size={40} fullPage />
        </Box>
      )
    } else {
      content = Children.map(children, (child) => {
        return cloneElement(child, { onReset: resetState });
      });
    }
  } else {
    return <Loading size={40} fullPage />
  }

  return (
    <ThemeProvider
      theme={theme({
        nightMode,
        primaryColor
      })}
    >
      <AppStateProvider />
      {
        !prefersDarkMode && (
          <DayNightIndicator
            onNightMode={handleNightModeChange}
          />
        )
      }
      <Box 
        className="App"
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        {content}
      </Box>
    </ThemeProvider>
  )
}

export default Init;