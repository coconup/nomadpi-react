import { useState } from 'react';

import {
  Box,
  Unstable_Grid2 as Grid
} from '@mui/material';

import Container from '../ui/Container';

import BatteryPage from '../battery-page/BatteryPage';

import { useGetBatteriesQuery } from '../../apis/van-pi/vanpi-app-api';

export default function BatteriesPage() {
  const initialState = {
    batteries: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiBatteries = useGetBatteriesQuery();

  const isLoading = apiBatteries.isLoading;
  const isFetching = apiBatteries.isFetching;
  const isSuccess = apiBatteries.isSuccess;
  const isError = apiBatteries.isError;
  const error = apiBatteries.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      batteries: apiBatteries.data,
      init: true
    });
  };

  const { batteries } = state;

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if(isSuccess && state.init) {
    content = batteries.map(battery => (
      <Grid 
        key={battery.key}
        xs={12}
        sm={8}
        md={6}
        // lg={4}
      >
        <BatteryPage
          battery={battery}
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
      spacing={4}
      sx={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      {content}
    </Grid>
  );
}