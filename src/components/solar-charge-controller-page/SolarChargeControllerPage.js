import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Icon,
  Typography
} from '@mui/material';

import Metric from '../ui/Metric';

export default function SolarChargeControllerPage({ solarChargeController, compact=false }) {
  const {
    id,
    name
  } = solarChargeController;

  const solarChargeControllerState = useSelector(state => {
    return state.state.solarChargeControllers[id];
  });

  let content;
  if (!solarChargeControllerState) {
    content = <div>Loading</div>
  } else {
    const {
      charging_status,
      controller_temperature,
      photovoltaic,
      load,
      battery
    } = solarChargeControllerState;

    const {
      temperature: battery_temperature,
      type: battery_type,
      voltage: battery_voltage
    } = battery;

    const {
      current: load_current,
      power: load_power,
      status: load_status,
      voltage: load_voltage
    } = load;

    const {
      current: photovoltaic_current,
      power: photovoltaic_power,
      voltage: photovoltaic_voltage
    } = photovoltaic;

    let status = {};
    if(charging_status === 'deactivated') {
      status = {
        label: 'Disabled',
        color: 'grey.500',
        textColor: 'grey.900'
      }
    };

    content = (
      <Card
        sx={{
          flex: 1
        }}
      >
        <CardContent>
          <Box 
            sx={{
              mb: '20px',
              textAlign: 'left'
            }}
          >
            <Typography variant={compact ? "h6" : "h4"}>
              { name }
            </Typography>
          </Box>
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
                  <Box sx={{ mr: '20px' }}>
                    <Typography variant={"h6"}>
                      Photovoltaic (PV)
                    </Typography>
                    <Metric
                      label="Status"
                      value={<Chip label={charging_status} />}
                      unit=""
                    />
                    <Metric
                      label="Power"
                      value={`${photovoltaic_power.toFixed(2)}`}
                      unit="W"
                    />
                    <Metric
                      label="Current"
                      value={`${photovoltaic_current.toFixed(2)}`}
                      unit="Ah"
                    />
                    <Metric
                      label="Voltage"
                      value={`${photovoltaic_voltage.toFixed(2)}`}
                      unit="V"
                    />
                  </Box>
                  <Box sx={{ mr: '20px' }}>
                    <Typography variant={"h6"}>
                      Battery
                    </Typography>
                    <Metric
                      label="Type"
                      value={
                        <Chip 
                          label={battery_type}
                          // sx={{
                          //   backgroundColor: status.color,
                          //   color: status.textColor
                          // }}
                        />
                      }
                      unit=""
                    />
                    <Metric
                      label="Temperature"
                      value={`${battery_temperature.toFixed(2)}`}
                      unit="°"
                    />
                    <Metric
                      label="Voltage"
                      value={`${battery_voltage.toFixed(2)}`}
                      unit="V"
                    />
                  </Box>
                  <Box sx={{ mr: '20px' }}>
                    <Typography variant={"h6"}>
                      Load
                    </Typography>
                    <Metric
                      label="Status"
                      value={<Chip label={load_status} />}
                      unit=""
                    />
                    <Metric
                      label="Power"
                      value={`${load_power.toFixed(2)}`}
                      unit="W"
                    />
                    <Metric
                      label="Current"
                      value={`${load_current.toFixed(2)}`}
                      unit="Ah"
                    />
                    <Metric
                      label="Voltage"
                      value={`${load_voltage.toFixed(2)}`}
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
                    { photovoltaic_power.toFixed(2) }
                  </Typography>
                  <Typography 
                    variant="h5" 
                    color="text.secondary"
                    sx={{
                      fontWeight: 300
                    }}
                  >
                    &nbsp;W
                  </Typography>
                </Box>
              )
            }
          </Box>
        </CardContent>
      </Card>
    );
  }

  return content;
}