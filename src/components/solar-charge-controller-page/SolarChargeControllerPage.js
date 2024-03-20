import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSolarChargeControllersState } from '../../app/store';

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
import Loading from '../ui/Loading';

export default function SolarChargeControllerPage({ solarChargeController, compact=false, demo }) {
  const {
    id,
    name
  } = solarChargeController;

  const solarChargeControllerState = useSelector(selectSolarChargeControllersState)[id];

  let content;
  if (!solarChargeControllerState) {
    return <Loading fullPage size={compact ? 25 : 40} />
  } else {
    const {
      charging_status=(demo ? 'charging' : undefined),
      controller_temperature=(demo ? 20 : undefined),
      photovoltaic={},
      load={},
      battery={}
    } = solarChargeControllerState;

    const {
      temperature: battery_temperature=(demo ? 21 : undefined),
      type: battery_type=(demo ? 'lithium' : undefined),
      voltage: battery_voltage=(demo ? 13.21 : undefined)
    } = battery;

    const {
      current: load_current=(demo ? 0 : undefined),
      power: load_power=(demo ? 0 : undefined),
      status: load_status=(demo ? 'disconnected' : undefined),
      voltage: load_voltage=(demo ? 0 : undefined)
    } = load;

    const {
      current: photovoltaic_current=(demo ? 11.5 : undefined),
      power: photovoltaic_power=(demo ? 288 : undefined),
      voltage: photovoltaic_voltage=(demo ? 25 : undefined)
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
                      value={photovoltaic_power !== undefined ? photovoltaic_power.toFixed(2) : '-'}
                      unit="W"
                    />
                    <Metric
                      label="Current"
                      value={photovoltaic_current !== undefined ? photovoltaic_current.toFixed(2) : '-'}
                      unit="Ah"
                    />
                    <Metric
                      label="Voltage"
                      value={photovoltaic_voltage !== undefined ? photovoltaic_voltage.toFixed(2) : '-'}
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
                      value={battery_temperature !== undefined ? battery_temperature.toFixed(2) : '-'}
                      unit="°"
                    />
                    <Metric
                      label="Voltage"
                      value={battery_voltage !== undefined ? battery_voltage.toFixed(2) : '-'}
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
                      value={load_power !== undefined ? load_power.toFixed(2) : '-'}
                      unit="W"
                    />
                    <Metric
                      label="Current"
                      value={load_current !== undefined ? load_current.toFixed(2) : '-'}
                      unit="Ah"
                    />
                    <Metric
                      label="Voltage"
                      value={load_voltage !== undefined ? load_voltage.toFixed(2) : '-'}
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
                    { photovoltaic_power !== undefined ? photovoltaic_power.toFixed(0) : '-' }
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