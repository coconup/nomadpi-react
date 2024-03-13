import TextField from '@mui/material/TextField';

import {
  Card,
  CardContent
} from '@mui/material';

import Select from '../ui/Select';

export default function BatteryForm({battery, onChange, editable}) {
  const {
    name,
    connection_type,
    connection_params,
    connection_type_options,
    device_type_options
  } = battery;

  const {
    device_type,
    device_id
  } = connection_params;

  return (
    <Card sx={{ width: '80vw', maxWidth: 400, margin: '20px' }}>
      <CardContent>
        <TextField
          label="Name"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(battery, {name: event.target.value})}
        />
        <Select 
          label="Connection type"
          value={connection_type}
          onChange={(event) => onChange(battery, {connection_type: event.target.value, connection_params: {}})}
          options={connection_type_options}
        />
        <Select 
          label="Device type"
          value={device_type}
          onChange={(event) => onChange(battery, {connection_params: {...connection_params, device_type: event.target.value}})}
          options={device_type_options}
        />
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