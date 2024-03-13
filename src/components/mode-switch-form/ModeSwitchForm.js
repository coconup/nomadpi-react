import {
  Box,
  Card,
  CardContent,
  Icon,
  TextField
} from '@mui/material';

import IconSelect from '../ui/IconSelect';

export default function ModeSwitchForm({modeSwitch, onChange, editable}) {
  const {
    name,
    mode_key,
    icon
  } = modeSwitch;

  return (
    <Card sx={{ width: '80vw', maxWidth: 400, margin: '20px' }}>
      <CardContent>
        <TextField
          label="Name"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(modeSwitch, {name: event.target.value})}
        />
        <TextField
          label="Mode key"
          value={mode_key || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(modeSwitch, {mode_key: event.target.value})}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <IconSelect
            label="Icon"
            sx={{ flex: 1 }}
            value={icon || ''}
            onChange={({ value }) => onChange(modeSwitch, {icon: value})}
          />
          <Icon sx={{marginRight: '15px'}}>{icon}</Icon>
        </Box>
      </CardContent>
    </Card>
  );
}