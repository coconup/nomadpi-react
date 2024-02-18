import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import { Icon} from '@mui/material';

import { useGetModesQuery, useUpdateModeMutation, useCreateModeMutation } from '../../apis/van-pi/vanpi-app-api';

import ModeSwitchForm from '../mode-switch-form/ModeSwitchForm';

import ModeSwitch from '../../models/ModeSwitch';

import Loading from '../ui/Loading';

const ModeSwitchesForm = () => {
  const initialState = {
    switches: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiSwitches = useGetModesQuery();

  const [
    updateModeSwitchTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useUpdateModeMutation();

  const [
    createModeSwitchTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useCreateModeMutation();

  const isLoading = apiSwitches.isLoading;
  const isFetching = apiSwitches.isFetching;
  const isSuccess = apiSwitches.isSuccess;
  const isError = apiSwitches.isError;
  const error = apiSwitches.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      switches: apiSwitches.data,
      init: true
    });
  };

  const { switches } = state;

  const addSwitch = () => {
    const newSwitch = new ModeSwitch({});

    setState({
      ...state,
      switches: [
        ...switches,
        newSwitch
      ]
    })
  };

  const onSwitchChange = (modeSwitch, attrs) => {
    const newSwitches = switches.map(item => {
      if((item.id || item.pseudoId) === (modeSwitch.id || modeSwitch.pseudoId)) {
        const newItem = item.clone();
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })

    setState({...state, switches: newSwitches})
  };

  const refetchData = () => {
    apiSwitches.refetch().then((result) => setState({...state, switches: result.data}));
  };

  const saveSwitches = () => {
    switches.forEach(item => {
      if(!!item.id) {
        updateModeSwitchTrigger(item.toJSONPayload()).then(refetchData);
      } else {
        createModeSwitchTrigger(item.toJSONPayload()).then(refetchData);
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
          switches.map(item =>(
            <ModeSwitchForm
              editable
              key={item.key}
              modeSwitch={item}
              onChange={onSwitchChange}
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
          onClick={addSwitch}
        >
          <Icon>add</Icon>
        </Fab>
        <Fab
          color="primary" 
          aria-label="save"
          onClick={saveSwitches}
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

export default ModeSwitchesForm;