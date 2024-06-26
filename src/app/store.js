import { configureStore } from '@reduxjs/toolkit';
import { vanPiAppAPI } from '../apis/nomadpi/nomadpi-app-api';
// import { vanPiServicesAPI } from '../apis/nomadpi/nomadpi-services-api';

import { frigateMiddleware, frigateReducer } from './frigateMiddleware';
import { notificationBarMiddleware, notificationBarReducer } from './notificationBarMiddleware';
import { apiBaseUrlReducer, apiBaseUrlMiddleware } from './apiBaseUrlMiddleware';
import { resources, resourceNames as crudResourceNames } from './crudResourcesMiddleware';

import { createSelector } from 'reselect';

let reducer = {
  [vanPiAppAPI.reducerPath]: vanPiAppAPI.reducer,
  frigate: frigateReducer,
  notification_bar: notificationBarReducer,
  api_base_url: apiBaseUrlReducer
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
      .concat(apiBaseUrlMiddleware)
      .concat(
        crudResourceNames.map(name => resources[`${name}Middleware`])
      )
  )
});

const getQueryState = (state, query, args) => {
  return state['nomadpi-app-api'].queries[`${query}(${args === undefined ? 'undefined': JSON.stringify(args)})`] || {};
}

const selectApiBaseUrl = state => state ? state['api_base_url'] : {};
const selectGpsState = state => getQueryState(state, 'getGpsState').data || {};
const selectSwitchablesState = state => getQueryState(state, 'getSwitchablesState').data || {};
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
  selectApiBaseUrl,
  selectGpsState,
  selectSwitchablesState,
  selectModesState,
  selectAlarmState,
  selectBatteriesState,
  selectWaterTanksState,
  selectTemperatureSensorsState,
  selectSolarChargeControllersState,
  selectServiceCredentials,
  selectSetting,
}