import { useState } from 'react';

import {
  Box,
  ButtonBase,
  Unstable_Grid2 as Grid
} from '@mui/material';

import Container from '../ui/Container';
import Loading from '../ui/Loading';

import SolarChargeControllerPage from '../solar-charge-controller-page/SolarChargeControllerPage';

import { useGetSolarChargeControllersQuery } from '../../apis/nomadpi/nomadpi-app-api';

export default function SolarChargeControllersPage({ compact=false }) {
  const initialState = {
    solarChargeControllers: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiSolarChargeControllers = useGetSolarChargeControllersQuery();

  const isLoading = apiSolarChargeControllers.isLoading;
  const isFetching = apiSolarChargeControllers.isFetching;
  const isSuccess = apiSolarChargeControllers.isSuccess;
  const isError = apiSolarChargeControllers.isError;
  const error = apiSolarChargeControllers.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      solarChargeControllers: apiSolarChargeControllers.data,
      selectedSolarChargeController: apiSolarChargeControllers.data[0],
      init: true
    });
  };

  const {
    solarChargeControllers,
    selectedSolarChargeController
  } = state;

  const selectNextSolarChargeController = () => {
    let nextIndex = solarChargeControllers.indexOf(selectedSolarChargeController) + 1;
    if(nextIndex > solarChargeControllers.length - 1) nextIndex = 0;

    setState({
      ...state,
      selectedSolarChargeController: solarChargeControllers[nextIndex]
    })
  };

  let content;
  if (isLoading) {
    return <Loading size={40} fullPage />
  } else if(isSuccess && state.init) {
    if(compact) {
      if(!selectedSolarChargeController) return null;

      return (
        <Box onClick={selectNextSolarChargeController}>
          <ButtonBase sx={{width: '100%'}}>
            <SolarChargeControllerPage
              compact
              solarChargeController={selectedSolarChargeController}
            />
          </ButtonBase>
        </Box>
      )
    } else {
      content = solarChargeControllers.map(solarChargeController => (
        <Grid 
          key={solarChargeController.key}
          xs={12}
          sm={8}
          md={6}
          // lg={4}
        >
          <SolarChargeControllerPage
            solarChargeController={solarChargeController}
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