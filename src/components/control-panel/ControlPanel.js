import { useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Icon} from '@mui/material';

import { switchableGroupsFromItems, SwitchableGroup } from '../../models/SwitchableGroup';

import { useGetSwitchablesQuery } from '../../apis/van-pi/van-pi-api';
import SwitchControl from '../switch-control/SwitchControl';

const SwitchesList = () => {
  const relays = useGetSwitchablesQuery('relay');
  const wifiRelays = useGetSwitchablesQuery('wrelay');

  const allSwitches = [
    ...relays.data || [],
    ...wifiRelays.data || [],
  ];

  const switchableGroups = switchableGroupsFromItems(allSwitches).filter(g => g.enabled);

  console.log(switchableGroups);

  const [state, setState] = useState({
    selectedSwitchableGroup: null,
    init: false
  });

  const isLoading = relays.isLoading || wifiRelays.isLoading;
  const isFetching = relays.isFetching || wifiRelays.isFetching;
  const isSuccess = relays.isSuccess && wifiRelays.isSuccess;
  const isError = relays.isError || wifiRelays.isError;
  const error = relays.error || wifiRelays.error;

  if(!state.init && isSuccess) {
    setState({
      init: true, 
      selectedSwitchableGroup: switchableGroups[0].name
    })
  };

  let content;

  if (isLoading) {
    content = <div>Loading</div>
  } else if (isError) {
    const {status, error: message} = error;
    content = <div>{message}</div>
  } else if (isSuccess) {
    const displaySwitches = (
      allSwitches
        .filter(switchable => switchable.enabled && switchable.group.name === state.selectedSwitchableGroup)
    );

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
            displaySwitches.map(switchable => (
              <SwitchControl 
                key={`${switchable.camelType}-${switchable.id}`} 
                switchable={switchable}
              />
            ))
          }
        </Paper>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={state.selectedSwitchableGroup}
            onChange={(event, value) => {
              setState({...state, selectedSwitchableGroup: value})
            }}
          >
            {
              switchableGroups.map(({id, name, icon}) => (
                <BottomNavigationAction
                  key={`SwitchableGroup-${id}`}
                  label={name}
                  value={name}
                  icon={<Icon>{icon}</Icon>}
                  // onClick={() => setState({...state, selectedSwitchableGroup: id})}
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

export default SwitchesList;