import { configureStore } from '@reduxjs/toolkit';
import { vanPiAppAPI, useAuthStatusQuery } from '../apis/van-pi/vanpi-app-api';
import { vanPiServicesAPI } from '../apis/van-pi/vanpi-services-api';
import { authMiddleware, relaysMiddleware } from './middleware';
import authReducer from './authSlice';
import relaysReducer from './relaysSlice';
import { modesMiddleware, modesReducer } from './modesMiddleware';

const store = configureStore({
  reducer: {
    [vanPiAppAPI.reducerPath]: vanPiAppAPI.reducer,
    [vanPiServicesAPI.reducerPath]: vanPiServicesAPI.reducer,
    auth: authReducer,
    relays: relaysReducer,
    modes: modesReducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({serializableCheck: false})
      .concat(vanPiAppAPI.middleware)
      .concat(vanPiServicesAPI.middleware)
      .concat(authMiddleware)
      .concat(relaysMiddleware)
      .concat(modesMiddleware)
  )
});

export default store;