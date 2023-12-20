import React, { useState } from 'react';
import logo from './logo.svg';
import { Route } from "wouter";
import { Counter } from './components/counter/Counter';
import './App.css';
import Box from '@mui/material/Box';

import ResponsiveAppBar from './components/responsive-app-bar/ResponsiveAppBar';
import HomePanel from './components/home-panel/HomePanel';
import SwitchGroupsPage from './components/switch-groups-page/SwitchGroupsPage';
import SettingsPanel from './components/settings-panel/SettingsPanel';
import MonitorPanel from './components/monitor-panel/MonitorPanel';
import DayNightIndicator from './components/day-night-indicator/DayNightIndicator';
import WeatherForecast from './components/weather-forecast/WeatherForecast';

import { ThemeProvider } from '@mui/material/styles';
import theme from './app/theme';

function App() {
  const [state, setState] = useState({
    nightMode: false
  });

  const handleNightModeChange = (isNight) => {
    console.log(`Night mode is ${isNight ? 'on' : 'off'}`);
    if(state.nightMode !== isNight) {
      setState({...state, nightMode: isNight});  
    }
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
        <ResponsiveAppBar />
        <Route path="/home"><HomePanel /></Route>
        <Route path="/weather">
          <WeatherForecast />
        </Route>
        <Route path="/control-panel"><SwitchGroupsPage /></Route>
        <Route path="/monitor"><MonitorPanel /></Route>
        <Route path="/settings"><SettingsPanel /></Route>
      </ThemeProvider>
    </Box>
  );
}

export default App;
