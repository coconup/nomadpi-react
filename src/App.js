import { useState } from 'react';
import logo from './logo.svg';
import store from "./app/store";

import { Route } from "wouter";
import { useSelector } from 'react-redux';

import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

import LoginForm from './components/login-form/LoginForm';
import ResponsiveAppBar from './components/responsive-app-bar/ResponsiveAppBar';
import HomePanel from './components/home-panel/HomePanel';
import SwitchGroupsPage from './components/switch-groups-page/SwitchGroupsPage';
import SettingsPage from './components/settings-page/SettingsPage';
import MonitorPage from './components/monitor-page/MonitorPage';
import HeatersPage from './components/heaters-page/HeatersPage';
import DayNightIndicator from './components/day-night-indicator/DayNightIndicator';
import WeatherForecast from './components/weather-forecast/WeatherForecast';

import { useLoginMutation, useCheckAuthStatusQuery } from './apis/van-pi/vanpi-app-api';

import { ThemeProvider } from '@mui/material/styles';
import theme from './app/theme';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [state, setState] = useState({
    nightMode: prefersDarkMode,
    init: false
  });

  const [
    loginTrigger, 
    loginResponse
  ] = useLoginMutation();

  const { loggedIn } = useSelector(state => state.auth);

  useCheckAuthStatusQuery();

  const handleNightModeChange = (isNight) => {
    console.log(`Night mode is ${isNight ? 'on' : 'off'}`);
    if(state.nightMode !== isNight) {
      setState({...state, nightMode: isNight});  
    }
  };

  const onLoginSubmit = (credentials) => {
    const apiLogin = loginTrigger(credentials);
  };

  let content;
  
  if(loggedIn === false) {
    content = <LoginForm onSubmit={onLoginSubmit}/>;
  } else {
    content = (
      <Box 
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
        <ResponsiveAppBar />
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex'
          }}
        >
          <Route path="/home"><HomePanel /></Route>
          <Route path="/weather">
            <WeatherForecast />
          </Route>
          <Route path="/control-panel"><SwitchGroupsPage /></Route>
          <Route path="/monitor"><MonitorPage /></Route>
          <Route path="/settings"><SettingsPage /></Route>
          <Route path="/heater"><HeatersPage /></Route>
        </Box>
      </Box>
    )
  };

  return (
    <ThemeProvider theme={theme(state.nightMode)}>
      {
        !prefersDarkMode && (
          <DayNightIndicator
            latitude={52.4823}
            longitude={13.4409}
            onNightMode={handleNightModeChange}
          />
        )
      }
      <Box 
        className="App"
        sx={{
          backgroundColor: 'background.paper'
        }}
      >
        {content}
      </Box>
    </ThemeProvider>
  );
}

export default App;
