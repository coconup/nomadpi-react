import icons from './icons.json';
import { toReadableName } from '../../utils';

import {
  Autocomplete,
  Box,
  Icon,
  TextField,
  Typography
} from '@mui/material';

const IconSelectComponent = ({ label, value, options, onChange, disabled, sx={} }) => {
  console.log("VALUE", value)
  return (
    <Autocomplete
      sx={{ pr: '30px', ...sx }}
      disabled={disabled || false}
      options={icons.map(icon => ({ label: toReadableName(icon), value: icon }))}
      onChange={(_, option) => onChange(option || {})}
      value={toReadableName(value) || ''}
      renderOption={(props, option={}) => {
        const {
          value,
          label
        } = option;

        return (
          <li {...props}>
            <Box sx={{
              display: 'flex',
              padding: '10px 15px'
            }}>
              <Icon>{value}</Icon>
              <Typography sx={{ ml: '10px' }}>{label}</Typography>
            </Box>
          </li>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{display: 'flex', margin: '15px', ...sx}}
        />
      )}
    />
  )
}

export default IconSelectComponent;