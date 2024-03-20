import { useState, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from "wouter";
import Init from './Init';

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
import WeatherForecast from './components/weather-forecast/WeatherForecast';

import MobileInitScreen from './components/mobile-init-screen/MobileInitScreen';

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

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const [demo] = useState(!!urlParams.get('demo') || true);

  const Main = ({ onReset }) => {
    return (
      <Box 
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <ResponsiveAppBar />
        <NotificationBar />
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex'
          }}
        >
          <Switch>
            <Route path="/"><HomePanel demo={demo}/></Route>
            <Route path="/control-panel"><SwitchGroupsPage /></Route>
            <Route path="/monitor"><MonitorPage demo={demo} /></Route>
            <Route path="/security"><CamerasPage demo={demo} /></Route>
            <Route path="/heater"><HeatersPage /></Route>

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
            <Route path="/settings/mobile-app"><MobileInitScreen onSave={onReset} /></Route>
            <Route path="/settings/appearance"><SettingsForm currentPath={'appearance'}/></Route>
            <Route path="/settings/devices"><SettingsForm currentPath={'devices'}/></Route>
            <Route path="/settings/weather-and-maps"><SettingsForm currentPath={'weather-and-maps'}/></Route>
            <Route path="/settings/voice-assistant"><SettingsForm currentPath={'voice-assistant'}/></Route>
            <Route path="/settings/notifications"><SettingsForm currentPath={'notifications'}/></Route>
            <Route path="/settings/remote-access"><SettingsForm currentPath={'remote-access'}/></Route>
            <Route path="/settings/cloud-sync"><SettingsForm currentPath={'cloud-sync'}/></Route>
            <Route><Redirect to={'/'} /></Route>
          </Switch>
        </Box>
      </Box>
    )
  }

  return (
    <Init>
      <Main />
    </Init>
  );
}

export default App;
