import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

import {
  lightBlue,
  blueGrey
} from '@mui/material/colors';

import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from '@mui/material';

import GaugeComponent from 'react-gauge-component';

export default function WaterTankPage({ waterTank, compact=false }) {
  const theme = useTheme();

  const {
    id,
    name,
    water_tank_settings
  } = waterTank;

  const {
    color,
    alert_on
  } = water_tank_settings;

  const muiColor = {
    blue: lightBlue,
    grey: blueGrey
  }[color] || lightBlue;

  const waterTankState = useSelector(state => {
    return state.state.waterTanks[id];
  });

  let content;
  if (!waterTankState) {
    content = <div>Loading</div>
  } else {
    const {
      total_volume_liters,
      remaining_volume_liters
    } = waterTankState;

    let subArcs = [
      ...alert_on === 'empty' && [
        {
          limit: 10,
          color: muiColor[100],
          showTick: true
        },
        {
          limit: 20,
          color: muiColor[300],
          showTick: true
        },
        {
          limit: 100,
          color: theme.palette.grey[300],
        },
      ] || [],

      ...alert_on === 'full' && [
        {
          limit: 80,
          color: muiColor[300],
          showTick: true
        },
        {
          limit: 90,
          color: muiColor[200],
          showTick: true
        },
        {
          limit: 100,
          color: muiColor[100],
          showTick: false
        },
      ] || [],
    ];

    const remaining_volume_percent = 100 * remaining_volume_liters / total_volume_liters;

    if(!subArcs.find(({ limit }) => limit === remaining_volume_percent)) {
      subArcs.push({
        limit: remaining_volume_percent,
        color: muiColor[500]
      })
    };

    subArcs = subArcs.sort((a, b) => a.limit - b.limit)

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
          {
            !compact && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  mt: '15px',
                  justifyContent: 'center'
                }}
              >
                <GaugeComponent
                  type={'radial'}
                    arc={{
                      // colorArray: [lightBlue[500]],
                      cornerRadius: 0,
                      padding: 0,
                      width: 0.2,
                      subArcs
                    }}
                    value={100*remaining_volume_liters/total_volume_liters}
                    labels={{
                      valueLabel: {
                        style: {
                          fontSize: 24,
                          textShadow: 'none',
                          fill: theme.palette.text.primary
                        },
                        formatTextValue: () => `${remaining_volume_liters}l`
                      },
                      tickLabels: {
                        hideMinMax: true,
                        type: "outer",
                      }
                    }}
                  />
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
                  { remaining_volume_liters }
                </Typography>
                <Typography 
                  variant="h5" 
                  color="text.secondary"
                  sx={{
                    fontWeight: 300
                  }}
                >
                  &nbsp;/ {total_volume_liters}l
                </Typography>
              </Box>
            )
          }
        </CardContent>
      </Card>
    );
  }

  return content;
}