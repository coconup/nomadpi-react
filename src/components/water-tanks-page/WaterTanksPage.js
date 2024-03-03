import { useState } from 'react';
import { useLocation } from "wouter";

import {
  Box,
  ButtonBase,
  Card,
  Icon,
  Unstable_Grid2 as Grid
} from '@mui/material';

import Container from '../ui/Container';

import WaterTankPage from '../water-tank-page/WaterTankPage';
import EmptyResourcePage from '../empty-resource-page/EmptyResourcePage';

import { useGetWaterTanksQuery } from '../../apis/nomadpi/nomadpi-app-api';

import Loading from '../ui/Loading';

export default function WaterTanksPage({ compact=false }) {
  const [location, setLocation] = useLocation();

  const initialState = {
    waterTanks: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiWaterTanks = useGetWaterTanksQuery();

  const isLoading = apiWaterTanks.isLoading;
  const isFetching = apiWaterTanks.isFetching;
  const isSuccess = apiWaterTanks.isSuccess;
  const isError = apiWaterTanks.isError;
  const error = apiWaterTanks.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      waterTanks: apiWaterTanks.data,
      selectedWaterTank: apiWaterTanks.data[0],
      init: true
    });
  };

  const {
    waterTanks,
    selectedWaterTank
  } = state;

  const selectNextWaterTank = () => {
    let nextIndex = waterTanks.indexOf(selectedWaterTank) + 1;
    if(nextIndex > waterTanks.length - 1) nextIndex = 0;

    setState({
      ...state,
      selectedWaterTank: waterTanks[nextIndex]
    })
  };

  let content;
  if (isLoading) {
    return <Loading size={40} fullPage />
  } else if(isSuccess && state.init) {
    if(compact) {
      return (
        <Box onClick={waterTanks.length > 0 ? selectNextWaterTank : () => setLocation("/settings/water-tanks")}>
          <ButtonBase sx={{width: '100%'}}>
            {
              selectedWaterTank && (
                <WaterTankPage
                  compact
                  waterTank={selectedWaterTank}
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
                  <Icon sx={{fontSize: 42, color: 'text.disabled'}}>water</Icon>
                </Card>
              )
            }
          </ButtonBase>
        </Box>
      )
    } else {
      if(waterTanks.length === 0) {
        return (
          <EmptyResourcePage
            onClick={() => setLocation("/settings/water-tanks")}
            buttonLabel='Go to settings'
            icon={'settings'}
          />
        )
      }

      content = waterTanks.map(waterTank => (
        <Grid 
          key={waterTank.key}
          xs={12}
          sm={8}
          md={6}
          // lg={4}
        >
          <WaterTankPage
            waterTank={waterTank}
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