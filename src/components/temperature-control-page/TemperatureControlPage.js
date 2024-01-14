import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import { RoundSlider } from 'mz-react-round-slider';

import Container from '../ui/Container';

import {
  Box,
  Unstable_Grid2 as Grid
} from '@mui/material';

import TemperatureSensorPage from '../temperature-sensor-page/TemperatureSensorPage';

// import {
//   useGetTemperatureSensorsQuery,
//   useGetTemperatureStateQuery
// } from '../../apis/van-pi/vanpi-app-api';

export default function TemperatureControlPage() {
  const theme = useTheme();
  return (
    <Container>
      <Grid
        container
        spacing={2}
        sx={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Grid 
          xs={12}
          md={6}
          sx={{
            textAlign: 'center'
          }}
        >
          <RoundSlider
            min={ 5 }
            max={ 30 }
            step={ 0.5 }
            arrowStep={ 1 }
            round={ 1 }

            pathStartAngle={ 135 }
            pathEndAngle={ 45 }

            textOffsetY={ 10 }
            textOffsetX={ 5 }

            textPrefix={ '' }
            textSuffix={ '°' }
            textColor={ theme.palette.text.primary }
            textFontSize={ 42 }

            pathThickness={ 3 }
            connectionBgColor={ theme.palette.primary.main }
            
            pointerRadius={ 10 }
            pointerBgColor={ theme.palette.primary.light }
            pointerBorder={ 4 }
            pointerBorderColor={ theme.palette.primary.main }

            enableTicks={ true }
            ticksWidth={ 1 }
            ticksHeight={ 15 }
            longerTicksHeight={ 22 }
            ticksCount={ 50 }
            ticksGroupSize={ 5 }
            ticksDistanceToPanel={ 10 }
            ticksColor={ theme.palette.text.secondary }

            showTickValues={ true }
            longerTickValuesOnly={ true }
            tickValuesColor={ theme.palette.text.primary }
            tickValuesFontSize={ 14 }
            tickValuesFontFamily={ 'Roboto' }
            tickValuesDistance={ 18 }
            tickValuesPrefix={ '' }
            tickValuesSuffix={ '°' }

            pointers={[{ value: 15 }]}
            // onChange={ (res) => {console.log(res[0].value)} }
          />
        </Grid>
        <Grid 
          xs={12}
          md={6}
          sx={{
            textAlign: 'center'
          }}
        >
          <RoundSlider
            min={ 0 }
            max={ 24 }
            step={ 0.5 }
            arrowStep={ 1 }
            round={ 1 }

            data={[
              '0:00',
              '0:30',
              '1:00',
              '1:30',
              '2:00',
              '2:30',
              '3:00',
              '3:30',
              '4:00',
              '4:30',
              '5:00',
              '5:30',
              '6:00',
              '6:30',
              '7:00',
              '7:30',
              '8:00',
              '8:30',
              '9:00',
              '9:30',
              '10:00',
              '10:30',
              '11:00',
              '11:30',
              '12:00',
              '12:30',
              '13:00',
              '13:30',
              '14:00',
              '14:30',
              '15:00',
              '15:30',
              '16:00',
              '16:30',
              '17:00',
              '17:30',
              '18:00',
              '18:30',
              '19:00',
              '19:30',
              '20:00',
              '20:30',
              '21:00',
              '21:30',
              '22:00',
              '22:30',
              '23:00',
              '23:30'
            ]}

            pathStartAngle={ 135 }
            pathEndAngle={ 45 }

            textOffsetY={ 10 }
            textOffsetX={ 5 }

            textPrefix={ '' }
            textSuffix={ '' }
            textBetween={ ' - ' }
            textColor={ theme.palette.text.primary }
            textFontSize={ 24 }

            pathThickness={ 3 }
            connectionBgColor={ theme.palette.primary.main }
            
            pointerRadius={ 10 }
            pointerBgColor={ theme.palette.primary.light }
            pointerBorder={ 4 }
            pointerBorderColor={ theme.palette.primary.main }

            enableTicks={ true }
            ticksWidth={ 1 }
            ticksHeight={ 15 }
            longerTicksHeight={ 22 }
            ticksCount={ 24 }
            ticksGroupSize={ 5 }
            ticksDistanceToPanel={ 10 }
            ticksColor={ theme.palette.text.secondary }

            showTickValues={ true }
            longerTickValuesOnly={ true }
            tickValuesColor={ theme.palette.text.primary }
            tickValuesFontSize={ 14 }
            tickValuesFontFamily={ 'Roboto' }
            tickValuesDistance={ 18 }
            tickValuesPrefix={ '' }
            tickValuesSuffix={ '' }

            pointers={[{ value: 16 }, { value: 23 }]}
            // onChange={ (res) => {console.log(res[0].value)} }
          />
        </Grid>
      </Grid>
    </Container>
  );
}