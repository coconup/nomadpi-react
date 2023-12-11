import React, { useEffect, useState } from 'react';
import SunCalc from 'suncalc';

export default function DayNightIndicator({ onNightMode }) {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const successCallback = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const updateDayNightStatus = () => {
        const currentDate = new Date();
        const times = SunCalc.getTimes(currentDate, latitude, longitude);

        const sunrise = times.sunrise.getTime();
        const sunset = times.sunset.getTime();
        const currentTime = currentDate.getTime();

        const isNowNight = currentTime < sunrise || currentTime > sunset;
        if(isNight !== isNowNight) {
          setIsNight(isNowNight);
        }
      };

      updateDayNightStatus(); // Initial check

      // Update every minute to check for changes
      const intervalId = setInterval(updateDayNightStatus, 60000);

      return () => {
        clearInterval(intervalId); // Cleanup on unmount
      };
    };

    const errorCallback = (error) => {
      console.error('Error getting geolocation:', error);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, [onNightMode]);

  useEffect(() => {
    onNightMode && onNightMode(isNight);
  }, [isNight, onNightMode]);

  return null; // This component doesn't render anything, it just updates the state
}