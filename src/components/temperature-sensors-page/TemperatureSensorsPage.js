import { useState } from 'react';

import {
  Box,
  Unstable_Grid2 as Grid
} from '@mui/material';

import Container from '../ui/Container';

import TemperatureSensorPage from '../temperature-sensor-page/TemperatureSensorPage';

// import {
//   useGetTemperatureSensorsQuery,
//   useGetTemperatureStateQuery
// } from '../../apis/van-pi/vanpi-app-api';

export default function TemperatureSensorsPage() {
  const initialState = {
    temperatureSensors: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  // let apiTemperatureSensors = useGetTemperatureSensorsQuery();

  // OFFLINE editing
  const apiTemperatureSensors = {
    isLoading: false,
    isSuccess: true,
    data: [
      {
        id: 1,
        name: 'Room temperature' 
      },
      {
        id: 2,
        name: 'Outside temperature' 
      }
    ]
  };

  const isLoading = apiTemperatureSensors.isLoading;
  const isFetching = apiTemperatureSensors.isFetching;
  const isSuccess = apiTemperatureSensors.isSuccess;
  const isError = apiTemperatureSensors.isError;
  const error = apiTemperatureSensors.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      temperatureSensors: apiTemperatureSensors.data,
      init: true
    });
  };

  const { temperatureSensors } = state;

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if(isSuccess && state.init) {
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