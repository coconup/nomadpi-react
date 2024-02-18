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

import {
  useGetFrigateConfigQuery,
  useGetCamerasQuery,
  useGetSensorsQuery,
  useUpdateSettingMutation
} from '../../apis/van-pi/vanpi-app-api';

import SecurityAlarmCameraRule from '../../models/SecurityAlarmCameraRule';
import SecurityAlarmTriggerRule from '../../models/SecurityAlarmTriggerRule';

import Loading from '../ui/Loading';

const SecurityAlarmForm = () => {
  useGetCamerasQuery();
  useGetSensorsQuery();

  const storeSettings = useSelector(state => state.settings);
  const cameras = useSelector(state => state.cameras);
  const sensors = useSelector(state => state.sensors);

  const [settings, setSettings] = useState(null);

  if(storeSettings && !settings) {
    setSettings(
      storeSettings.filter(({ setting_key }) => {
        return [
          'security_alarm_enabled',
          'security_alarm_cameras',
          'security_alarm_triggers',
          'security_alarm_notifications',
        ].includes(setting_key)
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
  if (!cameras || !settings || !sensors) {
    return <Loading size={40} fullPage />
  } else {
    const [
      enabledSetting,
      cameraSetting,
      triggerSetting,
      notificationSetting={}
    ] = [
      settings.find(({ setting_key }) => setting_key === 'security_alarm_enabled'),
      settings.find(({ setting_key }) => setting_key === 'security_alarm_cameras'),
      settings.find(({ setting_key }) => setting_key === 'security_alarm_triggers'),
      settings.find(({ setting_key }) => setting_key === 'security_alarm_notifications'),
    ];

    const disabled = !enabledSetting.value;

    const {
      whatsapp
    } = notificationSetting.value || {};

    const cameraRules = ((cameraSetting.value || {}).rules || []).map(rule => {
      if(rule instanceof SecurityAlarmCameraRule){
        return rule;
      } else {
        return new SecurityAlarmCameraRule(rule);
      }
    });

    const triggerRules = ((triggerSetting.value || {}).rules || []).map(rule => {
      if(rule instanceof SecurityAlarmTriggerRule){
        return rule;
      } else {
        return new SecurityAlarmTriggerRule(rule);
      }
    });

    const onAddCameraRule = () => {
      onSettingChange(cameraSetting, { value: {...cameraSetting.value, rules: [...cameraRules, (new SecurityAlarmCameraRule())] }});
    }

    const onAddTriggerRule = () => {
      onSettingChange(triggerSetting, { value: {...triggerSetting.value, rules: [...triggerRules, (new SecurityAlarmTriggerRule())] }});
    }

    const Title = ({ label, sx={} }) => {
      return (
        <Typography 
          variant="h5"
          sx={{
            margin: '15px',
            color: !disabled ? 'text.primary' : 'text.disabled'
          }}
        >
          {label}
        </Typography>
      )
    }

    content = (
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          maxWidth: 600,
          minWidth: '35vw'
        }}
      >
        <FormGroup sx={{ margin: '15px' }}>
          <FormControlLabel 
            control={
              <Switch
                checked={enabledSetting.value}
                onChange={(event) => onSettingChange(enabledSetting, {value: event.target.checked})}
              />
            } 
            label={<Typography variant="h5" color="text.primary">{enabledSetting.label}</Typography>}
          />
        </FormGroup>
        
        <Paper sx={{
          flex: 1,
          padding: '15px',
          margin: '10px 0px',
        }}>
          <Title label="Notifications" />
          <FormControlLabel
            sx={{ margin: '15px' }}
            control={
              <Switch
                disabled={disabled}
                checked={whatsapp || false}
                onChange={(event) => onSettingChange(notificationSetting, { value: { ...notificationSetting.value, whatsapp: event.target.checked } })}
              />
            } 
            label={'Whatsapp (CallMeBot.com)'}
          />
        </Paper>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Title label="Cameras" />
          <Fab
            disabled={disabled}
            size="small"
            color="secondary" 
            onClick={() => onAddCameraRule()}
          >
            <Icon>add</Icon>
          </Fab>
        </Box>
        {
          cameraRules.map((rule, index) => {
            const {
              camera_id,
              trigger_on_motion,
              trigger_on_detect,
              arm_on,
              arm_on_options
            } = rule;

            const onCameraRuleChange = (attrs) => {
              const newCameraRules = cameraRules.map((r, i) => {
                if(index === i) {
                  let newRule = r.clone();
                  Object.keys(attrs).forEach(k => newRule[k] = attrs[k]);
                  return newRule;
                } else {
                  return r;
                }
              })

              onSettingChange(
                cameraSetting, { 
                  value: {
                    ...cameraSetting.value, 
                    rules: newCameraRules
                  }
                }
              )
            };

            const onDeleteCameraRule = (attrs) => {
              const newCameraRules = cameraRules.filter((r, i) => i !== index);

              onSettingChange(
                cameraSetting, { 
                  value: {
                    ...cameraSetting.value, 
                    rules: newCameraRules
                  }
                }
              )
            };

            return (
              <Paper
                sx={{
                  flex: 1,
                  padding: '15px',
                  margin: '10px 0px',
                  ml: '25px'
                }}
                key={`camera-rule-${index}`}
              >
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Select
                      disabled={disabled}
                      label="Camera"
                      value={camera_id}
                      onChange={(event) => onCameraRuleChange({ camera_id: event.target.value })}
                      options={cameras.map(({ name, id }) => ({
                        value: id,
                        label: name
                      }))}
                      sx={{ flex: 1 }}
                    />
                    <Fab
                      disabled={disabled}
                      size="small"
                      color="secondary" 
                      onClick={() => onDeleteCameraRule()}
                      sx={{ mr: '15px' }}
                    >
                      <Icon>remove</Icon>
                    </Fab>
                  </Box>
                  <Select
                    disabled={disabled}
                    label="Arm when"
                    value={arm_on}
                    onChange={(event) => onCameraRuleChange({ arm_on: event.target.value, trigger_on_detect: false, trigger_on_motion: false })}
                    options={arm_on_options}
                  />
                  {
                    arm_on === 'alarm_on' && (
                      <Box>
                        <FormControlLabel
                          sx={{ margin: '15px' }}
                          control={
                            <Switch
                              disabled={disabled}
                              checked={trigger_on_motion || false}
                              onChange={(event) => onCameraRuleChange({ trigger_on_motion: event.target.checked })}
                            />
                          } 
                          label={'Trigger alarm when motion is detected'}
                        />
                        <FormControlLabel
                          sx={{ margin: '15px' }}
                          control={
                            <Switch
                              disabled={disabled}
                              checked={trigger_on_detect || false}
                              onChange={(event) => onCameraRuleChange({ trigger_on_detect: event.target.checked })}
                            />
                          } 
                          label={'Trigger alarm when object is detected'}
                        />
                      </Box>
                    )
                  }
                </Box>
              </Paper>
            )
          })
        }

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Title label="Triggers" />
          <Fab
            disabled={disabled}
            size="small"
            color="secondary" 
            onClick={() => onAddTriggerRule()}
          >
            <Icon>add</Icon>
          </Fab>
        </Box>
        {
          triggerRules.map((rule, index) => {
            const {
              trigger_type,
              trigger_id,
              trigger_type_options,
              trigger_sensor_types
            } = rule;

            const sensorOptions = sensors.filter(({ sensor_type }) => {
              return trigger_sensor_types.includes(sensor_type);
            })

            const onTriggerRuleChange = (attrs) => {
              const newTriggerRules = triggerRules.map((r, i) => {
                if(index === i) {
                  let newRule = r.clone();
                  Object.keys(attrs).forEach(k => newRule[k] = attrs[k]);
                  return newRule;
                } else {
                  return r;
                }
              })

              onSettingChange(
                triggerSetting, { 
                  value: {
                    ...triggerSetting.value, 
                    rules: newTriggerRules
                  }
                }
              )
            };

            const onDeleteTriggerRule = (attrs) => {
              const newTriggerRules = triggerRules.filter((r, i) => i !== index);

              onSettingChange(
                triggerSetting, { 
                  value: {
                    ...triggerSetting.value, 
                    rules: newTriggerRules
                  }
                }
              )
            };

            return (
              <Paper 
                sx={{
                  flex: 1,
                  padding: '15px',
                  margin: '10px 0px',
                  ml: '25px'
                }}
                key={`trigger-rule-${index}`}
              >
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Select
                      disabled={disabled}
                      label="Trigger type"
                      value={trigger_type}
                      onChange={(event) => onTriggerRuleChange({ trigger_type: event.target.value })}
                      options={trigger_type_options}
                      sx={{ flex: 1 }}
                    />
                    <Fab
                      disabled={disabled}
                      size="small"
                      color="secondary" 
                      onClick={() => onDeleteTriggerRule()}
                      sx={{ mr: '15px' }}
                    >
                      <Icon>remove</Icon>
                    </Fab>
                  </Box>
                  {
                    trigger_type === 'sensor' && (
                      <Select
                        disabled={disabled}
                        label="Sensor"
                        value={trigger_id}
                        onChange={(event) => onTriggerRuleChange({ trigger_id: event.target.value })}
                        options={sensors.map(({ id: value, name: label }) => ({ label, value }))}
                      />
                    )
                  }
                </Box>
              </Paper>
            )
          })
        }
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        {content}
      </Box>
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

export default SecurityAlarmForm;