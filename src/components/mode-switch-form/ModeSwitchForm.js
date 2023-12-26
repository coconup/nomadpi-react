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
import ModeSwitch from '../../models/ModeSwitch';

export default function ModeSwitchForm({modeSwitch, onChange, editable}) {
  const {
    frontendType, 
    name,
    mode_key,
    icon
  } = modeSwitch;

  return (
    <Card sx={{ width: 400, margin: '20px' }}>
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
          }}>
          <TextField
            label="Icon"
            value={icon || ''}
            sx={{margin: '0px 15px', flex: 1}}
            onChange={(event) => onChange(modeSwitch, {icon: event.target.value})}
          />
          <Icon sx={{marginRight: '15px'}}>{icon}</Icon>
        </Box>
      </CardContent>
    </Card>
  );
}