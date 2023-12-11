import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../components/counter/counterSlice';
import { vanPiAPI } from '../apis/van-pi/van-pi-api';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [vanPiAPI.reducerPath]: vanPiAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({serializableCheck: false})
      .concat(vanPiAPI.middleware)
  )
});