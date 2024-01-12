import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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
        <Tab label="General"/>
        <Tab label="Batteries"/>
        <Tab label="Water Tanks"/>
        <Tab label="Cameras"/>
        <Tab label="Sensors"/>
        <Tab label="Relays"/>
        <Tab label="WiFi Relays"/>
        <Tab label="Mode Switches" />
        <Tab label="Action Switches" />
        <Tab label="Switch groups"/>
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <SettingsForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <BatteriesForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <WaterTanksForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <CamerasForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <SensorsForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <RelaySwitchesForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <WifiRelaySwitchesForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={7}>
        <ModeSwitchesForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={8}>
        <ActionSwitchesForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={9}>
        <SwitchGroupsForm />
      </CustomTabPanel>
    </Box>
  );
}