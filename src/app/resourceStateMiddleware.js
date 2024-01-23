import { createSlice } from '@reduxjs/toolkit';
import store from './store';
import { uppercaseFirstLetter } from '../utils';

const resourceNames = [
  'gps',
  'modes',
  'relays',
  'batteries',
  'waterTanks',
  'temperatureSensors',
  'solarChargeControllers'
];

const states = {};

resourceNames.forEach(resourceName => {
  const uppercaseResourceName = uppercaseFirstLetter(resourceName);
  const slice = createSlice({
    name: resourceName,
    initialState: {
      [`${resourceName}State`]: {}
    },
    reducers: {
      [`set${uppercaseResourceName}State`]: (state, action) => {
        state[`${resourceName}State`] = action.payload;
      },
    }
  });

  const setState = slice.actions[`set${uppercaseResourceName}State`];
  const reducer = slice.reducer;

  const middleware = () => (next) => async (action) => {
    if (action.type === 'vanpi-app-api/executeQuery/fulfilled') {
      if(action.meta.arg.endpointName === `get${uppercaseResourceName}State`) {
        store.dispatch(setState(action.payload));
      }
    }

    return next(action);
  };

  states[`${resourceName}Middleware`] = middleware;
  states[`${resourceName}Reducer`] = reducer;
});

export {
  states,
  resourceNames
};