import { useState } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';

import {
  Box,
  Icon,
  Switch
} from '@mui/material';

import VoiceAssistantProvider from './VoiceAssistantProvider';

 const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M12 14q-1.25 0-2.125-.875T9 11V5q0-1.25.875-2.125T12 2q1.25 0 2.125.875T15 5v6q0 1.25-.875 2.125T12 14m-1 7v-3.075q-2.6-.35-4.3-2.325T5 11h2q0 2.075 1.463 3.538T12 16q2.075 0 3.538-1.463T17 11h2q0 2.625-1.7 4.6T13 17.925V21z"/></svg>')`,

      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M17.75 14.95L16.3 13.5q.35-.575.525-1.2T17 11h2q0 1.1-.325 2.088t-.925 1.862m-2.95-3l-1.8-1.8V5q0-.425-.288-.712T12 4q-.425 0-.712.288T11 5v3.15l-2-2V5q0-1.25.875-2.125T12 2q1.25 0 2.125.875T15 5v6q0 .275-.062.5t-.138.45M11 21v-3.075q-2.6-.35-4.3-2.325T5 11h2q0 2.075 1.438 3.538T12 16q.85 0 1.613-.262T15 15l1.425 1.425q-.725.575-1.588.975T13 17.925V21zm8.8 1.6L1.4 4.2l1.4-1.4l18.4 18.4z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export default function VoiceAssistantToggle() {
  const [active, setActive] = useState(true);

  const settings = useSelector(state => state.settings);
  if(settings) {
    const voiceAssistantEnabledSetting = settings.find(({ setting_key }) => setting_key === 'voice_assistant_enabled');

    const enabled = JSON.parse(voiceAssistantEnabledSetting.value);

    if(enabled) {
      return (
        <Box>
          <MaterialUISwitch
            checked={active}
            onChange={() => setActive(!active)}
          />
          {
            active && <VoiceAssistantProvider />
          }
        </Box>
      )
    }
  }
}