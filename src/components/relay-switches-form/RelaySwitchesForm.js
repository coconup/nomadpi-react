import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import { Icon} from '@mui/material';

import { useGetRelaysQuery, useUpdateRelayMutation, useCreateRelayMutation } from '../../apis/van-pi/vanpi-app-api';

import RelaySwitchForm from '../relay-switch-form/RelaySwitchForm';

import RelaySwitch from '../../models/RelaySwitch';

const RelaySwitchesForm = () => {
  const initialState = {
    switches: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiSwitches = useGetRelaysQuery();

  const [
    updateRelaySwitchTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useUpdateRelayMutation();

  const [
    createRelaySwitchTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useCreateRelayMutation();

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
    const newSwitch = new RelaySwitch({});

    setState({
      ...state,
      switches: [
        ...switches,
        newSwitch
      ]
    })
  };

  const onSwitchChange = (relaySwitch, attrs) => {
    const newSwitches = switches.map(item => {
      if((item.id || item.pseudoId) === (relaySwitch.id || relaySwitch.pseudoId)) {
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
        updateRelaySwitchTrigger(item.toJSONPayload()).then(refetchData);
      } else {
        createRelaySwitchTrigger(item.toJSONPayload()).then(refetchData);
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
          switches.map(item =>(
            <RelaySwitchForm
              editable
              key={item.key}
              relaySwitch={item}
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

export default RelaySwitchesForm;