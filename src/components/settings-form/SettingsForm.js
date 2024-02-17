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
import CredentialsSelector from '../credentials-selector/CredentialsSelector';

import { useUpdateSettingMutation } from '../../apis/van-pi/vanpi-app-api';

const SettingsForm = () => {
  const storeSettings = useSelector(state => state.settings);

  const [settings, setSettings] = useState(null);

  if(storeSettings && !settings) {
    setSettings(
      storeSettings.filter(({ setting_key }) => {
        return [
          'gpsd_usb_device',
          'zigbee_usb_device',
          'voice_assistant_voice_id',
          'voice_assistant_enabled',
          'notifications_whatsapp_number',
          'cloudflare_enabled',
          'cloudflare_app_url',
          'nextcloud_enabled',
          'nextcloud_url',
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
      gpsdSetting,
      zigbeeSetting,
      voiceAssistantVoiceIdSetting,
      voiceAssistantEnabledSetting,
      notificationsWhatsappNumberSetting,
      cloudflareEnabledSetting,
      cloudflareAppUrlSetting,
      nextcloudEnabledSetting,
      nextcloudUrlSetting,
    ] = [
      settings.find(({ setting_key }) => setting_key === 'gpsd_usb_device'),
      settings.find(({ setting_key }) => setting_key === 'zigbee_usb_device'),
      settings.find(({ setting_key }) => setting_key === 'voice_assistant_voice_id'),
      settings.find(({ setting_key }) => setting_key === 'voice_assistant_enabled'),
      settings.find(({ setting_key }) => setting_key === 'notifications_whatsapp_number'),
      settings.find(({ setting_key }) => setting_key === 'cloudflare_enabled'),
      settings.find(({ setting_key }) => setting_key === 'cloudflare_app_url'),
      settings.find(({ setting_key }) => setting_key === 'nextcloud_enabled'),
      settings.find(({ setting_key }) => setting_key === 'nextcloud_url'),
    ];

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

    content = (
      <Box sx={{display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 600}}>
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
              key: 'auth_token_client_id',
              label: 'Auth token client ID'
            },
            {
              key: 'auth_token_secret',
              label: 'Auth token secret'
            },
            {
              key: 'tunnel_token',
              label: 'Tunnel token'
            }
          ]}
        />

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
          label={nextcloudUrlSetting.label}
          value={nextcloudUrlSetting.value || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onSettingChange(nextcloudUrlSetting, {value: event.target.value})}
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