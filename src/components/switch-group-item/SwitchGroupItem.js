import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { Icon } from '@mui/material';

import ModeSwitch from '../../models/ModeSwitch';

import { 
  usePostRelaysStateMutation,
  usePostModeStateMutation
} from '../../apis/van-pi/vanpi-app-api';

export default function SwitchControl({switchItem, relays, wifiRelays, relaysState, modesState}) {
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
    postRelaysStateTrigger, 
    relayStateResponse
  ] = usePostRelaysStateMutation();

  const [
    postModeStateTrigger, 
    modeStateResponse
  ] = usePostModeStateMutation();

  const relayStatePayload = (relayItem, actor, state) => {
    const {
      snakecaseType,
      relay_position,
    } = relayItem;

    return {
      relay_type: snakecaseType,
      ...snakecaseType === 'wifi_relay' ? {
        vendor_id: relayItem.vendor_id,
        mqtt_topic: relayItem.mqtt_topic
      } : {},
      relay_position,
      actor,
      mode: state ? 'subscribe' : 'unsubscribe',
      ...state ? {state: true} : {}
    }
  }

  const handleClick = () => {
    if(['relay', 'wifi_relay'].includes(snakecaseType)) {
      const payload = relayStatePayload(
        switchItem,
        actor,
        !state
      );

      postRelaysStateTrigger([payload]);
    } else if(snakecaseType === 'action_switch') {
      const payload = switchItem.switches.map(({switch_type, switch_id, on_state}) => {
        let relay;
        if(switch_type === 'relay') {
          relay = relays.find(({id}) => id === switch_id);
        } else if (switch_type === 'wifi_relay') {
          relay = wifiRelays.find(({id}) => id === switch_id);
        };

        return {
          ...relayStatePayload(relay, actor, !state),
          ...!state ? {state: on_state} : {}
        }
      })

      postRelaysStateTrigger(payload);
    } else if(snakecaseType === 'mode') {
      postModeStateTrigger({ mode_key: switchItem.mode_key, state: !state});
    }
  }

  const transform = state ? 'scale(0.95)' : null;

  return (
    // <Button color='secondary' sx={{
    //   '& .MuiPaper-root': {
    //     // ...(state === true ? {} : {backgroundColor: 'grey.200'})
    //   }
    // }}>
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
    // </Button>
  );
}