import { useState } from 'react';
import { useSelector } from 'react-redux';

import SunCalc from 'suncalc';

export default function DayNightIndicator({ onNightMode }) {
  const [isNight, setIsNight] = useState(null);

  const gpsState = useSelector(state => {
    return state.state.gps;
  });

  const {
    latitude,
    longitude   
  } = gpsState || {};

  if(latitude !== undefined) {
    const currentDate = new Date();
    const times = SunCalc.getTimes(currentDate, latitude, longitude);

    const sunrise = times.sunrise.getTime();
    const sunset = times.sunset.getTime();
    const currentTime = currentDate.getTime();

    const isNowNight = currentTime < sunrise || currentTime > sunset;
    
    if(isNight !== isNowNight) {
      setIsNight(isNowNight);
      onNightMode(isNowNight);
    }
  }
}