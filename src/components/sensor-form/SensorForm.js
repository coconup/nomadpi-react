import {
  Box,
  Card,
  CardContent,
  TextField,
} from '@mui/material';

import Select from '../ui/Select';

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
    <Card sx={{ width: '80vw', maxWidth: 400, margin: '20px' }}>
      <CardContent>
        <TextField
          label="Name"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(sensor, {name: event.target.value})}
        />
        <Select
          label="Sensor type"
          value={sensor_type}
          onChange={(event) => onChange(sensor, {sensor_type: event.target.value, connection_params: {}})}
          options={[
            {value: 'vibration', label: 'Vibration sensor'}
          ]}
        />
        <Select
          label="Connection type"
          value={connection_type}
          onChange={(event) => onChange(sensor, {connection_type: event.target.value, connection_params: {}})}
          options={[{ value: 'mqtt', label: 'MQTT' }]}
        />
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