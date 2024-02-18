import { useState } from 'react';
import {
  Box,
  Fab,
  Icon
} from '@mui/material';

import {
  useGetSolarChargeControllersQuery,
  useUpdateSolarChargeControllerMutation,
  useCreateSolarChargeControllerMutation
} from '../../apis/van-pi/vanpi-app-api';

import SolarChargeControllerForm from '../solar-charge-controller-form/SolarChargeControllerForm';

import SolarChargeController from '../../models/SolarChargeController';

import Loading from '../ui/Loading';

const SolarChargeControllersForm = () => {
  const initialState = {
    solarChargeControllers: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiSolarChargeControllers = useGetSolarChargeControllersQuery();

  const [
    updateSolarChargeControllerTrigger, 
    updateSolarChargeControllerState
  ] = useUpdateSolarChargeControllerMutation();

  const [
    createSolarChargeControllerTrigger, 
    createSolarChargeControllerState
  ] = useCreateSolarChargeControllerMutation();

  const isLoading = apiSolarChargeControllers.isLoading;
  const isFetching = apiSolarChargeControllers.isFetching;
  const isSuccess = apiSolarChargeControllers.isSuccess;
  const isError = apiSolarChargeControllers.isError;
  const error = apiSolarChargeControllers.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      solarChargeControllers: apiSolarChargeControllers.data,
      init: true
    });
  };

  const { solarChargeControllers } = state;

  const addSolarChargeController = () => {
    const newSolarChargeController = new SolarChargeController({});

    setState({
      ...state,
      solarChargeControllers: [
        ...solarChargeControllers,
        newSolarChargeController
      ]
    })
  };

  const onSolarChargeControllerChange = (solarChargeController, attrs) => {
    const newSolarChargeControllers = solarChargeControllers.map(item => {
      if((item.id || item.pseudoId) === (solarChargeController.id || solarChargeController.pseudoId)) {
        const newItem = item.clone();
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })

    setState({...state, solarChargeControllers: newSolarChargeControllers})
  };

  const refetchData = () => {
    apiSolarChargeControllers.refetch().then((result) => setState({...state, solarChargeControllers: result.data}));
  };

  const saveSolarChargeControllers = () => {
    solarChargeControllers.forEach(item => {
      if(!!item.id) {
        updateSolarChargeControllerTrigger(item.toJSONPayload()).then(refetchData);
      } else {
        createSolarChargeControllerTrigger(item.toJSONPayload()).then(refetchData);
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
          solarChargeControllers.map(item =>(
            <SolarChargeControllerForm
              editable
              key={item.key}
              solarChargeController={item}
              onChange={onSolarChargeControllerChange}
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
          onClick={addSolarChargeController}
          disabled={solarChargeControllers.length > 0}
        >
          <Icon>add</Icon>
        </Fab>
        <Fab
          color="primary" 
          aria-label="save"
          onClick={saveSolarChargeControllers}
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

export default SolarChargeControllersForm;