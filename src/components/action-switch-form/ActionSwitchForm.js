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

export default function ActionSwitchForm({actionSwitch, relaySwitches: relaySwitchOptions, onChange, onDelete}) {
  const {
    name,
    icon='',
    relay_switches: relaySwitches=[]
  } = actionSwitch;

  const handleRelaySwitchChange = (_index, value) => {
    const newRelaySwitches = relaySwitches.map((item, index) => ({
      ...item,
      ...index === _index ? { relay_switch_id: value } : {}
    }));

    onChange(actionSwitch, {relay_switches: newRelaySwitches});
  }

  const handleStateChange = (state_type, _index, value) => {
    const newRelaySwitches = relaySwitches.map((item, index) => ({
      ...item,
      ...index === _index ? { [`${state_type}_state`]: value } : {}
    }));

    onChange(actionSwitch, {relay_switches: newRelaySwitches});
  }

  const addItem = () => {
    const newItem = {
      relay_switch_id: null,
      state: false
    }
    onChange(actionSwitch, {relay_switches: [...relaySwitches, newItem]})
  }

  const removeRelaySwitch = (item) => {
    onChange(actionSwitch, {relay_switches: relaySwitches.filter(({relay_switch_id}) => relay_switch_id !== item.relay_switch_id)})
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
                      value={relaySwitch.relay_switch_id ? relaySwitch.relay_switch_id : ''}
                      label="Switch"
                      onChange={(event, option) => {
                        handleRelaySwitchChange(index, event.target.value)
                      }}
                    >
                      {
                        relaySwitchOptions.map(({id, name, key}) => (
                          <MenuItem key={`RelaySwitch-${actionSwitch.id}-${index}-${key}`} value={id}>{name}</MenuItem>
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
                  <FormControl 
                    sx={{
                      flex: 3
                    }}
                  >
                    <InputLabel>OFF state</InputLabel>
                    <Select
                      value={relaySwitch.off_state}
                      label="OFF state"
                      onChange={(event, option) => {
                        handleStateChange('off', index, event.target.value)
                      }}
                    >
                      <MenuItem value={'ignore'}>Ignore</MenuItem>
                      <MenuItem value={'toggle'}>Toggle</MenuItem>
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