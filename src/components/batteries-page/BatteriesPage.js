import { useState } from 'react';

import {
  Box,
  ButtonBase,
  Unstable_Grid2 as Grid
} from '@mui/material';

import Container from '../ui/Container';

import BatteryPage from '../battery-page/BatteryPage';

import { useGetBatteriesQuery } from '../../apis/van-pi/vanpi-app-api';

export default function BatteriesPage({ compact=false }) {
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
      selectedBattery: apiBatteries.data[0],
      init: true
    });
  };

  const {
    batteries,
    selectedBattery
  } = state;

  const selectNextBattery = () => {
    let nextIndex = batteries.indexOf(selectedBattery) + 1;
    if(nextIndex > batteries.length - 1) nextIndex = 0;

    setState({
      ...state,
      selectedBattery: batteries[nextIndex]
    })
  };

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if(isSuccess && state.init) {
    if(compact) {
      return (
        <Box onClick={selectNextBattery}>
          <ButtonBase sx={{width: '100%'}}>
            <BatteryPage
              compact
              battery={selectedBattery}
            />
          </ButtonBase>
        </Box>
      )
    } else {
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
    }
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