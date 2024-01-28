import { useTheme } from '@mui/material/styles';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const SelectComponent = ({ label, value, options, onChange, sx={} }) => {
  const theme = useTheme();

  return (
    <FormControl sx={{display: 'flex', margin: '15px', ...sx}}>
      <InputLabel>{ label }</InputLabel>
      <Select
        value={value || ''}
        label={label}
        onChange={onChange}
      >
        {
          options.map(({label: optionLabel, value: optionValue}, i) => {
            return <MenuItem key={`${label}-${optionValue}-${i}`} value={optionValue}>{ optionLabel }</MenuItem>
          })
        }
      </Select>
    </FormControl>
  )
}

export default SelectComponent;