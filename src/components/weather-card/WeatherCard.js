import ReactWeatherWrapper from './ReactWeatherWrapper';

import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useLocation } from "wouter";

import {
  Box,
  ButtonBase,
  Paper,
  Icon
} from '@mui/material';

import WeatherForecast from '../weather-forecast/WeatherForecast';

export default function WeatherCard({ apiKey, latitude, longitude }) {
  const [location, setLocation] = useLocation();

  const theme = useTheme();

  const [state, setState] = useState({
    weatherForecastOpen: false
  });

  if(!latitude || !apiKey) {
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
        {
          !!apiKey && (
            <Icon
              sx={{
                fontSize: 54,
                color: 'text.disabled'
              }}
            >
              cloud_off
            </Icon>
          ) || (
            <ButtonBase 
              sx={{flexGrow: 1, flex: 1, height: '100%'}}
              onClick={() => setLocation("/settings/weather-and-maps")}
            >
              <Box>
                <Icon
                  sx={{
                    fontSize: 54,
                    color: 'text.disabled'
                  }}
                >
                  wb_sunny
                </Icon>
              </Box>
            </ButtonBase>
          )
        }
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
    
    return (
      <Box onClick={handleWeatherForecastOpen}>
        <ReactWeatherWrapper
          latitude={latitude}
          longitude={longitude}
          apiKey={apiKey}
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