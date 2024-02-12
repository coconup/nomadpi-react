import { useEffect } from 'react';

import { setError } from '../../app/notificationBarMiddleware';
import store from '../../app/store';

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Icon,
  Switch,
  Typography,
} from '@mui/material';

import ModeSwitch from '../../models/ModeSwitch';

import { usePostSwitchStateMutation } from '../../apis/van-pi/vanpi-app-api';

export default function SwitchGroupItem({switchItem, relays, wifiRelays, relaysState, modesState}) {
  const itemType = switchItem.snakecaseType;
  const {
    snakecaseType,
    name,
    icon,
    actor
  } = switchItem;

  let state;
  if(switchItem.constructor === ModeSwitch) {
    state = (modesState[switchItem.mode_key] || {}).state || false;
  } else {
    state = !![relaysState.relay || {}, ...(Object.values(relaysState.wifi_relay || {}) || [])].find(switchesState => {
      return !!Object.values(switchesState).find(({actors=[]}) => !!actors.find(({actor: a}) => a === actor));
    })
  }

  const [
    postSwitchStateTrigger, 
    switchStateResponse
  ] = usePostSwitchStateMutation();

  const { isError } = switchStateResponse;

  const handleClick = () => {
    postSwitchStateTrigger({
      switch_type: snakecaseType,
      switch_id: switchItem.id,
      actor,
      state: !state
    });
  };

  useEffect(() => {
    if(isError) {
      const { error={} } = switchStateResponse;
      if(error.data) {
        const { type } = error.data.error.message;

        if(type === 'conflicting_actors_found') {
          store.dispatch(setError(`Cannot toggle ${switchItem.name} because it conflicts with other active switches`));
        }
      }
    }
  }, [isError]);

  const transform = state ? 'scale(0.95)' : null;

  return (
    <Card 
      onClick={handleClick}
      raised
      elevation={state ? 1 : 2}
      sx={{
        padding: state ? '0px' : '3px',
        margin: state ? '3px' : '0px'
      }}
    >
      <CardContent>
        <CardHeader
          avatar={
            <Typography sx={{ 
              fontSize: 14, 
              fontWeight: 500, 
              marginBottom: '0px', 
              alignSelf: 'center',
              color: state === true ? 'primary.light' : 'text.disabled'
            }} color="primary" gutterBottom>
              {state ? 'ON' : 'OFF'}
            </Typography>
          }
          action={
            <Switch checked={state}/>
          }
        />
        <Box
          sx={{
            textAlign: 'center'
          }}
        >
          <Icon 
            sx={{
              fontSize: '64px', 
              color: state ? 'primary.main' : 'action.disabled',
              transform
            }}
          >
            {icon}
          </Icon>
          <Typography 
            sx={{
              fontSize: 20,
              fontWeight: 500,
              margin: '20px',
              color: state ? 'primary.main' : 'text.secondary',
              transform
            }} 
            color="text.primary"
          >
            {name}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}