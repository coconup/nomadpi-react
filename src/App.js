import React, { useState } from 'react';
import logo from './logo.svg';
import store from "./app/store";
import './App.css';

import { Route, Redirect } from "wouter";
import { useSelector } from 'react-redux'

import Box from '@mui/material/Box';

import LoginForm from './components/login-form/LoginForm';
import ResponsiveAppBar from './components/responsive-app-bar/ResponsiveAppBar';
import HomePanel from './components/home-panel/HomePanel';
import SwitchGroupsPage from './components/switch-groups-page/SwitchGroupsPage';
import SettingsPage from './components/settings-page/SettingsPage';
import MonitorPage from './components/monitor-page/MonitorPage';
import DayNightIndicator from './components/day-night-indicator/DayNightIndicator';
import WeatherForecast from './components/weather-forecast/WeatherForecast';

import { useLoginMutation, useCheckAuthStatusQuery } from './apis/van-pi/vanpi-app-api';

import { ThemeProvider } from '@mui/material/styles';
import theme from './app/theme';

function App() {
  const [state, setState] = useState({
    nightMode: false,
    init: false
  });

  const { loggedIn } = useSelector(state => state.auth);

  useCheckAuthStatusQuery();

  const handleNightModeChange = (isNight) => {
    console.log(`Night mode is ${isNight ? 'on' : 'off'}`);
    if(state.nightMode !== isNight) {
      setState({...state, nightMode: isNight});  
    }
  };

  const [
    loginTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useLoginMutation();

  const onLoginSubmit = (credentials) => {
    const apiLogin = loginTrigger(credentials);
  };

  let content;
  
  if(loggedIn === false) {
    content = <LoginForm onSubmit={onLoginSubmit}/>;
  } else {
    content = (
      <Box sx={{height: '100%'}}>
        <ResponsiveAppBar />
        <Route path="/home"><HomePanel /></Route>
        <Route path="/weather">
          <WeatherForecast />
        </Route>
        <Route path="/control-panel"><SwitchGroupsPage /></Route>
        <Route path="/monitor"><MonitorPage /></Route>
        <Route path="/settings"><SettingsPage /></Route>
      </Box>
    )
  };

  return (
    <Box 
      className="App"
      sx={{
        backgroundColor: state.nightMode ? 'grey.900' : 'grey.50'
      }}
    >
      <DayNightIndicator
        latitude={52.4823} // Replace with your desired latitude
        longitude={13.4409} // Replace with your desired longitude
        onNightMode={handleNightModeChange}
      />
      <ThemeProvider theme={theme(state.nightMode)}>
        {content}
      </ThemeProvider>
    </Box>
  );
}

export default App;
