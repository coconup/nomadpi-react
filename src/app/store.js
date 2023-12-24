import { configureStore } from '@reduxjs/toolkit';
import { vanPiAppAPI, useAuthStatusQuery } from '../apis/van-pi/vanpi-app-api';
import { authMiddleware, relaysMiddleware } from './middleware';
import authReducer from './authSlice';
import relaysReducer from './relaysSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    relays: relaysReducer,
    [vanPiAppAPI.reducerPath]: vanPiAppAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({serializableCheck: false})
      .concat(vanPiAppAPI.middleware)
      .concat(authMiddleware)
      .concat(relaysMiddleware)
  )
});

export default store;