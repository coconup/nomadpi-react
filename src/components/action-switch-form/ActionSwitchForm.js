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
import Autocomplete from '@mui/material/Autocomplete';
import Divider from '@mui/material/Divider';
import { Icon} from '@mui/material';
import Fab from '@mui/material/Fab';

export default function ActionSwitchForm({actionSwitch, switchableItems, onChange, onDelete}) {
  const {
    name,
    icon='',
    items=[]
  } = actionSwitch;

  const handleSwitchableChange = (_index, value) => {
    const newItems = actionSwitch.items.map((item, index) => ({
      ...item,
      ...index === _index ? { switchable: switchableItems.find(({name}) => name === value) } : {}
    }));

    onChange(actionSwitch, {items: newItems});
  }

  const handleStateChange = (_index, value) => {
    const newItems = actionSwitch.items.map((item, index) => ({
      ...item,
      ...index === _index ? { state: value } : {}
    }));

    onChange(actionSwitch, {items: newItems});
  }

  const addItem = () => {
    const { items } = actionSwitch;
    const newItem = {
      switchable: null,
      state: false
    }
    onChange(actionSwitch, {items: [...items, newItem]})
  }

  const removeItem = (index) => {
    const { items } = actionSwitch;
    const newItems = items.filter((el, i) => i !== index)
    onChange(actionSwitch, {items: newItems})
  }

  const switchableOptions = (
    switchableItems
      .filter(({enabled, name}) => enabled)
      .map(({name}) => name)
  );

  return (
    <Card sx={{ width: 400, margin: '20px' }}>
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
            items.map((item, index) => {
              return(
                <Box
                  key={`ActionSwitchItem-${actionSwitch.id}-${index}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Autocomplete 
                    sx={{
                      flex: 1,
                      margin: '5px 15px'
                    }}
                    options={switchableOptions}
                    onChange={(event, value) => handleSwitchableChange(index, value)}
                    value={item.switchable ? item.switchable.name : ''}
                    renderInput={(params) => <TextField {...params} label="Switch" />}
                  />
                  <Switch 
                    checked={item.state}
                    onChange={(event, value) => handleStateChange(index, value)}
                  />
                  <Fab 
                    size="small"
                    color="secondary" 
                    aria-label="edit"
                    onClick={() => removeItem(index)}
                    sx={{
                      marginRight: '5px'
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