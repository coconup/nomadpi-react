import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import { Icon} from '@mui/material';
import Fab from '@mui/material/Fab';

export default function ActionSwitchForm({
  actionSwitch, 
  relaySwitches: relaySwitchOptions, 
  wifiRelaySwitches: wifiRelaySwitchOptions, 
  onChange, 
  onDelete
}) {
  const {
    name,
    icon='',
    switches: relaySwitches=[]
  } = actionSwitch;

  console.log(relaySwitchOptions)

  const handleRelaySwitchChange = (_index, relaySwitch) => {
    const newRelaySwitches = relaySwitches.map((item, index) => ({
      ...item,
      ...index === _index ? { switch_id: relaySwitch.id, switch_type: relaySwitch.snakecaseType } : {}
    }));

    onChange(actionSwitch, {switches: newRelaySwitches});
  }

  const handleStateChange = (state_type, _index, value) => {
    const newRelaySwitches = relaySwitches.map((item, index) => ({
      ...item,
      ...index === _index ? { [`${state_type}_state`]: value } : {}
    }));

    onChange(actionSwitch, {switches: newRelaySwitches});
  }

  const addItem = () => {
    const newItem = {
      switch_id: null,
      state: false
    }
    onChange(actionSwitch, {switches: [...relaySwitches, newItem]})
  }

  const removeRelaySwitch = (item) => {
    onChange(actionSwitch, {switches: relaySwitches.filter(({switch_id}) => switch_id !== item.switch_id)})
  }

  return (
    <Card sx={{ width: 600, margin: '20px' }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <TextField
            label="Label"
            value={name}
            sx={{margin: '5px 15px', flex: 1}}
            onChange={(event) => onChange(actionSwitch, {name: event.target.value})}
          />
          <Fab 
            size="small"
            color="primary" 
            aria-label="edit"
            onClick={() => onDelete(actionSwitch)}
            sx={{
              marginRight: '5px'
            }}
          >
            <Icon>remove</Icon>
          </Fab>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <TextField
            label="Icon"
            value={icon}
            sx={{margin: '5px 15px', display: 'flex', flex: 1}}
            onChange={(event) => onChange(actionSwitch, {icon: event.target.value})}
          />
          <Icon sx={{marginRight: '15px'}}>{icon}</Icon>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Divider 
            sx={{flex: 3, margin: '15px'}}
          />
          <Fab 
            size="small"
            color="primary" 
            aria-label="edit"
            onClick={addItem}
            sx={{
              marginRight: '5px'
            }}
          >
            <Icon>add</Icon>
          </Fab>
        </Box>
        <Box>
          {
            relaySwitches.map((relaySwitch, index) => {
              let relay;
              if(relaySwitch.switch_type === 'relay') {
                relay = relaySwitchOptions.find(({id}) => id === relaySwitch.switch_id);
              } else if(relaySwitch.switch_type === 'wifi_relay') {
                relay = wifiRelaySwitchOptions.find(({id}) => id === relaySwitch.switch_id);
              }

              return(
                <Box
                  key={`RelaySwitch-${actionSwitch.id}-${index}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >

                  <FormControl 
                    sx={{
                      flex: 6,
                      margin: '5px 15px'
                    }}
                  >
                    <InputLabel>Switch</InputLabel>
                    <Select
                      value={relaySwitch.switch_id ? `${relaySwitch.switch_type}-${relaySwitch.switch_id}` : ''}
                      label="Switch"
                      onChange={(event, option) => {
                        const value = event.target.value;
                        let newRelay;
                        if(value.startsWith('relay')) {
                          newRelay = relaySwitchOptions.find(({id, snakecaseType}) => `${snakecaseType}-${id}` === value);
                        } else if(value.startsWith('wifi_relay')) {
                          newRelay = wifiRelaySwitchOptions.find(({id, snakecaseType}) => `${snakecaseType}-${id}` === value);
                        }
                        handleRelaySwitchChange(index, newRelay);
                      }}
                    >
                      {
                        [...relaySwitchOptions, ...wifiRelaySwitchOptions].map(({id, name, snakecaseType, key}) => (
                          <MenuItem key={`RelaySwitch-${actionSwitch.id}-${index}-${key}`} value={`${snakecaseType}-${id}`}>{name}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                  <FormControl 
                    sx={{
                      flex: 3,
                      marginRight: '15px'
                    }}
                  >
                    <InputLabel>ON state</InputLabel>
                    <Select
                      value={relaySwitch.on_state}
                      label="ON state"
                      onChange={(event, option) => {
                        handleStateChange('on', index, event.target.value)
                      }}
                    >
                      <MenuItem value={true}>On</MenuItem>
                      <MenuItem value={false}>Off</MenuItem>
                    </Select>
                  </FormControl>
                  <Fab 
                    size="small"
                    color="secondary" 
                    aria-label="edit"
                    onClick={() => removeRelaySwitch(index)}
                    sx={{
                      margin: '0px 5px 0px 15px'
                    }}
                  >
                    <Icon>remove</Icon>
                  </Fab>
                </Box>
              )
            })
          }
        </Box>
      </CardContent>
    </Card>
  );
}