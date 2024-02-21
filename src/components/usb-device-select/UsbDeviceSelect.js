import { useState } from 'react';

import {
  Box,
  Typography,
} from '@mui/material';

import { getApisState } from '../../utils';
import Select from '../ui/Select';
import Loading from '../ui/Loading';

import { useGetUsbDevicesQuery } from '../../apis/nomadpi/nomadpi-app-api';

export default function UsbDeviceSelect({
  label,
  value,
  attributes=[
    'vendor_id',
    'product_id'
  ],
  onChange
}) {
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
    return <Loading />
  } else if(isSuccess && state.init) {
    const usbOptions = usbDevices.map((item, i) => {
      const {
        bus_id,
        device_id,
        product_id,
        product_name,
        vendor_id,
        vendor_name,
        serial_id,
      } = item;
      
      const value = JSON.stringify({
        ...attributes.includes('vendor_id') ? { vendor_id } : {},
        ...attributes.includes('product_id') ? { product_id } : {},
        ...attributes.includes('bus_id') ? { bus_id } : {},
        ...attributes.includes('device_id') ? { device_id } : {},
        ...attributes.includes('serial_id') ? { serial_id } : {},
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
        value={value ? JSON.stringify(value) : ''}
        onChange={(event) => onChange(JSON.parse(event.target.value))}
        options={usbOptions}
      />
    )
  } else if (isError) {
  	const {status, error: message} = errors[0];
    return <div>{message}</div>
  }
}