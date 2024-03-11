import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Modal,
  Box,
  Paper,
  styled,
} from '@mui/material';
import { WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, WiCloud, WiCloudy, WiShowers, WiRain, WiThunderstorm, WiSnow, WiFog } from 'react-icons/wi';
import axios from 'axios';

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '80%',
  maxWidth: '800px', // Set your desired maximum width
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6),
  overflowX: 'auto',
}));

const DayCard = styled(Grid)(({ theme }) => ({
  minWidth: '220px', // Set your desired fixed width
  marginRight: theme.spacing(2),
  '&:last-child': {
    marginRight: 0,
  },
}));

const WeatherForecast = ({open, onClose, apiKey}) => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const position = await getCurrentLocation();
        const { latitude, longitude } = position.coords;

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly&units=metric&appid=${apiKey}`
        );

        setForecastData(response.data.daily.slice(0, 7));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const getWeatherIcon = (weatherCode) => {
    const iconMap = {
      '01d': WiDaySunny,
      '01n': WiNightClear,
      '02d': WiDayCloudy,
      '02n': WiNightAltCloudy,
      '03d': WiCloud,
      '03n': WiCloud,
      '04d': WiCloudy,
      '04n': WiCloudy,
      '09d': WiShowers,
      '09n': WiShowers,
      '10d': WiRain,
      '10n': WiRain,
      '11d': WiThunderstorm,
      '11n': WiThunderstorm,
      '13d': WiSnow,
      '13n': WiSnow,
      '50d': WiFog,
      '50n': WiFog,
    };

    const IconComponent = iconMap[weatherCode] || WiDaySunny;
    return <IconComponent size={50} />;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <Container maxWidth="md">
      <Modal open={open} onClose={onClose}>
        <ModalContainer>
          <Grid container spacing={3} style={{ flexWrap: 'nowrap' }}>
            {forecastData.map((day, index) => (
              <DayCard key={index} item>
                <Card>
                  <CardContent>
                    {getWeatherIcon(day.weather[0].icon)}
                    <Typography variant="h6" gutterBottom>
                      {formatDate(day.dt)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {day.weather[0].description}
                    </Typography>
                    <Typography variant="h5" style={{ marginTop: '10px' }}>
                      {Math.round(day.temp.max)}°C / {Math.round(day.temp.min)}°C
                    </Typography>
                  </CardContent>
                </Card>
              </DayCard>
            ))}
          </Grid>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default WeatherForecast;
