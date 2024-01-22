import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import Gauge from '../ui/Gauge';
import Metric from '../ui/Metric';

import {
  Box,
  Button,
  Chip,
  Unstable_Grid2 as Grid,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';

export default function HeaterPage({ heater, onChange }) {
  const theme = useTheme();

  const {
    heater_settings
  } = heater;

  const {
    thermostat
  } = heater_settings;

  const {
    temperature_sensor_id,
    switch_id,
    mode='off',
    timer_from=9,
    timer_to=22.5,
    target_temperature=20
  } = thermostat;

  const hourStrings = Array(48).fill().map((_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 ? "30" : "00";
    return `${hour}:${minute}`;
  });

  const hours = [
    ...hourStrings.slice(12), 
    ...hourStrings.slice(0, 12)
  ];

  const decimalToTime = (value) => {
    const hours = Math.floor(value);
    const minutes = Math.round((value % 1) * 60);

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  const timeToDecimal = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const hourValue = parseInt(hour);
    const minuteValue = parseFloat(minute) / 60;
    return hourValue + minuteValue;
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        flex: 1,
        justifyContent: 'center',
        flexGrow: 1,
        display: 'flex'
      }}
    >
      <Grid
        container
        spacing={2}
        lg={3}
        md={12}
        sx={{
          [theme.breakpoints.down('lg')]: {
            justifyContent: 'center',
            alignItems: 'center'
          },
        }}
      >
        <Grid 
          lg={12}
          md={4}
          xs={12}
          sx={{ width: '100%' }}
        >
          <ToggleButtonGroup
            color="primary"
            value={mode}
            exclusive
            onChange={(event) => {
              onChange(heater, {heater_settings: {...heater_settings, thermostat: {...thermostat, mode: event.target.value, timer_from, timer_to}}})
            }}
            sx={{
              margin: '15px 15px 15px 0px'
            }}
          >
            <ToggleButton value="off" sx={{width: 70}}>Off</ToggleButton>
            <ToggleButton value="on" sx={{width: 70}}>On</ToggleButton>
            <ToggleButton value="timer" sx={{width: 70}}>Timer</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid 
          lg={12}
          md={3}
          xs={12}
        >
          <Metric
            label="Thermostat temperature"
            value={`20°`}
            unit="C"
          />
        </Grid>
        <Grid 
          lg={12}
          md={3}
          xs={12}
        >
          <Metric
            label="Heater temperature"
            value={`80°`}
            unit="C"
          />
        </Grid>
        <Grid 
          lg={12}
          md={2}
          xs={12}
        >
          <Metric
            label="Status"
            value={
              <Chip 
                label={'Heating'}
                sx={{
                  // backgroundColor: status.color,
                  // color: status.textColor
                }}
              />
            }
          />
        </Grid>
      </Grid>
      <Grid 
        xs={12}
        md={6}
        lg={4}
        sx={{
          textAlign: 'center'
        }}
      >
        <Gauge
          disabled={mode === 'off'}
          min={ 5 }
          max={ 30 }
          pathStartAngle={ 135 }
          pathEndAngle={ 45 }
          step={ 0.5 }
          arrowStep={ 1 }
          round={ 1 }
          ticksCount={ 75 }
          ticksGroupSize={ 15 }
          textSuffix={ '°' }
          tickValuesSuffix={ '°' }
          pointers={[{ value: target_temperature }]}
          onChange={(event) => {
            const value = event[0].value;
            onChange(heater, {heater_settings: {...heater_settings, thermostat: {...thermostat, target_temperature: value}}})
          }}
        />
      </Grid>
      <Grid 
        xs={12}
        md={6}
        lg={4}
        sx={{
          textAlign: 'center'
        }}
      >
        <Gauge
          disabled={mode !== 'timer'}
          data={hours}
          textBetween={ ' - ' }
          textFontSize={ 24 }
          ticksCount={ 24 }
          ticksGroupSize={ 6 }
          pointers={[{ value: decimalToTime(timer_from) }, { value: decimalToTime(timer_to) }]}
          onChange={(events, value) => {
            const [
              { value: newTimerFrom },
              { value: newTimerTo }
            ] = events;
            onChange(heater, {heater_settings: {...heater_settings, thermostat: {...thermostat, timer_from: timeToDecimal(newTimerFrom), timer_to: timeToDecimal(newTimerTo)}}})
          }}
        />
      </Grid>
    </Grid>
  );
}