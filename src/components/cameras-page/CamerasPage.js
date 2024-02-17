import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAlarmState } from '../../app/store';

import {
  getApisState
} from '../../utils';

import {
  Box,
  ButtonBase,
  FormControlLabel,
  Unstable_Grid2 as Grid,
  Switch,
  Typography
} from '@mui/material';

import Container from '../ui/Container';

import CameraPage from '../camera-page/CameraPage';

import {
  useGetCamerasQuery,
  useGetFrigateConfigQuery,
  usePostAlarmStateMutation
} from '../../apis/van-pi/vanpi-app-api';

export default function CamerasPage() {
  const apiCameras = useGetCamerasQuery();
  const apiFrigateConfig = useGetFrigateConfigQuery();

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors
  } = getApisState([
    apiCameras,
    apiFrigateConfig
  ]);

  const [
    postAlarmStateTrigger, 
    alarmStateResponse
  ] = usePostAlarmStateMutation();

  const cameras = useSelector(state => state.cameras);
  const settings = useSelector(state => state.settings);
  const alarmState = useSelector(selectAlarmState);

  const { armed } = alarmState;

  const handleAlarmToggle = (armed) => {
    postAlarmStateTrigger({ armed });
  };

  let content;
  if (!cameras || !settings) {
    content = <div>Loading</div>
  } else if (isError) {
    const {status, error: message} = errors[0];
    content = <div>{message}</div>
  } else {
    const alarmEnabledSetting = settings.find(({ setting_key }) => setting_key === 'security_alarm_enabled');

    const {
      value: alarmEnabled
    } = alarmEnabledSetting;

    content = (
      <Grid
        container
        spacing={2}
        sx={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {
          alarmEnabled && (
            <Grid xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    disabled={alarmStateResponse.isLoading}
                    checked={armed || false}
                    onChange={(event) => handleAlarmToggle(event.target.checked)}
                  />
                } 
                label={
                  <Typography
                    variant="h5"
                    color={alarmStateResponse.isLoading ? "text.disabled" : "text.primary"}
                  >
                    Alarm {armed ? 'active' : 'not active'}
                  </Typography>
                }
              />
            </Grid>
          )
        }
        {
          cameras.map(camera => (
            <Grid 
              key={camera.key}
              xs={12}
              sm={8}
              md={6}
              // lg={4}
            >
              <CameraPage
                camera={camera}
              />
            </Grid>
          ))
        }
      </Grid>
    );
  };

  return (
    <Container>
      { content }
    </Container>
  );
}