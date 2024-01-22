import { useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Icon,
  Typography
} from '@mui/material';

// import TemperatureSensor from '../../models/TemperatureSensor';

export default function TemperatureSensorPage({ temperatureSensor, temperatureState, isLoading, compact=false }) {
  const { name } = temperatureSensor;

  // OFFLINE editing
  temperatureState = {
    value: 26
  };

  const { value } = temperatureState;

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else {
    content = (
      <Card
        sx={{
          flex: 1
        }}
      >
        <CardContent>
          <Box
            sx={{
              mb: '20px',
              textAlign: 'left'
            }}
          >
            <Typography variant={compact ? "h6" : "h4"}>
              { name }
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              mt: '20px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start'
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 300
              }}
            >
              { value }
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{
                fontWeight: 300
              }}
            >
              ° C
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return content;
}