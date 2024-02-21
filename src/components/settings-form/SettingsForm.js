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

import { MuiColorInput } from 'mui-color-input'

import Container from '../ui/Container';
import Select from '../ui/Select';
import Loading from '../ui/Loading';

import UsbDeviceSelect from '../usb-device-select/UsbDeviceSelect';
import CredentialsSelector from '../credentials-selector/CredentialsSelector';

import { useUpdateSettingMutation } from '../../apis/nomadpi/nomadpi-app-api';

const SettingsForm = () => {
  const anchor = window.location.hash.substr(1);

  const storeSettings = useSelector(state => state.settings);

  const [settings, setSettings] = useState(null);

  if(storeSettings && !settings) {
    setSettings(storeSettings);
  };

  const [
    updateSettingTrigger, 
    updateSettingState
  ] = useUpdateSettingMutation();

  const onSettingChange = ({ setting_key }, attrs) => {
    const newSettings = settings.map(item => {
      if(item.setting_key === setting_key) {
        const newItem = item.clone();
        newItem.isChanged = true;
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })

    setSettings(newSettings);
  };

  const saveSettings = () => {
    settings.filter(s => s.isChanged).forEach(item => {
      updateSettingTrigger(item.toJSONPayload());
    });
  };

  const getSetting = (key) => settings.find(({ setting_key }) => setting_key === key);

  let content;
  if (!settings) {
    return <Loading size={40} fullPage />
  } else {
    const gpsdSetting = getSetting('gpsd_usb_device');
    const zigbeeSetting = getSetting('zigbee_usb_device');
    const voiceAssistantVoiceIdSetting = getSetting('voice_assistant_voice_id');
    const voiceAssistantEnabledSetting = getSetting('voice_assistant_enabled');
    const notificationsWhatsappNumberSetting = getSetting('notifications_whatsapp_number');
    const cloudflareEnabledSetting = getSetting('cloudflare_enabled');
    const cloudflareAppUrlSetting = getSetting('cloudflare_app_url');
    const nextcloudEnabledSetting = getSetting('nextcloud_enabled');
    const nextcloudHostSetting = getSetting('nextcloud_host');
    const primaryColorSetting = getSetting('appearance_primary_color');
    const displayNameSetting = getSetting('appearance_display_name');

    const Title = ({ label }) => {
      return (
        <Typography 
          variant="h5"
          sx={{ margin: '35px 0px 5px 15px'}}
        >
          { label }
        </Typography>
      )
    }

    const containerStyle = {
      display: 'flex',
      flexDirection: 'column'
    }

    content = (
      <Box sx={{flex: 1, maxWidth: 600}}>
        {
          anchor === 'appearance' && (
            <Box sx={containerStyle}>
              <Title
                label="Appearance"
              />

              <TextField
                label={displayNameSetting.label}
                value={displayNameSetting.value || ''}
                sx={{margin: '15px', display: 'flex'}}
                onChange={(event) => onSettingChange(displayNameSetting, {value: event.target.value})}
              />
              <MuiColorInput
                sx={{margin: '15px', display: 'flex'}}
                value={primaryColorSetting.value}
                label={primaryColorSetting.label}
                onChange={(value) => onSettingChange(primaryColorSetting, { value })}
              />
            </Box>
          )
        }

        {
          anchor === 'devices' && (
            <Box sx={containerStyle}>
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
            </Box>
          )
        }

        {
          anchor === 'weather-and-maps' && (
            <Box sx={containerStyle}>
              <Title
                label="Weather and maps"
              />
              <CredentialsSelector
                serviceId="open-weather-map"
                serviceName="OpenWeatherMap"
                fields={[
                  {
                    key: 'api_key',
                    label: 'OpenWeatherMap API key'
                  }
                ]}
              />
              <CredentialsSelector
                serviceId="google-maps"
                serviceName="Google Maps"
                fields={[
                  {
                    key: 'api_key',
                    label: 'Google Maps API key'
                  }
                ]}
              />
            </Box>
          )
        }

        {
          anchor === 'voice-assistant' && (
            <Box sx={containerStyle}>
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

              <CredentialsSelector
                disabled={!voiceAssistantEnabledSetting.value}
                serviceId="open-ai"
                serviceName="OpenAi"
                fields={[
                  {
                    key: 'api_key',
                    label: 'OpenAi API Key'
                  }
                ]}
              />

              <CredentialsSelector
                disabled={!voiceAssistantEnabledSetting.value}
                serviceId="eleven-labs"
                serviceName="ElevenLabs"
                fields={[
                  {
                    key: 'api_key',
                    label: 'ElevenLabs API Key'
                  }
                ]}
              />
            </Box>
          )
        }

        {
          anchor === 'notifications' && (
            <Box sx={containerStyle}>
              <Title
                label="Notifications"
              />
              <TextField
                label={notificationsWhatsappNumberSetting.label}
                value={notificationsWhatsappNumberSetting.value || ''}
                sx={{margin: '15px', display: 'flex'}}
                onChange={(event) => onSettingChange(notificationsWhatsappNumberSetting, {value: event.target.value})}
              />
              <CredentialsSelector
                serviceId="call-me-bot"
                serviceName="CallMeBot"
                fields={[
                  {
                    key: 'api_key',
                    label: 'CallMeBot API Key'
                  }
                ]}
              />
            </Box>
          )
        }

        {
          anchor === 'cloudflare' && (
            <Box sx={containerStyle}>
              <Title
                label="Cloudflare"
              />
              <FormGroup sx={{ margin: '15px' }}>
                <FormControlLabel 
                  control={
                    <Switch
                      checked={cloudflareEnabledSetting.value}
                      onChange={(event) => onSettingChange(cloudflareEnabledSetting, {value: event.target.checked})}
                    />
                  } 
                  label={cloudflareEnabledSetting.label}
                />
              </FormGroup>

              <TextField
                disabled={!cloudflareEnabledSetting.value}
                label={cloudflareAppUrlSetting.label}
                value={cloudflareAppUrlSetting.value || ''}
                sx={{margin: '15px', display: 'flex'}}
                onChange={(event) => onSettingChange(cloudflareAppUrlSetting, {value: event.target.value})}
              />

              <CredentialsSelector
                disabled={!cloudflareEnabledSetting.value}
                serviceId="cloudflare"
                serviceName="Cloudflare"
                fields={[
                  {
                    key: 'tunnel_token',
                    label: 'Tunnel token'
                  }
                ]}
              />
            </Box>
          )
        }

        {
          anchor === 'nextcloud' && (
            <Box sx={containerStyle}>
              <Title
                label="Nextcloud"
              />
              <FormGroup sx={{ margin: '15px' }}>
                <FormControlLabel 
                  control={
                    <Switch
                      checked={nextcloudEnabledSetting.value}
                      onChange={(event) => onSettingChange(nextcloudEnabledSetting, {value: event.target.checked})}
                    />
                  } 
                  label={nextcloudEnabledSetting.label}
                />
              </FormGroup>

              <TextField
                disabled={!nextcloudEnabledSetting.value}
                label={nextcloudHostSetting.label}
                value={nextcloudHostSetting.value || ''}
                sx={{margin: '15px', display: 'flex'}}
                onChange={(event) => onSettingChange(nextcloudHostSetting, {value: event.target.value})}
              />

              <CredentialsSelector
                disabled={!nextcloudEnabledSetting.value}
                serviceId="nextcloud"
                serviceName="Nextcloud"
                fields={[
                  {
                    key: 'username',
                    label: 'Username'
                  },
                  {
                    key: 'password',
                    label: 'Password'
                  }
                ]}
              />
            </Box>
          )
        }
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