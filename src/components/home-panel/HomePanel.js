import {
  Box,
  Unstable_Grid2 as Grid,
  Paper
} from '@mui/material';

import { styled } from '@mui/material/styles';

import Container from '../ui/Container';
import WeatherCard from '../weather-card/WeatherCard';
import CurrentTimeCard from '../current-time-card/CurrentTimeCard';
import TemperatureSensorsPage from '../temperature-sensors-page/TemperatureSensorsPage';
import BatteriesPage from '../batteries-page/BatteriesPage';
import WaterTanksPage from '../water-tanks-page/WaterTanksPage';
import SolarChargeControllersPage from '../solar-charge-controllers-page/SolarChargeControllersPage';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function HomePanel() {
  return (
    <Container>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={8} md={6}>
            <WeatherCard />
          </Grid>
          <Grid xs={6}>
            <CurrentTimeCard
              latitude={52.50}
              longitude={13.43}
            />
          </Grid>
          <Grid 
            md={3}
            sm={6}
            xs={12}
          >
            <TemperatureSensorsPage compact />
          </Grid>
          <Grid 
            md={3}
            sm={6}
            xs={12}
          >
            <BatteriesPage compact />
          </Grid>
          <Grid 
            md={3}
            sm={6}
            xs={12}
          >
            <WaterTanksPage compact />
          </Grid>
          <Grid 
            md={3}
            sm={6}
            xs={12}
          >
            <SolarChargeControllersPage compact />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

