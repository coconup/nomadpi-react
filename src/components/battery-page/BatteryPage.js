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
import Battery from '../../models/Battery';

import { useGetBatteryStateQuery } from '../../apis/van-pi/vanpi-app-api';

export default function BatteryPage({battery}) {
  const {
    name,
    connection_type,
    connection_params
  } = battery;

  const {
    device_type,
    device_id
  } = connection_params;

  const initialState = {
    batteryState: {},
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiBatteryState = useGetBatteryStateQuery({connection_type, device_type, device_id});

  const isLoading = apiBatteryState.isLoading;
  const isFetching = apiBatteryState.isFetching;
  const isSuccess = apiBatteryState.isSuccess;
  const isError = apiBatteryState.isError;
  const error = apiBatteryState.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      batteryState: apiBatteryState.data,
      init: true
    });
  };

  const { batteryState } = state;

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if(isSuccess && state.init) {
    content = (
      <Card sx={{ width: 400, margin: '20px' }}>
        <CardContent>
          <Typography
            variant="h6"
          >
            {name}
          </Typography>
          <Box>
            {batteryState.SoC} %
          </Box>
        </CardContent>
      </Card>
    );
  } else if (isError) {
    const {status, error: message} = error;
    content = <div>{message}</div>
  }

  return content;
}