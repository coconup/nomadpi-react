import { useState } from 'react';

import { getApisState } from '../../utils';

import {
  Icon,
  Box,
  Typography,
  TextField,
  Fab,
  MenuItem
} from '@mui/material';

import Select from '../ui/Select';

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
    updateSettingState
  ] = useUpdateSettingMutation();

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors,
  } = getApisState([
    apiSettings,
    apiUsbDevices
  ]);

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

  console.log(settings)

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
    zigbeeSetting,
    microphoneSetting
  ] = [
    getSetting('portainer_access_token'),
    getSetting('gpsd_usb_device'),
    getSetting('zigbee_usb_device'),
    getSetting('microphone_usb_device')
  ];

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if(isSuccess && state.init) {
    const usbOptions = usbDevices.map(({vendor_id, product_id, product_name, vendor_name}) => {
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

        <Select
          label={gpsdSetting.label}
          value={gpsdSetting.value}
          onChange={(event) => onSettingChange(gpsdSetting.setting_key, {value: event.target.value})}
          options={usbOptions}
        />
        <Select
          label={zigbeeSetting.label}
          value={zigbeeSetting.value}
          onChange={(event) => onSettingChange(zigbeeSetting.setting_key, {value: event.target.value})}
          options={usbOptions}
        />
        <Select
          label={microphoneSetting.label}
          value={microphoneSetting.value}
          onChange={(event) => onSettingChange(microphoneSetting.setting_key, {value: event.target.value})}
          options={usbOptions}
        />
      </Box>
    );
  } else if (isError) {
  	const {status, error: message} = errors[0];
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