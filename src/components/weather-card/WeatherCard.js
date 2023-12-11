import { useState } from 'react';
import Box from '@mui/material/Box';
import {WeatherWidget} from '@daniel-szulc/react-weather-widget';
import WeatherForecast from '../weather-forecast/WeatherForecast';

export default function WeatherCard() {
  const apiKey = '908ad75f36452c11ff4306cd53162218';
  
  const [state, setState] = useState({
    weatherForecastOpen: false
  });

  const handleWeatherForecastOpen = () => {
    if(!state.weatherForecastOpen) {
      setState({...state, weatherForecastOpen: true});
    }
  };

  const handleWeatherForecastClose = () => {
    setState({...state, weatherForecastOpen: false});
  }

  return (
    <Box
      sx={{
        padding: 3,
        fontFamily: 'courier',
        '& .daniel-szulc-weather-widget': {
          '& .weather-widget': {
            '& .background': {
              borderRadius: '10px',
            },
            '& *': {
              fontFamily: 'Roboto'
            }
          }
        }
      }}
      onClick={handleWeatherForecastOpen}
    >
      <WeatherWidget
        autoLocate="gps"
        provider="openWeather"
        apiKey={apiKey}
      />
      <WeatherForecast 
        open={state.weatherForecastOpen}
        onClose={handleWeatherForecastClose}
        apiKey={apiKey}
      />
    </Box>
  );
};