import { createTheme } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';

const theme = (nightMode) => {
  return createTheme({
    palette: {
      // mode: nightMode ? 'dark' : 'light',
      mode: 'dark',
      primary: {
        main: red[400],
      },
      grey: {
        50: nightMode ? grey[900] : grey[50],
        100: nightMode ? grey[800] : grey[100],
      }
    },
  })
};

export default theme;