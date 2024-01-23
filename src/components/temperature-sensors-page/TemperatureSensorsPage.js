import { useState } from 'react';

import {
  Box,
  ButtonBase,
  Unstable_Grid2 as Grid
} from '@mui/material';

import { useGetTemperatureSensorsQuery } from '../../apis/van-pi/vanpi-app-api';

import Container from '../ui/Container';

import TemperatureSensorPage from '../temperature-sensor-page/TemperatureSensorPage';

export default function TemperatureSensorsPage({ compact=false }) {
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
    content = <div>Loading</div>
  } else if(isSuccess && state.init) {
    if(compact) {
      return (
        
        <Box onClick={selectNextTemperatureSensor}>
          <ButtonBase sx={{width: '100%'}}>
            <TemperatureSensorPage
              compact
              temperatureSensor={selectedTemperatureSensor}
              temperatureState={{ value: 26 }}
            />
          </ButtonBase>
        </Box>
      )
    } else {
      content = temperatureSensors.map(temperatureSensor => (
        <Grid 
          key={temperatureSensor.key}
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <TemperatureSensorPage
            temperatureSensor={selectedTemperatureSensor}
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