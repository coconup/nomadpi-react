import {
  Card,
  CardContent,
  Box,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';

import Select from '../ui/Select';

export default function WaterTankForm({waterTank, onChange, editable}) {
  const {
    name,
    connection_type,
    connection_params,
    volumetric_type,
    volumetric_params,
    water_tank_settings
  } = waterTank;

  const {
    mqtt_topic
  } = connection_params;

  const {
    sensor_distance_when_full,
    length,
    width,
    height,
    diameter
  } = volumetric_params;

  const {
    color,
    alert_on
  } = water_tank_settings;

  return (
    <Card sx={{ width: '80vw', maxWidth: 400, margin: '20px' }}>
      <CardContent>
        <TextField
          label="Name"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(waterTank, {name: event.target.value})}
        />
        <Select
          label="Connection type"
          value={connection_type}
          onChange={(event) => onChange(waterTank, {connection_type: event.target.value, connection_params: {}})}
          options={[{ value: 'mqtt', label: 'MQTT' }]}
        />
        {
          connection_type === 'mqtt' && (
            <Box>
              <TextField
                label="MQTT topic"
                value={mqtt_topic || ''}
                sx={{margin: '15px', display: 'flex'}}
                onChange={(event) => onChange(waterTank, {connection_params: {mqtt_topic: event.target.value}})}
              />
            </Box>
          )
        }
        {
          connection_type && (
            <Box>
              <Divider 
                sx={{flex: 1, margin: '15px'}}
              />
              <Select
                label="Color"
                value={color}
                onChange={(event) => onChange(waterTank, {water_tank_settings: {...water_tank_settings, color: event.target.value}})}
                options={[
                  {
                    value: 'blue',
                    label: 'Blue'
                  },
                  {
                    value: 'grey',
                    label: 'Grey'
                  }
                ]}
              />
              <Select
                label="Alert when"
                value={alert_on}
                onChange={(event) => onChange(waterTank, {water_tank_settings: {...water_tank_settings, alert_on: event.target.value}})}
                options={[
                  {
                    value: 'empty',
                    label: 'Empty'
                  },
                  {
                    value: 'full',
                    label: 'Full'
                  }
                ]}
              />
              <Divider 
                sx={{flex: 1, margin: '15px'}}
              />
              <Select
                label="Volumetric type"
                value={volumetric_type}
                onChange={(event) => onChange(waterTank, {volumetric_type: event.target.value, volumetric_params: {}})}
                options={[
                  {
                    value: 'rectangular',
                    label: 'Rectangular box'
                  },
                  {
                    value: 'cylindrical',
                    label: 'Cylindrical box'
                  }
                ]}
              />
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