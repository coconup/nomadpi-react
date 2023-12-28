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
  useGetWifiRelaysQuery,
  useGetModesQuery, 
  useGetActionSwitchesQuery, 
  useGetSwitchGroupsQuery,
  useGetRelaysStateQuery,
  useGetModesStateQuery
} from '../../apis/van-pi/vanpi-app-api';

const SwitchGroupsPage = () => {
  const initialState = {
    switchGroups: [],
    relaySwitches: [],
    wifiRelaySwitches: [],
    modeSwitches: [],
    actionSwitches: [],
    init: false,
    selectedSwitchGroup: null,
  };

  const [state, setState] = useState(initialState);

  const apiRelaySwitches = useGetRelaysQuery();
  const apiWifiRelaySwitches = useGetWifiRelaysQuery();
  const apiModeSwitches = useGetModesQuery();
  const apiActionSwitches = useGetActionSwitchesQuery();
  const apiSwitchGroups = useGetSwitchGroupsQuery();
  const apiRelaysState = useGetRelaysStateQuery();
  const apiModesState = useGetModesStateQuery();

  const isLoading = apiRelaySwitches.isLoading || apiWifiRelaySwitches.isLoading || apiActionSwitches.isLoading || apiSwitchGroups.isLoading || apiRelaysState.isLoading || apiModeSwitches.isLoading || apiModesState.isLoading;
  const isFetching = apiRelaySwitches.isFetching || apiWifiRelaySwitches.isFetching || apiActionSwitches.isFetching || apiSwitchGroups.isFetching || apiRelaysState.isFetching || apiModeSwitches.isFetching || apiModesState.isFetching;
  const isSuccess = apiRelaySwitches.isSuccess && apiWifiRelaySwitches.isSuccess && apiActionSwitches.isSuccess && apiSwitchGroups.isSuccess && apiRelaysState.isSuccess && apiModeSwitches.isSuccess && apiModesState.isSuccess;
  const isError = apiRelaySwitches.isError || apiWifiRelaySwitches.isError || apiActionSwitches.isError || apiSwitchGroups.isError || apiRelaysState.isError || apiModeSwitches.isError || apiModesState.isError;
  const error = apiRelaySwitches.error || apiWifiRelaySwitches.error || apiActionSwitches.error || apiSwitchGroups.error || apiRelaysState.error || apiModeSwitches.error || apiModesState.error;

  if(!state.init && isSuccess) {
    const sortedSwitchGroups = [...apiSwitchGroups.data].sort((a, b) => a.id - b.id);

    setState({
      ...state,
      switchGroups: sortedSwitchGroups,
      modeSwitches: apiModeSwitches.data,
      relaySwitches: apiRelaySwitches.data,
      wifiRelaySwitches: apiWifiRelaySwitches.data,
      actionSwitches: apiActionSwitches.data,
      relaysState: apiRelaysState.data,
      modesState: apiModesState.data,
      init: true, 
      selectedSwitchGroup: sortedSwitchGroups[0] && sortedSwitchGroups[0].name || initialState.selectedSwitchGroup
    })
  };

  const {
    switchGroups,
    relaySwitches,
    wifiRelaySwitches,
    modeSwitches,
    actionSwitches,
    selectedSwitchGroup,
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
          } else if(switch_type === 'wifi_relay') {
            return wifiRelaySwitches.find(({id}) => id === switch_id);
          } else if(switch_type === 'mode') {
            return modeSwitches.find(({id}) => id === switch_id);
          }
        })
    )
  }

  const relaysState = useSelector(state => {
    return state.relays.relaysState;
  })

  const modesState = useSelector(state => {
    return state.modes.modesState;
  })

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
                wifiRelays={wifiRelaySwitches}
                relays={relaySwitches}
                relaysState={relaysState}
                modesState={modesState}
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