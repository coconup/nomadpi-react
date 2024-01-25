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

import { usePostSwitchStateMutation } from '../../apis/van-pi/vanpi-app-api';

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
    postSwitchStateTrigger, 
    switchStateResponse
  ] = usePostSwitchStateMutation();

  const handleClick = () => {
    postSwitchStateTrigger({
      switch_type: snakecaseType,
      switch_id: switchItem.id,
      actor,
      state: !state
    });
  };

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