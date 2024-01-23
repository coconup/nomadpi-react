import * as React from 'react';

import {
  Box,
  Tabs,
  Tab
} from '@mui/material';

import { tabsClasses } from '@mui/material/Tabs';

import RelaySwitchesForm from '../relay-switches-form/RelaySwitchesForm';
import WifiRelaySwitchesForm from '../wifi-relay-switches-form/WifiRelaySwitchesForm';
import ModeSwitchesForm from '../mode-switches-form/ModeSwitchesForm';
import SwitchGroupsForm from '../switch-groups-form/SwitchGroupsForm';
import ActionSwitchesForm from '../action-switches-form/ActionSwitchesForm';
import SettingsForm from '../settings-form/SettingsForm';
import BatteriesForm from '../batteries-form/BatteriesForm';
import WaterTanksForm from '../water-tanks-form/WaterTanksForm';
import SensorsForm from '../sensors-form/SensorsForm';
import CamerasForm from '../cameras-form/CamerasForm';
import HeatersForm from '../heaters-form/HeatersForm';
import TemperatureSensorsForm from '../temperature-sensors-form/TemperatureSensorsForm';
import SolarChargeControllersForm from '../solar-charge-controllers-form/SolarChargeControllersForm';

export default function SettingsPage() {
  const [state, setState] = React.useState({
    value: 0
  });

  const { value } = state;

  const handleChange = (event, value) => {
    setState({...state, value});
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ 
            padding: 3
          }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  const pages = [
    {
      label: "General",
      component: <SettingsForm />
    },
    {
      label: "Batteries",
      component: <BatteriesForm />
    },
    {
      label: "Solar Charge Controller",
      component: <SolarChargeControllersForm />
    },
    {
      label: "Water Tanks",
      component: <WaterTanksForm />
    },
    {
      label: "Cameras",
      component: <CamerasForm />
    },
    {
      label: "Heaters",
      component: <HeatersForm />
    },
    {
      label: "Temperature Sensors",
      component: <TemperatureSensorsForm />
    },
    {
      label: "Sensors",
      component: <SensorsForm />
    },
    {
      label: "Relays",
      component: <RelaySwitchesForm />
    },
    {
      label: "WiFi Relays",
      component: <WifiRelaySwitchesForm />
    },
    {
      label: "Mode Switches" ,
      component: <ModeSwitchesForm />
    },
    {
      label: "Action Switches" ,
      component: <ActionSwitchesForm />
    },
    {
      label: "Switch groups",
      component: <SwitchGroupsForm />
    }
  ]

  return (
    <Box
      sx={{
        flexGrow: 1
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {
          pages.map(({ label }, index) => {
            return (
              <Tab 
                label={label}
                key={`settings-page-tab-${index}`}
              />
            )
          })
        }
      </Tabs>
      {
        pages.map(({ component }, index) => {
          return (
            <CustomTabPanel 
              value={value}
              index={index}
              key={`settings-page-${index}`}
            >
              { component }
            </CustomTabPanel>
          )
        })
      }
    </Box>
  );
}