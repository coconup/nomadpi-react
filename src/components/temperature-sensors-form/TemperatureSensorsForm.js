import { useState } from 'react';

import {
  Box,
  Fab,
  Icon
} from '@mui/material';

import {
  useGetTemperatureSensorsQuery,
  useUpdateTemperatureSensorMutation,
  useCreateTemperatureSensorMutation
} from '../../apis/nomadpi/nomadpi-app-api';

import TemperatureSensorForm from '../temperature-sensor-form/TemperatureSensorForm';
import EmptyResourcePage from '../empty-resource-page/EmptyResourcePage';

import TemperatureSensor from '../../models/TemperatureSensor';

import Loading from '../ui/Loading';

const TemperatureSensorsForm = () => {
  const initialState = {
    temperatureSensors: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiTemperatureSensors = useGetTemperatureSensorsQuery();

  const [
    updateTemperatureSensorTrigger, 
    updateTemperatureSensorState
  ] = useUpdateTemperatureSensorMutation();

  const [
    createTemperatureSensorTrigger, 
    createTemperatureSensorState
  ] = useCreateTemperatureSensorMutation();

  const isLoading = apiTemperatureSensors.isLoading;
  const isFetching = apiTemperatureSensors.isFetching;
  const isSuccess = apiTemperatureSensors.isSuccess;
  const isError = apiTemperatureSensors.isError;
  const error = apiTemperatureSensors.error;

  const { temperatureSensors } = state;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      temperatureSensors: apiTemperatureSensors.data,
      init: true
    });
  };

  const addTemperatureSensor = () => {
    const newTemperatureSensor = new TemperatureSensor({});

    setState({
      ...state,
      temperatureSensors: [
        ...temperatureSensors,
        newTemperatureSensor
      ]
    })
  };

  const onTemperatureSensorChange = (temperatureSensor, attrs) => {
    const newTemperatureSensors = temperatureSensors.map(item => {
      if((item.id || item.pseudoId) === (temperatureSensor.id || temperatureSensor.pseudoId)) {
        const newItem = item.clone();
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })

    setState({...state, temperatureSensors: newTemperatureSensors})
  };

  const refetchTemperatureSensorsData = () => {
    apiTemperatureSensors.refetch().then((result) => setState({...state, temperatureSensors: result.data}));
  };

  const saveTemperatureSensors = () => {
    temperatureSensors.forEach(item => {
      if(!!item.id) {
        updateTemperatureSensorTrigger(item.toJSONPayload()).then(refetchTemperatureSensorsData);
      } else {
        createTemperatureSensorTrigger(item.toJSONPayload()).then(refetchTemperatureSensorsData);
      }
    });
  };

  let content;
  if (isLoading) {
    return <Loading size={40} fullPage />
  } else if(isSuccess) {
    if(temperatureSensors.length === 0) {
      return (
        <EmptyResourcePage
          onClick={addTemperatureSensor}
          buttonLabel={'Add a temperature sensor'}
        />
      )
    }

    content = (
      <Box>
        {
          temperatureSensors.map(item =>(
            <TemperatureSensorForm
              key={item.key}
              temperatureSensor={item}
              onChange={onTemperatureSensorChange}
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
          onClick={addTemperatureSensor}
        >
          <Icon>add</Icon>
        </Fab>
        <Fab
          color="primary" 
          aria-label="save"
          onClick={saveTemperatureSensors}
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

export default TemperatureSensorsForm;