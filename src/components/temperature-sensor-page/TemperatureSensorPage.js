import { useSelector } from 'react-redux';
import { selectTemperatureSensorsState } from '../../app/store';

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Icon,
  Typography
} from '@mui/material';

import Loading from '../ui/Loading';

export default function TemperatureSensorPage({ temperatureSensor, compact=false }) {
  const {
    id,
    name
  } = temperatureSensor;

  const temperatureSensorState = useSelector(selectTemperatureSensorsState)[id];

  let content;
  if (!temperatureSensorState) {
    return <Loading fullPage size={compact ? 25 : 40} />
  } else {
    const { temperature } = temperatureSensorState;

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
              { temperature.toFixed(1) }
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