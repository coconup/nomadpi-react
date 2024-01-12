import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import { Icon} from '@mui/material';

import { useGetSensorsQuery, useUpdateSensorMutation, useCreateSensorMutation } from '../../apis/van-pi/vanpi-app-api';

import SensorForm from '../sensor-form/SensorForm';

import Sensor from '../../models/Sensor';

const SensorsForm = () => {
  const initialState = {
    sensors: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiSensors = useGetSensorsQuery();

  const [
    updateSensorTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useUpdateSensorMutation();

  const [
    createSensorTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useCreateSensorMutation();

  const isLoading = apiSensors.isLoading;
  const isFetching = apiSensors.isFetching;
  const isSuccess = apiSensors.isSuccess;
  const isError = apiSensors.isError;
  const error = apiSensors.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      sensors: apiSensors.data,
      init: true
    });
  };

  const { sensors } = state;

  const addSensor = () => {
    const newSensor = new Sensor({});

    setState({
      ...state,
      sensors: [
        ...sensors,
        newSensor
      ]
    })
  };

  const onSensorChange = (wifiSensor, attrs) => {
    const newSensors = sensors.map(item => {
      if((item.id || item.pseudoId) === (wifiSensor.id || wifiSensor.pseudoId)) {
        const newItem = item.clone();
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })

    setState({...state, sensors: newSensors})
  };

  const refetchData = () => {
    apiSensors.refetch().then((result) => setState({...state, sensors: result.data}));
  };

  const saveSensors = () => {
    sensors.forEach(item => {
      if(!!item.id) {
        updateSensorTrigger(item.toJSONPayload()).then(refetchData);
      } else {
        createSensorTrigger(item.toJSONPayload()).then(refetchData);
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
          sensors.map(item =>(
            <SensorForm
              editable
              key={item.key}
              sensor={item}
              onChange={onSensorChange}
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
          onClick={addSensor}
        >
          <Icon>add</Icon>
        </Fab>
        <Fab
          color="primary" 
          aria-label="save"
          onClick={saveSensors}
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

export default SensorsForm;