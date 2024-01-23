import { configureStore } from '@reduxjs/toolkit';
import { vanPiAppAPI, useAuthStatusQuery } from '../apis/van-pi/vanpi-app-api';
import { vanPiServicesAPI } from '../apis/van-pi/vanpi-services-api';

import { authMiddleware, authReducer } from './authMiddleware';
import { states, resourceNames } from './resourceStateMiddleware';

let reducer = {
  [vanPiAppAPI.reducerPath]: vanPiAppAPI.reducer,
  [vanPiServicesAPI.reducerPath]: vanPiServicesAPI.reducer,
  auth: authReducer,
};

resourceNames.forEach(name => {
  reducer[name] = states[`${name}Reducer`];
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({serializableCheck: false})
      .concat(vanPiAppAPI.middleware)
      .concat(vanPiServicesAPI.middleware)
      .concat(authMiddleware)
      .concat(
        resourceNames.map(name => states[`${name}Middleware`])
      )
  )
});

export default store;