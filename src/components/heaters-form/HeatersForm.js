import { useState } from 'react';

import {
  getApisState
} from '../../utils';

import {
  Box,
  Fab,
  Icon
} from '@mui/material';

import {
  useGetHeatersQuery,
  useUpdateHeaterMutation,
  useCreateHeaterMutation,

  useGetActionSwitchesQuery,
  useGetRelaysQuery,
  useGetWifiRelaysQuery,
  
  useGetTemperatureSensorsQuery,
} from '../../apis/van-pi/vanpi-app-api';

import HeaterForm from '../heater-form/HeaterForm';

import Heater from '../../models/Heater';

const HeatersForm = () => {
  const initialState = {
    heaters: [],
    relays: [],
    wifiRelays: [],
    actionSwitches: [],
    apiTemperatureSensors: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  const apiHeaters = useGetHeatersQuery();
  const apiRelays = useGetRelaysQuery();
  const apiWifiRelays = useGetWifiRelaysQuery();
  const apiActionSwitches = useGetActionSwitchesQuery();
  const apiTemperatureSensors = useGetTemperatureSensorsQuery();

  const [
    updateHeaterTrigger, 
    updateHeaterState
  ] = useUpdateHeaterMutation();

  const [
    createHeaterTrigger, 
    createHeaterState
  ] = useCreateHeaterMutation();

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors,
  } = getApisState([
    apiHeaters,
    apiRelays,
    apiWifiRelays,
    apiActionSwitches,
    apiTemperatureSensors,
  ]);

  const {
    heaters,
    relays,
    wifiRelays,
    actionSwitches,
    temperatureSensors,
  } = state;

  const switchesOptions = [
    ...relays,
    ...wifiRelays,
    ...actionSwitches
  ].map(({ snakecaseType: type, id, name }) => {
    return {
      type,
      id,
      name
    }
  });

  if(isSuccess && !state.init) {
    setState({
      ...state,
      heaters: apiHeaters.data,
      relays: apiRelays.data,
      wifiRelays: apiWifiRelays.data,
      actionSwitches: apiActionSwitches.data,
      temperatureSensors: apiTemperatureSensors.data,
      init: true
    });
  };

  const addHeater = () => {
    const newHeater = new Heater({});

    setState({
      ...state,
      heaters: [
        ...heaters,
        newHeater
      ]
    })
  };

  const onHeaterChange = (heater, attrs) => {
    const newHeaters = heaters.map(item => {
      if((item.id || item.pseudoId) === (heater.id || heater.pseudoId)) {
        const newItem = item.clone();
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })

    setState({...state, heaters: newHeaters})
  };

  const refetchHeatersData = () => {
    apiHeaters.refetch().then((result) => setState({...state, heaters: result.data}));
  };

  const saveHeaters = () => {
    heaters.forEach(item => {
      if(!!item.id) {
        updateHeaterTrigger(item.toJSONPayload()).then(refetchHeatersData);
      } else {
        createHeaterTrigger(item.toJSONPayload()).then(refetchHeatersData);
      }
    });
  };

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if(isSuccess) {
    content = (
      <Box>
        {
          heaters.map(item =>(
            <HeaterForm
              key={item.key}
              heater={item}
              onChange={onHeaterChange}
              switchesOptions={switchesOptions}
              temperatureSensors={temperatureSensors}
            />
          ))
        }
      </Box>
    );
  } else if (isError) {
  	const {status, error: message} = errors.map(e => e.message).join("\n");
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
          onClick={addHeater}
        >
          <Icon>add</Icon>
        </Fab>
        <Fab
          color="primary" 
          aria-label="save"
          onClick={saveHeaters}
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

export default HeatersForm;