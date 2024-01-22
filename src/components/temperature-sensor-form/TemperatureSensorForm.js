import { useState } from 'react';

import {
  Card,
  CardContent,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
} from '@mui/material';

import TemperatureSensor from '../../models/TemperatureSensor';

export default function TemperatureSensorForm({temperatureSensor, onChange}) {
  const {
    name,
    connection_type_options,
    connection_type,
    connection_params
  } = temperatureSensor;

  const {
    one_wire_index=''
  } = connection_params;

  return (
    <Card sx={{ width: 400, margin: '20px' }}>
      <CardContent>
        <TextField
          label="Name"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(temperatureSensor, {name: event.target.value})}
        />
        <FormControl sx={{display: 'flex', margin: '15px'}}>
          <InputLabel>Connection type</InputLabel>
          <Select
            value={connection_type || ''}
            label="Connection type"
            onChange={(event) => onChange(temperatureSensor, {connection_type: event.target.value, connection_params: {}})}
          >
            {
              connection_type_options.map(({label, value}) => {
                return <MenuItem key={`connection_type-${value}`} value={value}>{ label }</MenuItem>
              })
            }
          </Select>
        </FormControl>
        {
          connection_type === 'one_wire' && (
            <FormControl sx={{display: 'flex', margin: '15px'}}>
              <InputLabel>One wire position</InputLabel>
              <Select
                value={one_wire_index}
                label="One wire position"
                onChange={(event) => onChange(temperatureSensor, {connection_params: { one_wire_index: event.target.value }})}
              >
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </Select>
            </FormControl>
          )
        }

      </CardContent>
    </Card>
  );
}