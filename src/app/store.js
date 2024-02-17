import { configureStore } from '@reduxjs/toolkit';
import { vanPiAppAPI } from '../apis/van-pi/vanpi-app-api';
// import { vanPiServicesAPI } from '../apis/van-pi/vanpi-services-api';

import { frigateMiddleware, frigateReducer } from './frigateMiddleware';
import { notificationBarMiddleware, notificationBarReducer } from './notificationBarMiddleware';
// import { resourcesStateMiddleware, resourcesStateReducer } from './resourceStateMiddleware';
import { resources, resourceNames as crudResourceNames } from './crudResourcesMiddleware';

import { createSelector } from 'reselect';

let reducer = {
  [vanPiAppAPI.reducerPath]: vanPiAppAPI.reducer,
  frigate: frigateReducer,
  notification_bar: notificationBarReducer,
  // state: resourcesStateReducer
};

crudResourceNames.forEach(name => {
  reducer[name] = resources[`${name}Reducer`];
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({serializableCheck: false})
      .concat(vanPiAppAPI.middleware)
      .concat(frigateMiddleware)
      .concat(notificationBarMiddleware)
      // .concat(resourcesStateMiddleware)
      .concat(
        crudResourceNames.map(name => resources[`${name}Middleware`])
      )
  )
});

const getQueryState = (state, query, args) => {
  return state['vanpi-app-api'].queries[`${query}(${args === undefined ? 'undefined': JSON.stringify(args)})`] || {};
}

const selectGpsState = state => getQueryState(state, 'getGpsState').data || {};
const selectRelaysState = state => getQueryState(state, 'getRelaysState').data || {};
const selectModesState = state => getQueryState(state, 'getModesState').data || {};
const selectAlarmState = state => getQueryState(state, 'getAlarmState').data || {};
const selectBatteriesState = state => getQueryState(state, 'getBatteriesState').data || {};
const selectWaterTanksState = state => getQueryState(state, 'getWaterTanksState').data || {};
const selectTemperatureSensorsState = state => getQueryState(state, 'getTemperatureSensorsState').data || {};
const selectSolarChargeControllersState = state => getQueryState(state, 'getSolarChargeControllersState').data || {};

const selectServiceCredentials = (service_id) => state => getQueryState(state, 'getServiceCredentials', { service_id }).data || {};

const selectSetting = (key) => state => (getQueryState(state, 'getSettings').data || []).find(({ setting_key }) => key === setting_key);

export default store;

export {
  selectGpsState,
  selectRelaysState,
  selectModesState,
  selectAlarmState,
  selectBatteriesState,
  selectWaterTanksState,
  selectTemperatureSensorsState,
  selectSolarChargeControllersState,
  selectServiceCredentials,
  selectSetting,
}