import { useState } from 'react';

import Box from '@mui/material/Box';

import LevelChart from '../level-chart/LevelChart';
import BatteryPage from '../battery-page/BatteryPage';

import { useGetBatteriesQuery } from '../../apis/van-pi/vanpi-app-api';

export default function MonitorPage() {
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
      <Box>
        <BatteryPage key={battery.key} battery={battery} />
      </Box>
    ));
  } else if (isError) {
    const {status, error: message} = error;
    content = <div>{message}</div>
  }

  return (
    <Box>
      {content}
      <LevelChart />
    </Box>
  );
}