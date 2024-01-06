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
import WaterTank from '../../models/WaterTank';

import { useGetWaterTankStateQuery } from '../../apis/van-pi/vanpi-app-api';

export default function WaterTankPage({waterTank}) {
  const {
    name,
    connection_type,
    connection_params
  } = waterTank;

  const {
    device_type,
    device_id
  } = connection_params;

  const initialState = {
    waterTankState: {},
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiWaterTankState = useGetWaterTankStateQuery({connection_type, device_type, device_id});

  const isLoading = apiWaterTankState.isLoading;
  const isFetching = apiWaterTankState.isFetching;
  const isSuccess = apiWaterTankState.isSuccess;
  const isError = apiWaterTankState.isError;
  const error = apiWaterTankState.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      waterTankState: apiWaterTankState.data,
      init: true
    });
  };

  const { waterTankState } = state;

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
            {waterTankState.SoC} %
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