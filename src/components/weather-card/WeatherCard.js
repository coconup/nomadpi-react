import ReactWeather, { useOpenWeather } from 'react-open-weather';

import { useState } from 'react';
import Box from '@mui/material/Box';
// import {WeatherWidget} from '@daniel-szulc/react-weather-widget';
import WeatherForecast from '../weather-forecast/WeatherForecast';

export default function WeatherCard() {
  const apiKey = '908ad75f36452c11ff4306cd53162218';

  const { data, isLoading, errorMessage } = useOpenWeather({
    key: apiKey,
    lat: '48.137154',
    lon: '11.576124',
    lang: 'en',
    unit: 'metric', // values are (metric, standard, imperial)
  });
  
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
      onClick={handleWeatherForecastOpen}
    >
      <ReactWeather
        isLoading={isLoading}
        errorMessage={errorMessage}
        data={data}
        lang="en"
        // locationLabel="Munich"
        unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
        showForecast
      />
      <WeatherForecast 
        open={state.weatherForecastOpen}
        onClose={handleWeatherForecastClose}
        apiKey={apiKey}
      />
    </Box>
  );
};