import { createSlice } from '@reduxjs/toolkit';
import store from './store';

const slice = createSlice({
  name: 'frigate',
  initialState: {
    config: null,
  },
  reducers: {
    setConfig: (state, action) => {
      state.config = action.payload;
    },
  },
});

const {
  actions,
  reducer: frigateReducer
} = slice;

const { setConfig } = actions;

const frigateMiddleware = () => (next) => async (action) => {
  if (action.type === 'vanpi-app-api/executeQuery/fulfilled') {
    if(action.meta.arg.endpointName === `getFrigateConfig`) {
      store.dispatch(setConfig(action.payload));
    }
  }

  return next(action);
};

export {
  frigateReducer,
  frigateMiddleware
};