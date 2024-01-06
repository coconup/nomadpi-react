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
import Battery from '../../models/Battery';

export default function BatteryForm({battery, onChange, editable}) {
  const {
    name,
    connection_type,
    connection_params
  } = battery;

  const {
    device_type,
    device_id
  } = connection_params;

  return (
    <Card sx={{ width: 400, margin: '20px' }}>
      <CardContent>
        <TextField
          label="Name"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(battery, {name: event.target.value})}
        />
        <FormControl sx={{display: 'flex', margin: '15px'}}>
          <InputLabel>Connection type</InputLabel>
          <Select
            value={connection_type || ''}
            label="Connection type"
            onChange={(event) => onChange(battery, {connection_type: event.target.value, connection_params: {}})}
          >
            <MenuItem value={'ble'}>Bluetooth</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{display: 'flex', margin: '15px'}}>
          <InputLabel>Device type</InputLabel>
          <Select
            value={device_type || ''}
            label="Device type"
            onChange={(event) => onChange(battery, {connection_params: {...connection_params, device_type: event.target.value}})}
          >
            <MenuItem value={'jbd'}>JBD BMS</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Device ID (MAC Address)"
          value={device_id || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(battery, {connection_params: {...connection_params, device_id: event.target.value}})}
        />
      </CardContent>
    </Card>
  );
}