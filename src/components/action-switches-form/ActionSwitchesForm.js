import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import { Icon} from '@mui/material';

import {
  useGetActionSwitchesQuery,
  useGetRelaySwitchesQuery,
  useUpdateActionSwitchMutation,
  useCreateActionSwitchMutation,
  useDeleteActionSwitchMutation
} from '../../apis/van-pi/vanpi-app-api';

import ActionSwitchForm from '../action-switch-form/ActionSwitchForm';

import ActionSwitch from '../../models/ActionSwitch';

const ActionSwitchesForm = () => {
  const [state, setState] = useState({
    actionSwitches: [],
    relaySwitches: [],
    init: false
  });

  const apiActionSwitches = useGetActionSwitchesQuery();
  const apiRelaySwitches = useGetRelaySwitchesQuery();

  const [
    updateActionSwitchTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useUpdateActionSwitchMutation();

  const [
    createActionSwitchTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useCreateActionSwitchMutation();

  const [
    deleteActionSwitchTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useDeleteActionSwitchMutation();

  const isLoading = apiActionSwitches.isLoading || apiRelaySwitches.isLoading;
  const isFetching = apiActionSwitches.isFetching || apiRelaySwitches.isFetching;
  const isSuccess = apiActionSwitches.isSuccess && apiRelaySwitches.isSuccess;
  const isError = apiActionSwitches.isError || apiRelaySwitches.isError;
  const error = apiActionSwitches.error || apiRelaySwitches.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      actionSwitches: apiActionSwitches.data,
      relaySwitches: apiRelaySwitches.data,
      init: true
    });
  };

  const { actionSwitches, relaySwitches } = state;

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
            onChange={handleChange}
            onDelete={handleDelete}
          />
        </Box>
      )
    });
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
          onClick={() => addActionSwitch()}
          disabled={actionSwitches.find(({relay_switches}) => !!relay_switches.length === 0)}
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