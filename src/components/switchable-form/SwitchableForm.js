import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Icon} from '@mui/material';

export default function SwitchableForm({switchable, onChange}) {
  const {
    type,
    frontendType, 
    id, 
    name='',
    enabled=false, 
    icon=''
  } = switchable;

  return (
    <Card sx={{ width: 275, margin: '20px' }}>
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
                {`${frontendType} ${id}`}
              </Typography>
              <Icon sx={{marginLeft: '15px'}}>{icon}</Icon>
            </Box>
          }
          action={
            <Switch 
              checked={enabled} 
              onChange={(event, enabled) => onChange(switchable, {enabled})}
            />
          }
        />
        <TextField
          label="Label"
          value={name}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(switchable, {name: event.target.value})}
        />
        <TextField
          label="Icon"
          value={icon}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(switchable, {icon: event.target.value})}
        />
      </CardContent>
    </Card>
  );
}