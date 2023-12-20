import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../components/counter/counterSlice';
import { vanPiAppAPI } from '../apis/van-pi/vanpi-app-api';
import { vanPiAPI } from '../apis/van-pi/vanpi-api';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [vanPiAppAPI.reducerPath]: vanPiAppAPI.reducer,
    [vanPiAPI.reducerPath]: vanPiAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({serializableCheck: false})
      .concat(vanPiAppAPI.middleware)
      .concat(vanPiAPI.middleware)
  )
});