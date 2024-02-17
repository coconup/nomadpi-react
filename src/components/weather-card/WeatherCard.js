import ReactWeather, { useOpenWeather } from 'react-open-weather';

import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import { selectGpsState } from '../../app/store';

import {
  Box,
  Paper,
  Icon
} from '@mui/material';

import WeatherForecast from '../weather-forecast/WeatherForecast';

export default function WeatherCard() {
  const theme = useTheme();

  const apiKey = '908ad75f36452c11ff4306cd53162218';

  const gpsState = useSelector(selectGpsState);

  const [state, setState] = useState({
    weatherForecastOpen: false
  });

  const {
    latitude,
    longitude
  } = state;

  if(gpsState.latitude && !latitude) {
    setState({
      ...state,
      latitude: gpsState.latitude,
      longitude: gpsState.longitude
    })
  };

  const { data, isLoading, errorMessage } = useOpenWeather({
    key: apiKey,
    lat: latitude,
    lon: longitude,
    lang: 'en',
    unit: 'metric', // values are (metric, standard, imperial)
  });

  if(!latitude || errorMessage) {
    return (
      <Paper
        sx={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '408px'
        }}
      >
        <Icon
          sx={{
            fontSize: 72,
            color: theme.palette.grey[400]
          }}
        >
          cloud_off
        </Icon>
      </Paper>
    )
  } else {
    const handleWeatherForecastOpen = () => {
      if(!state.weatherForecastOpen) {
        setState({...state, weatherForecastOpen: true});
      }
    };

    const handleWeatherForecastClose = () => {
      setState({...state, weatherForecastOpen: false});
    }

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
      <Box onClick={handleWeatherForecastOpen}>
        <ReactWeather
          // locationLabel="Munich"
          theme={customStyles}
          isLoading={isLoading}
          errorMessage={errorMessage}
          data={data}
          lang="en"
          unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
          showForecast
        />
        <WeatherForecast 
          open={state.weatherForecastOpen}
          onClose={handleWeatherForecastClose}
          apiKey={apiKey}
        />
      </Box>
    )
  }
};