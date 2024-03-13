import { 
  Box,
  Card,
  CardContent,
  CardHeader,
  Icon,
  TextField,
  Typography
} from '@mui/material';

import IconSelect from '../ui/IconSelect';
import Select from '../ui/Select';

export default function WifiRelaySwitchForm({wifiRelaySwitch, onChange, editable}) {
  const {
    frontendType,
    name,
    icon,
    relay_position,
    mqtt_topic,
    vendor_id
  } = wifiRelaySwitch;

  return (
    <Card sx={{ width: '80vw', maxWidth: 400, margin: '20px' }}>
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
                {relay_position ? `${frontendType} ${relay_position}` : 'New WiFi relay'}
              </Typography>
              <Icon sx={{marginLeft: '15px'}}>{icon}</Icon>
            </Box>
          }
        />
        <Select
          label="Vendor type"
          value={vendor_id}
          onChange={(event) => onChange(wifiRelaySwitch, {vendor_id: event.target.value})}
          options={[
            {value: 'tasmota', label: 'Tasmota'}
          ]}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <TextField
            label="MQTT topic"
            value={mqtt_topic || ''}
            sx={{margin: '0px 15px', flex: 1}}
            onChange={(event) => onChange(wifiRelaySwitch, {mqtt_topic: event.target.value})}
          />
          <TextField
            label="Relay position"
            value={relay_position || ''}
            sx={{margin: '0px 15px', flex: 1}}
            onChange={(event) => onChange(wifiRelaySwitch, {relay_position: event.target.value})}
          />
        </Box>
        <TextField
          label="Label"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(wifiRelaySwitch, {name: event.target.value})}
        />
        <IconSelect
          label="Icon"
          value={icon || ''}
          onChange={({ value }) => onChange(wifiRelaySwitch, {icon: value})}
        />
      </CardContent>
    </Card>
  );
}