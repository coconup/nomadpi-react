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
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import { Icon} from '@mui/material';
import Sensor from '../../models/Sensor';

export default function SensorForm({sensor, onChange, editable}) {
  const {
    name,
    sensor_type,
    connection_type,
    connection_params
  } = sensor;

  const {
    mqtt_topic
  } = connection_params;

  return (
    <Card sx={{ width: 400, margin: '20px' }}>
      <CardContent>
        <TextField
          label="Name"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(sensor, {name: event.target.value})}
        />
        <FormControl sx={{display: 'flex', margin: '15px'}}>
          <InputLabel>Sensor type</InputLabel>
          <Select
            value={sensor_type || ''}
            label="Sensor type"
            onChange={(event) => onChange(sensor, {sensor_type: event.target.value, connection_params: {}})}
          >
            <MenuItem value={'vibration'}>Vibration sensor</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{display: 'flex', margin: '15px'}}>
          <InputLabel>Connection type</InputLabel>
          <Select
            value={connection_type || ''}
            label="Connection type"
            onChange={(event) => onChange(sensor, {connection_type: event.target.value, connection_params: {}})}
          >
            <MenuItem value={'mqtt'}>MQTT</MenuItem>
          </Select>
        </FormControl>
        {
          connection_type === 'mqtt' && (
            <Box>
              <TextField
                label="MQTT topic"
                value={mqtt_topic || ''}
                sx={{margin: '15px', display: 'flex'}}
                onChange={(event) => onChange(sensor, {connection_params: {...connection_params, mqtt_topic: event.target.value}})}
              />
            </Box>
          )
        }
      </CardContent>
    </Card>
  );
}