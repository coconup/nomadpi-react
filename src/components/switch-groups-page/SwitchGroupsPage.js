import { useState } from 'react';
import { useSelector } from 'react-redux';

import { getApisState } from '../../utils';

import {
  Unstable_Grid2 as Grid
} from '@mui/material';

import BottomNavigation from '../ui/BottomNavigation';
import Container from '../ui/Container';

import { 
  useGetRelaysQuery,
  useGetWifiRelaysQuery,
  useGetModesQuery, 
  useGetActionSwitchesQuery, 
  useGetSwitchGroupsQuery,
} from '../../apis/van-pi/vanpi-app-api';

import SwitchGroupItem from '../switch-group-item/SwitchGroupItem';

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

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors
  } = getApisState([
    apiRelaySwitches,
    apiWifiRelaySwitches,
    apiActionSwitches,
    apiSwitchGroups,
    apiModeSwitches,
  ]);

  if(!state.init && isSuccess) {
    const sortedSwitchGroups = [...apiSwitchGroups.data].sort((a, b) => a.id - b.id);

    setState({
      ...state,
      switchGroups: sortedSwitchGroups,
      modeSwitches: apiModeSwitches.data,
      relaySwitches: apiRelaySwitches.data,
      wifiRelaySwitches: apiWifiRelaySwitches.data,
      actionSwitches: apiActionSwitches.data,
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
  };

  const relaysState = useSelector(state => {
    return state.relays.relaysState;
  });

  const modesState = useSelector(state => {
    return state.modes.modesState;
  });

  let content;

  if (isLoading) {
    content = <div>Loading</div>
  } else if (isError) {
    const {status, error: message} = errors[0];
    content = <div>{message}</div>
  } else if (isSuccess) {
    content = (
      <Container>
        <Grid container 
          spacing={2}
          sx={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {
            displaySwitches.map(switchItem => (
              <Grid
                key={`${switchItem.key}`}
                xs={12}
                sm={6}
                md={4}
              >
                <SwitchGroupItem
                  switchItem={switchItem}
                  wifiRelays={wifiRelaySwitches}
                  relays={relaySwitches}
                  relaysState={relaysState}
                  modesState={modesState}
                />
              </Grid>
            ))
          }
        </Grid>

        <BottomNavigation
          tabs={switchGroups}
          value={state.selectedSwitchGroup}
          onChange={(event, value) => {
            setState({...state, selectedSwitchGroup: value})
          }}
        />
      </Container>
    )
  }

  return content;
}

export default SwitchGroupsPage;