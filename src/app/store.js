import { configureStore } from '@reduxjs/toolkit';
import { vanPiAppAPI, useAuthStatusQuery } from '../apis/van-pi/vanpi-app-api';
// import { vanPiServicesAPI } from '../apis/van-pi/vanpi-services-api';

import { authMiddleware, authReducer } from './authMiddleware';
import { frigateMiddleware, frigateReducer } from './frigateMiddleware';
import { notificationBarMiddleware, notificationBarReducer } from './notificationBarMiddleware';
import { resourcesStateMiddleware, resourcesStateReducer } from './resourceStateMiddleware';
import { resources, resourceNames as crudResourceNames } from './crudResourcesMiddleware';

import { createSelector } from 'reselect';

let reducer = {
  [vanPiAppAPI.reducerPath]: vanPiAppAPI.reducer,
  auth: authReducer,
  frigate: frigateReducer,
  notification_bar: notificationBarReducer,
  state: resourcesStateReducer
};

crudResourceNames.forEach(name => {
  reducer[name] = resources[`${name}Reducer`];
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({serializableCheck: false})
      .concat(vanPiAppAPI.middleware)
      .concat(authMiddleware)
      .concat(frigateMiddleware)
      .concat(notificationBarMiddleware)
      .concat(resourcesStateMiddleware)
      .concat(
        crudResourceNames.map(name => resources[`${name}Middleware`])
      )
  )
});

export default store;