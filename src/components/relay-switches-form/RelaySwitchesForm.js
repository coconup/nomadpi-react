import { useState } from 'react';

import {
  Box,
  Fab,
  Icon
} from '@mui/material';

import EmptyResourcePage from '../empty-resource-page/EmptyResourcePage';

import {
  useGetRelaysQuery,
  useUpdateRelayMutation,
  useCreateRelayMutation
} from '../../apis/nomadpi/nomadpi-app-api';

import RelaySwitchForm from '../relay-switch-form/RelaySwitchForm';

import RelaySwitch from '../../models/RelaySwitch';

import Loading from '../ui/Loading';

const RelaySwitchesForm = () => {
  const initialState = {
    switches: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiSwitches = useGetRelaysQuery();

  const [
    updateRelaySwitchTrigger, 
    // updateRelaySwitchState
  ] = useUpdateRelayMutation();

  const [
    createRelaySwitchTrigger, 
    // createRelaySwitchState
  ] = useCreateRelayMutation();

  const isLoading = apiSwitches.isLoading;
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
    return <Loading size={40} fullPage />
  } else if(isSuccess) {
    if(switches.length === 0) {
      return (
        <EmptyResourcePage
          onClick={addSwitch}
          buttonLabel={'Add a relay'}
        />
      )
    }

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
  	const { error: message } = error;
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