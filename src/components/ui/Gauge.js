import { useTheme } from '@mui/material/styles';

import { RoundSlider } from 'mz-react-round-slider';

import {
  Box,
} from '@mui/material';

export default function Gauge(props) {
  const theme = useTheme();

  const {
    disabled
  } = props;

  const primaryText = disabled ? theme.palette.text.disabled : theme.palette.text.primary;
  const secondaryText = disabled ? theme.palette.text.disabled : theme.palette.text.secondary;
  const opacity = disabled ? 0.5 : 1;

  return (
    <Box sx={{ opacity }}>
      <RoundSlider
        mousewheelDisabled

        textOffsetY={ 10 }
        textOffsetX={ 5 }

        textPrefix={ '' }
        textSuffix={ '' }
        textColor={ primaryText }
        textFontSize={ 42 }

        pathThickness={ 3 }
        connectionBgColor={ theme.palette.primary.main }
        
        pointerRadius={ 10 }
        pointerBgColor={ theme.palette.primary.light }
        pointerBorder={ 8 }
        pointerBorderColor={ theme.palette.background.paper }

        enableTicks={ true }
        ticksWidth={ 1 }
        ticksHeight={ 15 }
        longerTicksHeight={ 20 }
        ticksCount={ 75 }
        ticksGroupSize={ 15 }
        ticksDistanceToPanel={ 10 }
        ticksColor={ secondaryText }

        showTickValues={ true }
        longerTickValuesOnly={ true }
        tickValuesColor={ primaryText }
        tickValuesFontSize={ 18 }
        tickValuesFontFamily={ 'Roboto' }
        tickValuesDistance={ 18 }
        tickValuesPrefix={ '' }
        tickValuesSuffix={ '' }
        
        { ...props }
      />
    </Box>
  );
}