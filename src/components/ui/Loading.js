import { useTheme } from '@mui/material/styles';
import {
  Box,
  CircularProgress
} from '@mui/material';

import Container from './Container';

const Loading = ({ size=25, fullPage=false }) => {
  const content = (
    <Box sx={{ margin: '25px' }}>
      <CircularProgress size={size} color="primary" />
    </Box>
  );

  if(fullPage) {
    return (
      <Container>
        { content }
      </Container>
    );
  } else {
    return content;
  }
};

export default Loading;