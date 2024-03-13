import { useSelector } from 'react-redux';
import { selectGpsState } from '../../app/store';
import { useLocation } from "wouter";
import { isPlatform } from '@ionic/react';

import {
  Box,
  ButtonBase,
  Icon,
  Unstable_Grid2 as Grid,
  Paper
} from '@mui/material';

import Container from '../ui/Container';
import WeatherCard from '../weather-card/WeatherCard';
import CurrentTimeCard from '../current-time-card/CurrentTimeCard';
import TemperatureSensorsPage from '../temperature-sensors-page/TemperatureSensorsPage';
import BatteriesPage from '../batteries-page/BatteriesPage';
import WaterTanksPage from '../water-tanks-page/WaterTanksPage';
import SolarChargeControllersPage from '../solar-charge-controllers-page/SolarChargeControllersPage';
import MapsPage from '../maps-page/MapsPage';

import { selectServiceCredentials } from '../../app/store';

export default function HomePanel({ demo }) {
  const setLocation = useLocation()[1];

  const gpsState = useSelector(selectGpsState);

  const googleMapsCredentials = useSelector(selectServiceCredentials('google-maps'));
  const openWeatherCredentials = useSelector(selectServiceCredentials('open-weather-map'));

  const { api_key: googleMapsApiKey } = googleMapsCredentials.value || {};
  const { api_key: openWeatherApiKey } = openWeatherCredentials.value || {};

  const latitude = demo ? 38.18885675160445 : gpsState.latitude;
  const longitude = demo ? 12.733572417196724 : gpsState.longitude;

  const isPhone = isPlatform('mobile') && !isPlatform('tablet');

  return (
    <Container>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={2}>
          {
            !isPhone && (
              <Grid xs={12}>
                <CurrentTimeCard
                  latitude={latitude}
                  longitude={longitude}
                />
              </Grid>
            )
          }
          <Grid xs={12} sm={8} md={6}>
            <WeatherCard 
              apiKey={openWeatherApiKey}
              latitude={latitude}
              longitude={longitude}
            />
          </Grid>
          <Grid xs={12} sm={8} md={6}>
            {
              googleMapsApiKey && (
                <Paper
                  sx={{
                    flexGrow: 1,
                    // mb: '20px',
                    display: 'flex'
                  }}
                >
                  <MapsPage
                    googleMapsApiKey={googleMapsApiKey}
                    latitude={latitude}
                    longitude={longitude}
                    containerStyle={{
                      borderRadius: '4px',
                      flex: 1
                    }}
                  />
                </Paper>
              )
            }
            {
              !googleMapsApiKey && (
                <Paper
                  sx={{
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '408px'
                  }}
                >
                  <ButtonBase 
                    sx={{flex: 1, height: '100%'}}
                    onClick={() => setLocation("/settings/weather-and-maps")}
                  >
                    <Box
                      sx={{
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Icon sx={{fontSize: 54, color: 'text.disabled'}}>maps</Icon>
                    </Box>
                  </ButtonBase>
                </Paper>
              )
            }
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

