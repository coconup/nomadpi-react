import { useState } from 'react';
import { useSelector } from 'react-redux'

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Icon} from '@mui/material';

import SwitchGroup from '../../models/SwitchGroup';
import SwitchGroupItem from '../switch-group-item/SwitchGroupItem';

import { 
  useGetRelaysQuery, 
  useGetActionSwitchesQuery, 
  useGetSwitchGroupsQuery,
  useGetRelaysStateQuery
} from '../../apis/van-pi/vanpi-app-api';

const SwitchGroupsPage = () => {
  const initialState = {
    switchGroups: [],
    relaySwitches: [],
    actionSwitches: [],
    init: false,
    selectedSwitchGroup: null,
  };

  const [state, setState] = useState(initialState);

  const apiRelaySwitches = useGetRelaysQuery();
  const apiActionSwitches = useGetActionSwitchesQuery();
  const apiSwitchGroups = useGetSwitchGroupsQuery();
  const apiSwitchesState = useGetRelaysStateQuery();

  const isLoading = apiRelaySwitches.isLoading || apiActionSwitches.isLoading || apiSwitchGroups.isLoading || apiSwitchesState.isLoading;
  const isFetching = apiRelaySwitches.isFetching || apiActionSwitches.isFetching || apiSwitchGroups.isFetching || apiSwitchesState.isFetching;
  const isSuccess = apiRelaySwitches.isSuccess && apiActionSwitches.isSuccess && apiSwitchGroups.isSuccess && apiSwitchesState.isSuccess;
  const isError = apiRelaySwitches.isError || apiActionSwitches.isError || apiSwitchGroups.isError || apiSwitchesState.isError;
  const error = apiRelaySwitches.error || apiActionSwitches.error || apiSwitchGroups.error || apiSwitchesState.error;

  if(!state.init && isSuccess) {
    const sortedSwitchGroups = [...apiSwitchGroups.data].sort((a, b) => a.id - b.id);

    setState({
      ...state,
      switchGroups: sortedSwitchGroups,
      relaySwitches: apiRelaySwitches.data,
      actionSwitches: apiActionSwitches.data,
      switchesState: apiSwitchesState.data,
      init: true, 
      selectedSwitchGroup: sortedSwitchGroups[0] && sortedSwitchGroups[0].name || initialState.selectedSwitchGroup
    })
  };

  const {
    switchGroups,
    relaySwitches,
    actionSwitches,
    selectedSwitchGroup,
    switchesState
  } = state;

  let displaySwitches = [];
  
  if(selectedSwitchGroup) {
    const switchGroup = switchGroups.find(({name}) => name === selectedSwitchGroup);
    displaySwitches = (
      switchGroup.switches
        .sort((a, b) => a.index - b.index)
        .map(({switch_type, switch_id}) => {
          if(switch_type === 'action_switch') {
            return actionSwitches.find(({id}) => id === switch_id);
          } else if(switch_type === 'relay') {
            return relaySwitches.find(({id}) => id === switch_id);
          }
        })
    )
  }

  const itemStates = useSelector(state => {
    return state.relays.relaysState;
  })
  const getSwitchItemState = (switchItem) => {
    return (itemStates[switchItem.relay_position] || {}).state;
  }

  let content;

  if (isLoading) {
    content = <div>Loading</div>
  } else if (isError) {
    const {status, error: message} = error;
    content = <div>{message}</div>
  } else if (isSuccess) {
    content = (
      <Box sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '-100px'
      }}>
        <Paper
          sx={{
            padding:'120px',
            backgroundColor: 'grey.100'
          }}
          elevation={1}
        >
          {
            displaySwitches.map(switchItem => (
              <SwitchGroupItem 
                key={`${switchItem.key}`} 
                switchItem={switchItem}
                state={getSwitchItemState(switchItem)}
                onClick={() => setState({...state})}
              />
            ))
          }
        </Paper>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={state.selectedSwitchGroup}
            onChange={(event, value) => {
              setState({...state, selectedSwitchGroup: value})
            }}
          >
            {
              switchGroups.map(({id, name, icon}) => (
                <BottomNavigationAction
                  key={`SwitchGroup-${id}`}
                  label={name}
                  value={name}
                  icon={<Icon>{icon}</Icon>}
                  // onClick={() => setState({...state, selectedSwitchGroup: id})}
                />
              ))
            }
          </BottomNavigation>
        </Paper>
      </Box>
    )
  }

  return content
}

export default SwitchGroupsPage;