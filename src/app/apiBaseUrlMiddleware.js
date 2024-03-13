import { createSlice } from '@reduxjs/toolkit';
import store from './store';

const slice = createSlice({
  name: 'api_base_url',
  initialState: {
    http: null,
    ws: null
  },
  reducers: {
    setApiBaseUrl: (state, action) => {
      state.http = action.payload;
      state.ws = action.payload ? `${action.payload.replace('https://', 'wss://').replace('http://', 'ws://')}/ws`: action.payload
    }
  }
});

const { setApiBaseUrl } = slice.actions;

const apiBaseUrlMiddleware = () => (next) => async (action) => {
  if(action.type === 'SET_API_BASE_URL') {
    store.dispatch(
      setApiBaseUrl(action.payload)
    );
  }

  return next(action);
};

const apiBaseUrlReducer = slice.reducer;

export {
  apiBaseUrlReducer,
  apiBaseUrlMiddleware,
  setApiBaseUrl,
};