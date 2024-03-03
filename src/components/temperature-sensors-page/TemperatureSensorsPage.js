import { useState } from 'react';
import { useLocation } from "wouter";

import {
  Box,
  ButtonBase,
  Card,
  Icon,
  Unstable_Grid2 as Grid
} from '@mui/material';

import { useGetTemperatureSensorsQuery } from '../../apis/nomadpi/nomadpi-app-api';

import Container from '../ui/Container';

import TemperatureSensorPage from '../temperature-sensor-page/TemperatureSensorPage';
import EmptyResourcePage from '../empty-resource-page/EmptyResourcePage';

import Loading from '../ui/Loading';

export default function TemperatureSensorsPage({ compact=false }) {
  const [location, setLocation] = useLocation();
  
  const initialState = {
    temperatureSensors: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  const apiTemperatureSensors = useGetTemperatureSensorsQuery();

  const isLoading = apiTemperatureSensors.isLoading;
  const isFetching = apiTemperatureSensors.isFetching;
  const isSuccess = apiTemperatureSensors.isSuccess;
  const isError = apiTemperatureSensors.isError;
  const error = apiTemperatureSensors.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      temperatureSensors: apiTemperatureSensors.data,
      selectedTemperatureSensor: apiTemperatureSensors.data[0],
      init: true
    });
  };

  const {
    temperatureSensors,
    selectedTemperatureSensor
  } = state;

  const selectNextTemperatureSensor = () => {
    let nextIndex = temperatureSensors.indexOf(selectedTemperatureSensor) + 1;
    if(nextIndex > temperatureSensors.length - 1) nextIndex = 0;

    setState({
      ...state,
      selectedTemperatureSensor: temperatureSensors[nextIndex]
    })
  };

  let content;
  if (isLoading) {
    return <Loading size={40} fullPage />
  } else if(isSuccess && state.init) {
    if(compact) {
      return (
        
        <Box onClick={temperatureSensors.length > 0 ? selectNextTemperatureSensor : () => setLocation("/settings/temperature-sensors")}>
          <ButtonBase sx={{width: '100%'}}>
            {
              selectedTemperatureSensor && (
                <TemperatureSensorPage
                  compact
                  temperatureSensor={selectedTemperatureSensor}
                  temperatureState={{ value: 26 }}
                />
              ) || (
                <Card
                  sx={{
                    flex: 1,
                    height: '150px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Icon sx={{fontSize: 42, color: 'text.disabled'}}>thermostat</Icon>
                </Card>
              )
            }
          </ButtonBase>
        </Box>
      )
    } else {
      if(temperatureSensors.length === 0) {
        return (
          <EmptyResourcePage
            onClick={() => setLocation("/settings/temperature-sensors")}
            buttonLabel='Go to settings'
            icon={'settings'}
          />
        )
      }

      content = temperatureSensors.map(temperatureSensor => (
        <Grid 
          key={temperatureSensor.key}
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <TemperatureSensorPage
            temperatureSensor={temperatureSensor}
            temperatureState={{ value: 26 }}
          />
        </Grid>
      ));
    }
  } else if (isError) {
    const {status, error: message} = error;
    content = <div>{message}</div>
  }

  return (
    <Grid
      container
      spacing={2}
      sx={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      {content}
    </Grid>
  );
}