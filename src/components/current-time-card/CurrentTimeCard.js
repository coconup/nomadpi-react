import tzlookup from 'tz-lookup';
import Clock from 'react-live-clock';

import { useTheme } from '@mui/material/styles';

import {
  Paper,
  Typography
} from '@mui/material';

export default function CurrentTimeCard({latitude, longitude}) {
  const theme = useTheme();

  const timezone = tzlookup(latitude, longitude);

  return (
    <Paper
      sx={{padding: '20px'}}
    >
      <Typography variant="h3">
        <Clock
          format={'HH:mm:ss'}
          ticking={true}
          timezone={timezone}
        />
      </Typography>
    </Paper>
  );
};