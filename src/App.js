import { useState } from 'react';
import logo from './logo.svg';
import store from './app/store';
import { selectSetting } from './app/store';

import { Route, Switch, Redirect } from "wouter";
import { useSelector } from 'react-redux';

import {
  useGetGpsStateQuery,
  useGetRelaysStateQuery,
  useGetModesStateQuery,
  useGetBatteriesStateQuery,
  useGetWaterTanksStateQuery,
  useGetTemperatureSensorsStateQuery,
  useGetSolarChargeControllersStateQuery,
  useGetAlarmStateQuery,

  useGetSettingsQuery,

  useGetServiceCredentialsQuery
} from './apis/van-pi/vanpi-app-api';

import {
  Box,
  useMediaQuery
} from '@mui/material';

import ResponsiveAppBar from './components/responsive-app-bar/ResponsiveAppBar';
import NotificationBar from './components/notification-bar/NotificationBar';
import HomePanel from './components/home-panel/HomePanel';
import SwitchGroupsPage from './components/switch-groups-page/SwitchGroupsPage';
import MonitorPage from './components/monitor-page/MonitorPage';
import CamerasPage from './components/cameras-page/CamerasPage';
import HeatersPage from './components/heaters-page/HeatersPage';
import DayNightIndicator from './components/day-night-indicator/DayNightIndicator';
import WeatherForecast from './components/weather-forecast/WeatherForecast';

import RelaySwitchesForm from './components/relay-switches-form/RelaySwitchesForm';
import WifiRelaySwitchesForm from './components/wifi-relay-switches-form/WifiRelaySwitchesForm';
import ModeSwitchesForm from './components/mode-switches-form/ModeSwitchesForm';
import SwitchGroupsForm from './components/switch-groups-form/SwitchGroupsForm';
import ActionSwitchesForm from './components/action-switches-form/ActionSwitchesForm';
import SettingsForm from './components/settings-form/SettingsForm';
import BatteriesForm from './components/batteries-form/BatteriesForm';
import WaterTanksForm from './components/water-tanks-form/WaterTanksForm';
import SensorsForm from './components/sensors-form/SensorsForm';
import CamerasForm from './components/cameras-form/CamerasForm';
import SecurityAlarmForm from './components/security-alarm-form/SecurityAlarmForm';
import HeatersForm from './components/heaters-form/HeatersForm';
import TemperatureSensorsForm from './components/temperature-sensors-form/TemperatureSensorsForm';
import SolarChargeControllersForm from './components/solar-charge-controllers-form/SolarChargeControllersForm';

import Loading from './components/ui/Loading';

import { ThemeProvider } from '@mui/material/styles';
import theme from './app/theme';

function App() {
  useGetGpsStateQuery();
  useGetRelaysStateQuery();
  useGetModesStateQuery();
  useGetBatteriesStateQuery();
  useGetWaterTanksStateQuery();
  useGetTemperatureSensorsStateQuery();
  useGetSolarChargeControllersStateQuery();
  useGetAlarmStateQuery();

  useGetSettingsQuery();

  useGetServiceCredentialsQuery({ service_id: 'google-maps' });
  useGetServiceCredentialsQuery({ service_id: 'open-ai' });
  useGetServiceCredentialsQuery({ service_id: 'eleven-labs' });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [nightMode, setNightMode] = useState(prefersDarkMode);

  const handleNightModeChange = (isNight) => {
    if(nightMode !== isNight) {
      console.log(`Night mode is ${isNight ? 'on' : 'off'}`);
      setNightMode(isNight);  
    }
  };

  const primaryColorSetting = useSelector(selectSetting('appearance_primary_color'));

  if(!primaryColorSetting) {
    return <Loading size={40} fullPage />
  } else {
    return (
      <ThemeProvider
        theme={theme({
          nightMode,
          primaryColor: primaryColorSetting.value
        })}
      >
        {
          !prefersDarkMode && (
            <DayNightIndicator
              onNightMode={handleNightModeChange}
            />
          )
        }
        <Box 
          className="App"
          sx={{
            backgroundColor: 'background.default',
            pt: 'env(safe-area-inset-top)'
          }}
        >
          <Box 
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
            <ResponsiveAppBar />
            <NotificationBar />
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex'
              }}
            >
              <Switch>
                <Route path="/"><HomePanel /></Route>
                <Route path="/weather">
                  <WeatherForecast />
                </Route>
                <Route path="/control-panel"><SwitchGroupsPage /></Route>
                <Route path="/monitor"><MonitorPage /></Route>
                <Route path="/security"><CamerasPage /></Route>
                <Route path="/heater"><HeatersPage /></Route>

                <Route path="/settings/general"><SettingsForm /></Route>
                <Route path="/settings/batteries"><BatteriesForm /></Route>
                <Route path="/settings/solar-charge-controllers"><SolarChargeControllersForm /></Route>
                <Route path="/settings/water-tanks"><WaterTanksForm /></Route>
                <Route path="/settings/cameras"><CamerasForm /></Route>
                <Route path="/settings/security-alarm"><SecurityAlarmForm /></Route>
                <Route path="/settings/heaters"><HeatersForm /></Route>
                <Route path="/settings/temperature-sensors"><TemperatureSensorsForm /></Route>
                <Route path="/settings/sensors"><SensorsForm /></Route>
                <Route path="/settings/relays"><RelaySwitchesForm /></Route>
                <Route path="/settings/wifi-relays"><WifiRelaySwitchesForm /></Route>
                <Route path="/settings/mode-switches"><ModeSwitchesForm /></Route>
                <Route path="/settings/action-switches"><ActionSwitchesForm /></Route>
                <Route path="/settings/switch-groups"><SwitchGroupsForm /></Route>
                <Route><Redirect to={'/'} /></Route>
              </Switch>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
