import { useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  Divider,
  Fab,
  FormControl,
  Icon,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';

export default function ActionSwitchForm({
  actionSwitch, 
  relaySwitches: relaySwitchOptions,
  wifiRelaySwitches: wifiSwitchOptions,
  heaterSwitches: heaterSwitchOptions,
  onChange, 
  onDelete
}) {
  const {
    name,
    icon='',
    switches=[]
  } = actionSwitch;

  const handleSwitchChange = (_index, switchItem) => {
    const newSwitches = switches.map((item, index) => ({
      ...item,
      ...index === _index ? { switch_id: switchItem.id, switch_type: switchItem.snakecaseType } : {}
    }));

    onChange(actionSwitch, {switches: newSwitches});
  }

  const handleStateChange = (state_type, _index, value) => {
    const newSwitches = switches.map((item, index) => ({
      ...item,
      ...index === _index ? { [`${state_type}_state`]: value } : {}
    }));

    onChange(actionSwitch, {switches: newSwitches});
  }

  const addItem = () => {
    const newItem = {
      switch_id: null,
      state: false
    }
    onChange(actionSwitch, {switches: [...switches, newItem]})
  }

  const removeSwitch = (item) => {
    onChange(actionSwitch, {switches: switches.filter(({switch_id}) => switch_id !== item.switch_id)})
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
            switches.map((switchItem, index) => {
              return(
                <Box
                  key={`Switch-${actionSwitch.id}-${index}`}
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
                      value={switchItem.switch_id ? `${switchItem.switch_type}-${switchItem.switch_id}` : ''}
                      label="Switch"
                      onChange={(event, option) => {
                        const value = event.target.value;
                        let newSwitch;
                        if(value.startsWith('relay')) {
                          newSwitch = relaySwitchOptions.find(({id, snakecaseType}) => `${snakecaseType}-${id}` === value);
                        } else if(value.startsWith('wifi_relay')) {
                          newSwitch = wifiSwitchOptions.find(({id, snakecaseType}) => `${snakecaseType}-${id}` === value);
                        }else if(value.startsWith('heater')) {
                          newSwitch = heaterSwitchOptions.find(({id, snakecaseType}) => `${snakecaseType}-${id}` === value);
                        }
                        handleSwitchChange(index, newSwitch);
                      }}
                    >
                      {
                        [...relaySwitchOptions, ...wifiSwitchOptions, ...heaterSwitchOptions].map(({id, name, snakecaseType, key}) => (
                          <MenuItem key={`Switch-${actionSwitch.id}-${index}-${key}`} value={`${snakecaseType}-${id}`}>{name}</MenuItem>
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
                      value={switchItem.on_state}
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
                    onClick={() => removeSwitch(index)}
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