import { useState } from 'react';

import {
  Box,
  Typography,
} from '@mui/material';

import { getApisState } from '../../utils';
import Select from '../ui/Select';

import { useGetUsbDevicesQuery } from '../../apis/van-pi/vanpi-app-api';

export default function UsbDeviceSelect({ label, value, onChange}) {
  const initialState = {
    usbDevices: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiUsbDevices = useGetUsbDevicesQuery();

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors,
  } = getApisState([
    apiUsbDevices
  ]);

  if(isSuccess && !state.init) {
    setState({
      ...state,
      usbDevices: apiUsbDevices.data,
      init: true
    });
  };

  const {
    usbDevices
  } = state;

  let content;
  if (isLoading) {
    return <div>Loading</div>
  } else if(isSuccess && state.init) {
    const usbOptions = usbDevices.map(({vendor_id, product_id, product_name, vendor_name}, i) => {
      const value = JSON.stringify({
        vendor_id,
        product_id
      });

      return {
        value,
        label: (
          <Box>
            <Typography variant="body1" component="h2">
              {product_name}
            </Typography>
            <Typography variant="caption" component="h2">
               {vendor_name}
            </Typography>
          </Box>
        )
      }
    });

    return (
      <Select
        label={label}
        value={JSON.stringify(value)}
        onChange={(event) => onChange(JSON.parse(event.target.value))}
        options={usbOptions}
      />
    )
  } else if (isError) {
  	const {status, error: message} = errors[0];
    return <div>{message}</div>
  }
}