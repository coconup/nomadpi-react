import { configureStore } from '@reduxjs/toolkit';
import { vanPiAppAPI, useAuthStatusQuery } from '../apis/van-pi/vanpi-app-api';
import { authMiddleware, relaysMiddleware } from './middleware';
import authReducer from './authSlice';
import relaysReducer from './relaysSlice';
import { modesMiddleware, modesReducer } from './modesMiddleware';

const store = configureStore({
  reducer: {
    auth: authReducer,
    relays: relaysReducer,
    modes: modesReducer,
    [vanPiAppAPI.reducerPath]: vanPiAppAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({serializableCheck: false})
      .concat(vanPiAppAPI.middleware)
      .concat(authMiddleware)
      .concat(relaysMiddleware)
      .concat(modesMiddleware)
  )
});

export default store;