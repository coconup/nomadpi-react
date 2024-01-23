import { useState } from 'react';

import BottomNavigation from '../ui/BottomNavigation';
import Container from '../ui/Container';

import BatteriesPage from '../batteries-page/BatteriesPage';
import TemperatureSensorsPage from '../temperature-sensors-page/TemperatureSensorsPage';
import WaterTanksPage from '../water-tanks-page/WaterTanksPage';
import SolarChargeControllersPage from '../solar-charge-controllers-page/SolarChargeControllersPage';

export default function MonitorPage() {
  const tabs = [
    {
      name: 'Water tanks',
      icon: 'water'
    },
    {
      name: 'Temperature',
      icon: 'thermostat'
    },
    {
      name: 'Batteries',
      icon: 'battery_charging_full'
    },
    {
      name: 'Solar',
      icon: 'solar_power'
    }
  ];

  const initialState = {
    selectedTab: tabs[0].name,
    init: false
  };

  const [state, setState] = useState(initialState);  

  const { selectedTab } = state;

  return (
    <Container>
      { selectedTab === tabs[0].name && <WaterTanksPage /> }
      { selectedTab === tabs[1].name && <TemperatureSensorsPage /> }
      { selectedTab === tabs[2].name && <BatteriesPage /> }
      { selectedTab === tabs[3].name && <SolarChargeControllersPage /> }
      <BottomNavigation
        tabs={tabs}
        value={state.selectedTab}
        onChange={(event, value) => {
          setState({...state, selectedTab: value})
        }}
      />
    </Container>
  );
}