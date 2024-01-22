import { useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Icon,
  Typography
} from '@mui/material';

import { useGetBatteryStateQuery } from '../../apis/van-pi/vanpi-app-api';

import Metric from '../ui/Metric';

export default function BatteryPage({ battery, compact=false }) {
  const {
    name,
    connection_type,
    connection_params
  } = battery;

  const {
    device_type,
    device_id
  } = connection_params;

  const initialState = {
    batteryState: {},
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiBatteryState = useGetBatteryStateQuery({connection_type, device_type, device_id});

  // OFFLINE editing
  apiBatteryState = {
    isLoading: false,
    isSuccess: true,
    isError: false,
    data: {
      state_of_charge: 90,
      voltage: {
        total: 13.313,
        cell1: 3.323,
        cell2: 3.312,
        cell3: 3.322,
        cell4: 3.332
      },
      load: 2.4,
      capacity: {
        total: 252,
        remaining: 226.8
      }
    }
  }

  const isLoading = apiBatteryState.isLoading;
  const isFetching = apiBatteryState.isFetching;
  const isSuccess = apiBatteryState.isSuccess;
  const isError = apiBatteryState.isError;
  const error = apiBatteryState.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      batteryState: apiBatteryState.data,
      init: true
    });
  };

  const {
    state_of_charge,
    voltage={},
    load,
    capacity
  } = state.batteryState;

  const {
    total: totalVoltage,
    ...cellsVoltage
  } = voltage;

  const minCellVoltage = Math.min(...Object.values(cellsVoltage));
  const maxCellVoltage = Math.max(...Object.values(cellsVoltage));

  let status = {};
  if(load > 0) {
    status = {
      label: 'Charging',
      color: 'success.main',
      textColor: 'grey.900'
    }
  } else if(state_of_charge > 30) {
    status = {
      label: 'Discharging',
      color: 'info.main',
      textColor: 'grey.900'
    }
  } else if(state_of_charge > 10) {
    status = {
      label: 'Discharging',
      color: 'warning.main',
      textColor: 'grey.900'
    }
  } else {
    status = {
      label: 'Critically low',
      color: 'error.main',
      textColor: 'grey.200'
    }
  };

  const iconsMap = [
    { threshold: 95, icon: `battery_full`},
    { threshold: 87.5, icon: `battery_6_bar`},
    { threshold: 75, icon: `battery_5_bar`},
    { threshold: 60, icon: `battery_4_bar`},
    { threshold: 40, icon: `battery_3_bar`},
    { threshold: 25, icon: `battery_2_bar`},
    { threshold: 12.5, icon: `battery_1_bar`},
    { threshold: 0, icon: `battery_0_bar`},
  ];

  const icon = (iconsMap.find(({ threshold }) => state_of_charge > threshold) || {}).icon;

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if(isSuccess && state.init) {
    const Row = ({ children, sx={} }) => {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...sx
          }}
        >
          { children }
        </Box>
      )
    };

    content = (
      <Card
        sx={{
          flex: 1
        }}
      >
        <CardContent>
          <Row 
            sx={{
              mb: '20px'
            }}
          >
            <Typography variant={compact ? "h6" : "h4"}>
              { name }
            </Typography>
            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Typography variant="h6">
                { state_of_charge }%
              </Typography>
              <Icon>
                { icon }
              </Icon>
            </Box>
          </Row>
          <Divider />
          <Box>
            {
              !compact && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    mt: '20px'
                  }}
                >
                  <Box>
                    <Metric
                      label="State of charge"
                      value={`${state_of_charge.toFixed(2)}`}
                      unit="%"
                    />
                    <Metric
                      label="Current load"
                      value={`${load.toFixed(2)}`}
                      unit="Ah"
                    />
                    <Metric
                      label="Total voltage"
                      value={`${totalVoltage.toFixed(2)}`}
                      unit="V"
                    />
                  </Box>
                  <Box>
                    <Metric
                      label="Remaining capacity"
                      value={`${capacity.remaining.toFixed(2)}`}
                      unit="Ah"
                    />
                    <Metric
                      label="Status"
                      value={
                        <Chip 
                          label={status.label}
                          sx={{
                            backgroundColor: status.color,
                            color: status.textColor
                          }}
                        />
                      }
                    />
                    <Metric
                      label="Cell voltage range"
                      value={`${minCellVoltage.toFixed(2)} - ${maxCellVoltage.toFixed(2)}`}
                      unit="V"
                    />
                  </Box>
                </Box>
              )
            }
            {
              compact && (
                <Box
                  sx={{
                    mt: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start'
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 300
                    }}
                  >
                    { capacity.remaining.toFixed(2) }
                  </Typography>
                  <Typography 
                    variant="h5" 
                    color="text.secondary"
                    sx={{
                      fontWeight: 300
                    }}
                  >
                    &nbsp;Ah
                  </Typography>
                </Box>
              )
            }
          </Box>
        </CardContent>
      </Card>
    );
  } else if (isError) {
    const {status, error: message} = error;
    content = <div>{message}</div>
  }

  return content;
}