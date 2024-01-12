import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import Divider from '@mui/material/Divider';
import { Icon} from '@mui/material';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {
  useGetSettingsQuery,
  useUpdateSettingMutation,
  useGetUsbDevicesQuery
} from '../../apis/van-pi/vanpi-app-api';

const SettingsForm = () => {
  const initialState = {
    settings: [],
    usbDevices: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiSettings = useGetSettingsQuery();
  let apiUsbDevices = useGetUsbDevicesQuery();

  const [
    updateSettingTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useUpdateSettingMutation();

  const isLoading = apiSettings.isLoading || apiUsbDevices.isLoading;
  const isFetching = apiSettings.isFetching || apiUsbDevices.isFetching;
  const isSuccess = apiSettings.isSuccess && apiUsbDevices.isSuccess;
  const isError = apiSettings.isError || apiUsbDevices.isError;
  const error = apiSettings.error || apiUsbDevices.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      settings: apiSettings.data,
      usbDevices: apiUsbDevices.data,
      init: true
    });
  };

  const {
    settings,
    usbDevices
  } = state;

  const onSettingChange = (settingKey, attrs) => {
    const newSettings = settings.map(item => {
      if(item.setting_key === settingKey) {
        const newItem = item.clone();
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })

    setState({...state, settings: newSettings})
  };

  const refetchData = () => {
    apiSettings.refetch().then((result) => setState({...state, settings: result.data}));
  };

  const saveSettings = () => {
    settings.forEach(item => {
      updateSettingTrigger(item.toJSONPayload()).then(refetchData);
    });
  };

  const getSetting = (settingKey) => {
    return settings.find(({setting_key}) => setting_key === settingKey);
  }

  const [
    portainerTokenSetting,
    gpsdSetting,
    zigbeeSetting
  ] = [
    getSetting('portainer_access_token'),
    getSetting('gpsd_usb_device'),
    getSetting('zigbee_usb_device')
  ];

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if(isSuccess && state.init) {
    content = (
      <Box sx={{display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 600}}>
        <Typography variant="h6">
          General
        </Typography>
        <TextField
          type="password"
          label="Portainer access token"
          value={portainerTokenSetting.value || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onSettingChange(portainerTokenSetting.setting_key, {value: event.target.value})}
        />

        <FormControl sx={{display: 'flex', margin: '15px', flex: 1}}>
          <InputLabel>{gpsdSetting.label}</InputLabel>
          <Select
            value={gpsdSetting.value || ''}
            label={gpsdSetting.label}
            onChange={(event) => onSettingChange(gpsdSetting.setting_key, {value: event.target.value})}
          >
            {
              usbDevices.map(({vendor_id, product_id, product_name, vendor_name}) => {
                const value = JSON.stringify({
                  vendor_id,
                  product_id
                });
                return (
                  <MenuItem 
                    key={value} 
                    value={value} 
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start'
                    }}
                  >
                    <Typography variant="body1" component="h2">
                      {product_name}
                    </Typography>
                    <Typography variant="caption" component="h2">
                       {vendor_name}
                    </Typography>
                  </MenuItem>
                )
              })
            }
          </Select>
        </FormControl>

        <FormControl sx={{display: 'flex', margin: '15px', flex: 1}}>
          <InputLabel>{zigbeeSetting.label}</InputLabel>
          <Select
            value={zigbeeSetting.value || ''}
            label={zigbeeSetting.label}
            onChange={(event) => onSettingChange(zigbeeSetting.setting_key, {value: event.target.value})}
          >
            {
              usbDevices.map(({vendor_id, product_id, product_name, vendor_name}) => {
                const value = JSON.stringify({
                  vendor_id,
                  product_id
                });
                return (
                  <MenuItem 
                    key={value} 
                    value={value} 
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start'
                    }}
                  >
                    <Typography variant="body1" component="h2">
                      {product_name}
                    </Typography>
                    <Typography variant="caption" component="h2">
                       {vendor_name}
                    </Typography>
                  </MenuItem>
                )
              })
            }
          </Select>
        </FormControl>
      </Box>
    );
  } else if (isError) {
  	const {status, error: message} = error;
    content = <div>{message}</div>
  }

  return (
    <Box
      sx={{
        margin: '0px auto'
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          right: '50px',
          bottom: '50px'
        }}>
        <Fab
          color="primary" 
          aria-label="save"
          onClick={saveSettings}
          sx={{
            marginLeft: '10px'
          }}
        >
          <Icon>check</Icon>
        </Fab>
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        {content}
      </Box>
    </Box>
  )
}

export default SettingsForm;