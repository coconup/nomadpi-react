import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import { Icon} from '@mui/material';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useGetSwitchablesQuery } from '../../apis/van-pi/van-pi-api';
import { useUpdateSwitchableMutation } from '../../apis/van-pi/van-pi-api';

import ActionSwitchForm from '../action-switch-form/ActionSwitchForm';

import { actionSwitchesFromItems, ActionSwitch } from '../../models/ActionSwitch';

const SettingsPanel = () => {
  const relays = useGetSwitchablesQuery('relay');
  const wifiRelays = useGetSwitchablesQuery('wrelay');

  const [
    updateSwitchableTrigger, 
    {
      data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useUpdateSwitchableMutation();

  let sourceData = [
    ...relays.data || [],
    ...wifiRelays.data || []
  ];

  const actionSwitchesFromSource = actionSwitchesFromItems(sourceData);

  console.log('actionSwitchesFromSource', actionSwitchesFromSource)

  const isLoading = relays.isLoading || wifiRelays.isLoading;
  const isFetching = relays.isFetching || wifiRelays.isFetching;
  const isSuccess = relays.isSuccess && wifiRelays.isSuccess;
  const isError = relays.isError || wifiRelays.isError;
  const error = relays.error || wifiRelays.error;

  const [state, setState] = useState({
    actionSwitches: [],
    switchableItems: sourceData,
    init: false
  });

  if(isSuccess && !state.init) {
    setState({
      ...state,
      actionSwitches: actionSwitchesFromSource,
      init: true
    });
  };

  const {actionSwitches, switchableItems} = state;

  console.log('actionSwitches', actionSwitches)

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

  const saveActionSwitches = () => {
    switchableItems.forEach(_switchable => {
      let newSwitchable = _switchable.clone();
      newSwitchable.actionSwitches = (
        actionSwitches
          .map(actionSwitch => {
            const item = actionSwitch.items.find(({switchable}) => switchable.key === newSwitchable.key)
            if(item) {
              return actionSwitch.toJSONPayload(item.state);
            }
          })
          .filter(a => !!a)
      );
      updateSwitchableTrigger(newSwitchable.toJSONPayload());
    });
  };

  const handleChange = ({id}, attrs) => {
    const newActionSwitches = state.actionSwitches.map(actionSwitch => {
      let newActionSwitch = actionSwitch.clone();
      if(newActionSwitch.id === id) {
        Object.keys(attrs).forEach(k => newActionSwitch[k] = attrs[k]);
      }
      return newActionSwitch;
    });

    setState({...state, actionSwitches: newActionSwitches});
  };

  const handleDelete = (actionSwitch) => {
    setState({
      ...state,
      actionSwitches: actionSwitches.filter(el => el.id !== actionSwitch.id)
    })
  };

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if (isSuccess) {
    const renderedActionSwitches = actionSwitches.map(actionSwitch => {
      const {id: actionSwitchId, name: actionSwitchName, icon: actionSwitchIcon, items} = actionSwitch;
      const actionSwitchKey = `ActionSwitchConfig-${actionSwitchId}`;

      return (
        <div key={actionSwitchKey}>
          <ActionSwitchForm
            actionSwitch={actionSwitch}
            switchableItems={switchableItems}
            onChange={handleChange}
            onDelete={handleDelete}
          />
        </div>
      )
    })

    content = renderedActionSwitches
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
          disabled={actionSwitches.find(({items}) => !!items.length === 0)}
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

export default SettingsPanel;