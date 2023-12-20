import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import RelaySwitchesForm from '../relay-switches-form/RelaySwitchesForm';
import SwitchGroupsForm from '../switch-groups-form/SwitchGroupsForm';
import ActionSwitchesForm from '../action-switches-form/ActionSwitchesForm';

export default function ScrollableTabsButtonVisible() {
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
        <Tab label="Switches"/>
        <Tab label="Action Switches" />
        <Tab label="Switch groups"/>
        <Tab label="Item Three" />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <RelaySwitchesForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ActionSwitchesForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SwitchGroupsForm />
      </CustomTabPanel>
    </Box>
  );
}