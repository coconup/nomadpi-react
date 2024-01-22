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
  useGetActionSwitchesQuery,
  useGetRelaysQuery,
  useGetWifiRelaysQuery,
  useUpdateActionSwitchMutation,
  useCreateActionSwitchMutation,
  useDeleteActionSwitchMutation
} from '../../apis/van-pi/vanpi-app-api';

import ActionSwitch from '../../models/ActionSwitch';

import ActionSwitchForm from '../action-switch-form/ActionSwitchForm';

const ActionSwitchesForm = () => {
  const [state, setState] = useState({
    actionSwitches: [],
    relaySwitches: [],
    wifiRelaySwitches: [],
    init: false
  });

  const apiActionSwitches = useGetActionSwitchesQuery();
  const apiRelaySwitches = useGetRelaysQuery();
  const apiWifiRelaySwitches = useGetWifiRelaysQuery();

  const [
    updateActionSwitchTrigger, 
    updateActionSwitchState
  ] = useUpdateActionSwitchMutation();

  const [
    createActionSwitchTrigger, 
    createActionSwitchState
  ] = useCreateActionSwitchMutation();

  const [
    deleteActionSwitchTrigger, 
    deleteActionSwitchState
  ] = useDeleteActionSwitchMutation();

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors
  } = getApisState([
    apiActionSwitches,
    apiRelaySwitches,
    apiWifiRelaySwitches
  ]);

  if(isSuccess && !state.init) {
    setState({
      ...state,
      actionSwitches: apiActionSwitches.data,
      relaySwitches: apiRelaySwitches.data,
      wifiRelaySwitches: apiWifiRelaySwitches.data,
      init: true
    });
  };

  const { actionSwitches, relaySwitches, wifiRelaySwitches } = state;

  const addActionSwitch = () => {
    const newActionSwitch = new ActionSwitch({
      name: `Action Switch ${actionSwitches.length + 1}`
    });

    setState({
      ...state,
      actionSwitches: [
        ...actionSwitches,
        newActionSwitch
      ]
    })
  };

  const refetchData = () => {
    apiActionSwitches.refetch().then((result) => setState({...state, actionSwitches: result.data}));
  };

  const handleChange = (actionSwitch, attrs) => {
    const newActionSwitches = actionSwitches.map(item => {
      if((item.id || item.pseudoId) === (actionSwitch.id || actionSwitch.pseudoId)) {
        let newActionSwitch = item.clone();
        Object.keys(attrs).forEach(k => newActionSwitch[k] = attrs[k]);
        return newActionSwitch;
      } else {
        return item;
      }
    });

    setState({...state, actionSwitches: newActionSwitches});
  };
  
  const handleDelete = (actionSwitch) => {
    setState({
      ...state,
      actionSwitches: actionSwitches.map(item => {
        if(item.id === actionSwitch.id) {
          const newItem = item.clone();
          newItem.isDeleted = true;
          return newItem;
        } else {
          return item;
        }
      })
    })
  };

  const saveActionSwitches = () => {
    actionSwitches.forEach(item => {
      if(!!item.id) {
        if(item.isDeleted) {
          deleteActionSwitchTrigger(item.toJSONPayload()).then(refetchData);  
        } else {
          updateActionSwitchTrigger(item.toJSONPayload()).then(refetchData);
        }
      } else if(!item.isDeleted) {
        createActionSwitchTrigger(item.toJSONPayload()).then(refetchData);
      }
    });
  };

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if (isSuccess) {
    content = actionSwitches.filter(({isDeleted}) => !isDeleted).map(actionSwitch => {
      return (
        <Box key={actionSwitch.key}>
          <ActionSwitchForm
            actionSwitch={actionSwitch}
            relaySwitches={relaySwitches}
            wifiRelaySwitches={wifiRelaySwitches}
            onChange={handleChange}
            onDelete={handleDelete}
          />
        </Box>
      )
    });
  } else if (isError) {
  	const {status, error: message} = errors[0];
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
          onClick={() => addActionSwitch()}
          disabled={actionSwitches.find(({switches}) => !!switches.length === 0)}
        >
          <Icon>add</Icon>
        </Fab>
        <Fab
          color="primary" 
          aria-label="save"
          onClick={saveActionSwitches}
          sx={{
            marginLeft: '10px'
          }}
        >
          <Icon>check</Icon>
        </Fab>
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'column'}}>
        {content}
      </Box>
    </Box>
  )
}

export default ActionSwitchesForm;