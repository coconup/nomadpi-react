import { useState } from 'react';
import { useSelector } from 'react-redux';

import { getApisState } from '../../utils';

import {
  Icon,
  Box,
  Fab,
  FormGroup,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import Container from '../ui/Container';
import Select from '../ui/Select';

import UsbDeviceSelect from '../usb-device-select/UsbDeviceSelect';

import { useUpdateSettingMutation } from '../../apis/van-pi/vanpi-app-api';

const SettingsForm = () => {
  const { settings: storeSettings } = useSelector(state => state.settings);

  const [settings, setSettings] = useState(null);

  if(storeSettings && !settings) {
    setSettings(
      storeSettings.filter(({ setting_key }) => {
        return [
          'portainer_access_token',
          'gpsd_usb_device',
          'zigbee_usb_device',
          'voice_assistant_voice_id',
          'voice_assistant_enabled',
        ].includes(setting_key);
      })
    );
  };

  const [
    updateSettingTrigger, 
    updateSettingState
  ] = useUpdateSettingMutation();

  const onSettingChange = ({ setting_key }, attrs) => {
    const newSettings = settings.map(item => {
      if(item.setting_key === setting_key) {
        const newItem = item.clone();
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })

    setSettings(newSettings);
  };

  const saveSettings = () => {
    settings.forEach(item => {
      updateSettingTrigger(item.toJSONPayload());
    });
  };

  let content;
  if (!settings) {
    content = <div>Loading</div>
  } else {
    const [
      portainerTokenSetting,
      gpsdSetting,
      zigbeeSetting,
      voiceAssistantVoiceIdSetting,
      voiceAssistantEnabledSetting,
    ] = [
      settings.find(({ setting_key }) => setting_key === 'portainer_access_token'),
      settings.find(({ setting_key }) => setting_key === 'gpsd_usb_device'),
      settings.find(({ setting_key }) => setting_key === 'zigbee_usb_device'),
      settings.find(({ setting_key }) => setting_key === 'voice_assistant_voice_id'),
      settings.find(({ setting_key }) => setting_key === 'voice_assistant_enabled'),
    ];

    const Title = ({ label }) => {
      return (
        <Typography 
          variant="h5"
          sx={{ margin: '15px 0px 0px 15px'}}
        >
          { label }
        </Typography>
      )
    }

    content = (
      <Box sx={{display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 600}}>
        <Title
          label="General"
        />
        <TextField
          type="password"
          label={portainerTokenSetting.label}
          value={portainerTokenSetting.value || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onSettingChange(portainerTokenSetting, {value: event.target.value})}
        />

        <Title
          label="Devices"
        />
        <UsbDeviceSelect
          label={gpsdSetting.label}
          value={gpsdSetting.value}
          onChange={(value) => onSettingChange(gpsdSetting, { value })}
        />
        <UsbDeviceSelect
          label={zigbeeSetting.label}
          value={zigbeeSetting.value}
          onChange={(value) => onSettingChange(zigbeeSetting, { value })}
        />

        <Title
          label="Voice assistant"
        />
        <FormGroup sx={{ margin: '15px' }}>
          <FormControlLabel 
            control={
              <Switch
                checked={voiceAssistantEnabledSetting.value}
                onChange={(event) => onSettingChange(voiceAssistantEnabledSetting, {value: event.target.checked})}
              />
            } 
            label={voiceAssistantEnabledSetting.label}
          />
        </FormGroup>
        <TextField
          disabled={!voiceAssistantEnabledSetting.value}
          label={voiceAssistantVoiceIdSetting.label}
          value={voiceAssistantVoiceIdSetting.value || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onSettingChange(voiceAssistantVoiceIdSetting, {value: event.target.value})}
        />

        <Title
          label="Notifications"
        />
      </Box>
    );
  }

  return (
    <Container>
      <Paper sx={{
        flex: 1,
        padding: '25px'
      }}>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          {content}
        </Box>
      </Paper>
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
    </Container>
  )
}

export default SettingsForm;