import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Icon,
  TextField,
  Typography,
} from '@mui/material';

import IconSelect from '../ui/IconSelect';

export default function RelaySwitchForm({relaySwitch, onChange, editable}) {
  const {
    relay_position,
    frontendType, 
    name,
    icon
  } = relaySwitch;

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
                {relay_position ? `${frontendType} ${relay_position}` : 'New relay'}
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
        <IconSelect
          label="Icon"
          value={icon || ''}
          onChange={({ value }) => onChange(relaySwitch, {icon: value})}
        />
      </CardContent>
    </Card>
  );
}