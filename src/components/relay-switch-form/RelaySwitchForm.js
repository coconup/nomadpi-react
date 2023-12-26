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
    relay_position,
    frontendType, 
    name,
    icon
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
                {relay_position ? `${frontendType} ${relay_position}` : ''}
              </Typography>
              <Icon sx={{marginLeft: '15px'}}>{icon}</Icon>
            </Box>
          }
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <TextField
            label="Relay position"
            value={relay_position || ''}
            sx={{margin: '0px 15px', flex: 1}}
            onChange={(event) => onChange(relaySwitch, {relay_position: event.target.value})}
          />
        </Box>
        <TextField
          label="Label"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(relaySwitch, {name: event.target.value})}
        />
        <TextField
          label="Icon"
          value={icon || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(relaySwitch, {icon: event.target.value})}
        />
      </CardContent>
    </Card>
  );
}