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
import WaterTank from '../../models/WaterTank';

export default function WaterTankForm({waterTank, onChange, editable}) {
  const {
    name,
    connection_type,
    connection_params,
    volumetric_type,
    volumetric_params
  } = waterTank;

  const {
    device_type,
    device_id,
    mqtt_topic
  } = connection_params;

  const {
    sensor_distance_when_full,
    length,
    width,
    height,
    diameter
  } = volumetric_params;

  return (
    <Card sx={{ width: 400, margin: '20px' }}>
      <CardContent>
        <TextField
          label="Name"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(waterTank, {name: event.target.value})}
        />
        <FormControl sx={{display: 'flex', margin: '15px'}}>
          <InputLabel>Connection type</InputLabel>
          <Select
            value={connection_type || ''}
            label="Connection type"
            onChange={(event) => onChange(waterTank, {connection_type: event.target.value, connection_params: {}})}
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
                onChange={(event) => onChange(waterTank, {connection_params: {mqtt_topic: event.target.value}})}
              />
              <Divider 
                sx={{flex: 1, margin: '15px'}}
              />
              <FormControl sx={{display: 'flex', margin: '15px'}}>
                <InputLabel>Volumetric type</InputLabel>
                <Select
                  value={volumetric_type || ''}
                  label="Volumetric type"
                  onChange={(event) => onChange(waterTank, {volumetric_type: event.target.value, volumetric_params: {}})}
                >
                  <MenuItem value={'rectangular'}>Rectangular box</MenuItem>
                  <MenuItem value={'cylindrical'}>Cylindrical box</MenuItem>
                </Select>
              </FormControl>
              {
                ['rectangular', 'cylindrical'].includes(volumetric_type) && (
                  <TextField
                    label="Height"
                    value={height || ''}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                    }}
                    sx={{margin: '15px', display: 'flex'}}
                    onChange={(event) => onChange(waterTank, {volumetric_params: {...volumetric_params, height: event.target.value}})}
                  />
                )
              }
              {
                volumetric_type === 'rectangular' && (
                  <Box>
                    <TextField
                      label="Width"
                      value={width || ''}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                      }}
                      sx={{margin: '15px', display: 'flex'}}
                      onChange={(event) => onChange(waterTank, {volumetric_params: {...volumetric_params, width: event.target.value}})}
                    />
                    <TextField
                      label="Length"
                      value={length || ''}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                      }}
                      sx={{margin: '15px', display: 'flex'}}
                      onChange={(event) => onChange(waterTank, {volumetric_params: {...volumetric_params, length: event.target.value}})}
                    />
                  </Box>
                )
              }
              {
                volumetric_type === 'cylindrical' && (
                  <TextField
                    label="Diameter"
                    value={diameter || ''}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                    }}
                    sx={{margin: '15px', display: 'flex'}}
                    onChange={(event) => onChange(waterTank, {volumetric_params: {...volumetric_params, diameter: event.target.value}})}
                  />
                )
              }
              {
                ['rectangular', 'cylindrical'].includes(volumetric_type) && (
                  <TextField
                    label="Sensor distance when full"
                    value={sensor_distance_when_full || ''}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                    }}
                    sx={{margin: '15px', display: 'flex'}}
                    onChange={(event) => onChange(waterTank, {volumetric_params: {...volumetric_params, sensor_distance_when_full: event.target.value}})}
                  />
                )
              }
            </Box>
          )
        }
      </CardContent>
    </Card>
  );
}