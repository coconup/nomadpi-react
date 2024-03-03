import {
  Box,
  Button,
  Icon,
  Typography
} from '@mui/material';

import Container from '../ui/Container';

const EmptyResourcePage = ({
  onClick,
  title='There is nothing here yet...',
  icon='add',
  buttonLabel
}) => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            mb: '20px'
          }}
        >
          {title}
        </Typography>
        {
          onClick && (
            <Button
              variant="contained"
              startIcon={<Icon>{icon}</Icon>}
              onClick={onClick}
            >
              { buttonLabel }
            </Button>
          )
        }
      </Box>
    </Container>
  );
};

export default EmptyResourcePage;