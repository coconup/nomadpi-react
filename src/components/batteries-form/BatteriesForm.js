import { useState } from 'react';
import {
  Box,
  Fab,
  Icon
} from '@mui/material';

import {
  useGetBatteriesQuery,
  useUpdateBatteryMutation,
  useCreateBatteryMutation
} from '../../apis/nomadpi/nomadpi-app-api';

import BatteryForm from '../battery-form/BatteryForm';

import Battery from '../../models/Battery';

import Loading from '../ui/Loading';

const BatteriesForm = () => {
  const initialState = {
    batteries: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiBatteries = useGetBatteriesQuery();

  const [
    updateBatteryTrigger, 
    updateBatteryState
  ] = useUpdateBatteryMutation();

  const [
    createBatteryTrigger, 
    createBatteryState
  ] = useCreateBatteryMutation();

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

  const addBattery = () => {
    const newBattery = new Battery({});

    setState({
      ...state,
      batteries: [
        ...batteries,
        newBattery
      ]
    })
  };

  const onBatteryChange = (battery, attrs) => {
    const newBatteries = batteries.map(item => {
      if((item.id || item.pseudoId) === (battery.id || battery.pseudoId)) {
        const newItem = item.clone();
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })

    setState({...state, batteries: newBatteries})
  };

  const refetchData = () => {
    apiBatteries.refetch().then((result) => setState({...state, batteries: result.data}));
  };

  const saveBatteries = () => {
    batteries.forEach(item => {
      if(!!item.id) {
        updateBatteryTrigger(item.toJSONPayload()).then(refetchData);
      } else {
        createBatteryTrigger(item.toJSONPayload()).then(refetchData);
      }
    });
  };

  let content;
  if (isLoading) {
    return <Loading size={40} fullPage />
  } else if(isSuccess) {
    content = (
      <Box>
        {
          batteries.map(item =>(
            <BatteryForm
              editable
              key={item.key}
              battery={item}
              onChange={onBatteryChange}
            />
          ))
        }
      </Box>
    );
  } else if (isError) {
  	const {status, error: message} = error;
    content = <div>{message}</div>
  }

  return (
    <Box
      sx={{
        margin: '0px auto'
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          right: '50px',
          bottom: '50px'
        }}>
        <Fab 
          color="primary" 
          aria-label="add"
          onClick={addBattery}
        >
          <Icon>add</Icon>
        </Fab>
        <Fab
          color="primary" 
          aria-label="save"
          onClick={saveBatteries}
          sx={{
            marginLeft: '10px'
          }}
        >
          <Icon>check</Icon>
        </Fab>
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        {content}
      </Box>
    </Box>
  )
}

export default BatteriesForm;