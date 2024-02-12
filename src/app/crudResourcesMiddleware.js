import { createSlice } from '@reduxjs/toolkit';
import store from './store';
import { uppercaseFirstLetter } from '../utils';

const resourceNames = [
  'modes',
  'relays',
  'wifiRelays',
  'actionSwitches',
  'switchGroups',
  'batteries',
  'waterTanks',
  'temperatureSensors',
  'solarChargeControllers',
  'cameras',
  'sensors',
  'heaters',
  'settings'
];

const resources = {};

resourceNames.forEach(resourceName => {
  const uppercaseResourceName = uppercaseFirstLetter(resourceName);
  const slice = createSlice({
    name: resourceName,
    initialState: null,
    reducers: {
      [`set${uppercaseResourceName}`]: (state, action) => {
        return action.payload;
      },
    }
  });

  const setState = slice.actions[`set${uppercaseResourceName}`];
  const reducer = slice.reducer;

  const middleware = () => (next) => async (action) => {
    if (action.type === 'vanpi-app-api/executeQuery/fulfilled') {
      if(action.meta.arg.endpointName === `get${uppercaseResourceName}`) {
        store.dispatch(setState(action.payload));
        
      }
    } else {
    }

    return next(action);
  };

  resources[`${resourceName}Middleware`] = middleware;
  resources[`${resourceName}Reducer`] = reducer;
});

export {
  resources,
  resourceNames
};