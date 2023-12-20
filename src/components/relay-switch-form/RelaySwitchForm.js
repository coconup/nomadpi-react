import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Icon} from '@mui/material';
import RelaySwitch from '../../models/RelaySwitch';

export default function RelaySwitchForm({relaySwitch, onChange, editable}) {
  const {
    target_id,
    target_type,
    frontendType, 
    name,
    icon,
    enabled
  } = relaySwitch;

  return (
    <Card sx={{ width: 400, margin: '20px' }}>
      <CardContent>
        <CardHeader
          avatar={
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              <Typography 
                sx={{ 
                  fontSize: 16, 
                  fontWeight: 500, 
                  marginBottom: '0px', 
                  alignSelf: 'center'
                }} color="primary" gutterBottom>
                {frontendType && target_id ? `${frontendType} ${target_id}` : ''}
              </Typography>
              <Icon sx={{marginLeft: '15px'}}>{icon}</Icon>
            </Box>
          }
          action={
            <Switch
              checked={enabled}
              onChange={(event, value) => onChange(relaySwitch, {enabled: value})}
            />
          }
        />
        {
          editable &&
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <FormControl sx={{margin: '0px 15px', flex: 3}}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={target_type || ''}
                  label="Type"
                  onChange={(event) => onChange(relaySwitch, {target_type: event.target.value})}
                >
                  <MenuItem value={'relay'}>Relay</MenuItem>
                  <MenuItem value={'wifi_relay'}>WiFi Relay</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="ID"
                value={target_id || ''}
                sx={{marginRight: '15px', flex: 1}}
                onChange={(event) => onChange(relaySwitch, {target_id: event.target.value})}
              />
            </Box>
        }
        {
          editable &&
            <TextField
              label="Label"
              value={name || ''}
              sx={{margin: '15px', display: 'flex'}}
              onChange={(event) => onChange(relaySwitch, {name: event.target.value})}
            />
        }
        {
          editable &&
            <TextField
              label="Icon"
              value={icon || ''}
              sx={{margin: '15px', display: 'flex'}}
              onChange={(event) => onChange(relaySwitch, {icon: event.target.value})}
            />
        }
      </CardContent>
    </Card>
  );
}