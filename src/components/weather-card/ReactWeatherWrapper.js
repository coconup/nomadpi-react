import ReactWeather, { useOpenWeather } from 'react-open-weather';

import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import WeatherForecast from '../weather-forecast/WeatherForecast';

export default function ReactWeatherWrapper({ apiKey, latitude: latitudeProp, longitude: longitudeProp }) {
  const theme = useTheme();

  const [state, setState] = useState({});

  const {
    latitude,
    longitude
  } = state;

  if(latitudeProp && !latitude) {
    setState({
      ...state,
      latitude: latitudeProp,
      longitude: longitudeProp
    })
  };

  const { data, isLoading, errorMessage } = useOpenWeather({
    key: apiKey,
    lat: latitude,
    lon: longitude,
    lang: 'en',
    unit: 'metric', // values are (metric, standard, imperial)
  });

  const backgroundColor = theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.primary.light;
  const textColor = '#FFF';

  const customStyles = {
    fontFamily: 'Roboto',
    gradientStart: backgroundColor,
    gradientMid: backgroundColor,
    gradientEnd: backgroundColor,
    locationFontColor: textColor,
    todayTempFontColor: textColor,
    todayDateFontColor: textColor,
    todayRangeFontColor: textColor,
    todayDescFontColor: textColor,
    todayInfoFontColor: textColor,
    todayIconColor: '#FFF',
    forecastBackgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.paper,
    forecastSeparatorColor: '#FFF',
    forecastDateColor: theme.palette.text.primary,
    forecastDescColor: theme.palette.text.primary,
    forecastRangeColor: theme.palette.text.primary,
    forecastIconColor: theme.palette.primary.light,
    containerDropShadow: '0px 1px 1px 0px rgba(50, 50, 50, 0.5)',
  };

  return (
    <ReactWeather
      theme={customStyles}
      isLoading={isLoading}
      errorMessage={errorMessage}
      data={data}
      lang="en"
      unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
      showForecast
    />
  )
};