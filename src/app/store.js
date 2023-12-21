import { configureStore } from '@reduxjs/toolkit';
import { vanPiAppAPI, useAuthStatusQuery } from '../apis/van-pi/vanpi-app-api';
import { vanPiAPI } from '../apis/van-pi/vanpi-api';
import { authMiddleware } from './middleware';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [vanPiAppAPI.reducerPath]: vanPiAppAPI.reducer,
    [vanPiAPI.reducerPath]: vanPiAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({serializableCheck: false})
      .concat(vanPiAppAPI.middleware)
      .concat(vanPiAPI.middleware)
      .concat(authMiddleware)
  )
});

export default store;