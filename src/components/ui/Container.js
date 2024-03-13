import { useTheme } from '@mui/material/styles';
import {
  Box
} from '@mui/material';

const ContainerComponent = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: '20px 5vw',
        [theme.breakpoints.up('xl')]: {
          padding: '20px 20vw',
        },
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      { children }
    </Box>
  )
}

export default ContainerComponent;