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

import BatteryPage from '../battery-page/BatteryPage';
import EmptyResourcePage from '../empty-resource-page/EmptyResourcePage';

import { useGetBatteriesQuery } from '../../apis/nomadpi/nomadpi-app-api';

import Loading from '../ui/Loading';

export default function BatteriesPage({ compact=false }) {
  const [location, setLocation] = useLocation();

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
    return <Loading size={40} fullPage />
  } else if(isSuccess && state.init) {
    if(compact) {
      return (
        <Box onClick={batteries.length > 0 ? selectNextBattery : () => setLocation("/settings/batteries")}>
          <ButtonBase sx={{width: '100%'}}>
            {
              selectedBattery && (
                <BatteryPage
                  compact
                  battery={selectedBattery}
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
                  <Icon sx={{fontSize: 42, color: 'text.disabled'}}>bolt</Icon>
                </Card>
              )
            }
          </ButtonBase>
        </Box>
      )
    } else {
      if(batteries.length === 0) {
        return (
          <EmptyResourcePage
            onClick={() => setLocation("/settings/batteries")}
            buttonLabel='Go to settings'
            icon={'settings'}
          />
        )
      }

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