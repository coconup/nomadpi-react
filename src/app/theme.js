import { createTheme } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';

const theme = ({
  nightMode,
  primaryColor
}) => {
  // const mode = nightMode ? 'dark' : 'light';
  const mode = 'light'

  return createTheme({
    palette: {
      mode,
      ...mode === 'dark' ? {} : {
        background: {
          default: '#FCFBF4',
        }
      },
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: '#FFC857',
      },
      grey: {
        50: mode === 'dark' ? grey[900] : grey[50],
        100: mode === 'dark' ? grey[800] : grey[100],
        300: mode === 'dark' ? grey[700] : grey[300],
      }
    },
  })
};

export default theme;