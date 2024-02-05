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

let initialState = {};
let reducers = {};
let actionNames = [];

resourceNames.forEach(name => {
  const uppercaseResourceName = uppercaseFirstLetter(name);

  initialState[name] = {};

  reducers[`set${uppercaseResourceName}State`] = (state, action) => {
    state[name] = action.payload;
  };

  actionNames.push(`get${uppercaseResourceName}State`);
})

const slice = createSlice({
  name: `state`,
  initialState,
  reducers
});

const middleware = () => (next) => async (action) => {
  if (action.type === 'vanpi-app-api/executeQuery/fulfilled') {
    const actionName = actionNames.find(a => a === action.meta.arg.endpointName);
    if(actionName) {
      const setter = slice.actions[actionName.replace(/^get/, 'set')];
      store.dispatch(setter(action.payload));
    }
  }

  return next(action);
};

const resourcesStateReducer = slice.reducer;
const resourcesStateMiddleware = middleware;

export {
  resourcesStateReducer,
  resourcesStateMiddleware,
  resourceNames
};