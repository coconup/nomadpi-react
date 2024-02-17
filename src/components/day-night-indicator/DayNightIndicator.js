import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectGpsState } from '../../app/store';

import SunCalc from 'suncalc';

export default function DayNightIndicator({ onNightMode }) {
  const gpsState = useSelector(selectGpsState);

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
    
    onNightMode(isNowNight);
  }
}