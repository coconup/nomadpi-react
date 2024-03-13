import {
  Box,
  Typography
} from '@mui/material';

export default function Metric({ label, value, unit }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: '0px 45px 20px 0px'
      }}
    >
      <Typography
        variant="body2"
        color="primary.light"
        sx={{
          lineHeight: 1.2,
          marginBottom: '4px'
        }}
      >
        { label }
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'baseline'
        }}
      >
        <Typography
          variant="h5"
          color="text.primary"
        >
          { value }
        </Typography>
        <Typography variant="body1" component="h6" color="text.secondary">
          &nbsp;{ unit }
        </Typography>
      </Box>
    </Box>
  );
};