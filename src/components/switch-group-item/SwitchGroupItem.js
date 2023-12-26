import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { Icon} from '@mui/material';

import ActionSwitch from '../../models/ActionSwitch';

import { 
  usePostRelaysStateMutation,
  usePostModeStateMutation
} from '../../apis/van-pi/vanpi-app-api';

export default function SwitchControl({switchItem, state: stateProp, relays, relaysState}) {
  const itemType = switchItem.snakecaseType;
  const {
    snakecaseType,
    name,
    icon,
    actor
  } = switchItem;

  let state;
  if(switchItem.constructor === ActionSwitch) {
    state = !!Object.values(relaysState).find(({actors=[]}) => !!actors.find(({actor: a}) => a === actor));
  } else {
    state = stateProp;
  }

  const [
    postRelaysStateTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = usePostRelaysStateMutation();

  const [
    postModeStateTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = usePostModeStateMutation();

  const handleClick = () => {
    if(snakecaseType === 'relay') {
      postRelaysStateTrigger([{
        relay_position: switchItem.relay_position, 
        state: !state,
        mode: !state ? 'subscribe' : 'unsubscribe',
        actor
      }]);
    } else if(snakecaseType === 'action_switch') {
      const payload = switchItem.relay_switches.map(item => {
        const relay = relays.find(({id}) => id === item.item_id);
        return { 
          relay_position: relay.relay_position, 
          state: !state ? item.on_state : !item.on_state,
          actor,
          mode: !state ? 'subscribe' : 'unsubscribe'
        }
      })
      postRelaysStateTrigger(payload);
    } else if(snakecaseType === 'mode') {
      postModeStateTrigger({ mode_key: switchItem.mode_key, state: !state});
    }
  }

  return (
    <Button color='secondary' sx={{
      '& .MuiPaper-root': {
        // ...(state === true ? {} : {backgroundColor: 'grey.200'})
      }
    }}>
      <Card 
        sx={{ minWidth: 275 }} 
        onClick={handleClick}
      >
        <CardContent>
          <CardHeader
            avatar={
              <Typography sx={{ 
                  fontSize: 14, 
                  fontWeight: 500, 
                  marginBottom: '0px', 
                  alignSelf: 'center',
                  color: state === true ? 'primary.main' : 'text.secondary'
                }} color="primary" gutterBottom>
                  {state === true ? 'on' : 'off'}
                </Typography>
            }
            action={
              <Switch checked={state}/>
            }
          />
          <Icon>{icon}</Icon>
          <Typography sx={{ fontSize: 16, marginBottom: '20px' }} color="text.primary" gutterBottom>
            {name}
          </Typography>
        </CardContent>
      </Card>
    </Button>
  );
}