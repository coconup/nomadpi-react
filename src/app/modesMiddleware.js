import { createSlice } from '@reduxjs/toolkit';
import store from './store';

const modesSlice = createSlice({
  name: 'mode',
  initialState: {
    modesState: {},
  },
  reducers: {
    setModesState: (state, action) => {
      state.modesState = action.payload;
    },
  },
});

const { setModesState } = modesSlice.actions;

const modesMiddleware = () => (next) => async (action) => {
  if (action.type === 'vanpi-app-api/executeQuery/fulfilled') {
    if(action.meta.arg.endpointName === 'getModesState') {
      store.dispatch(setModesState(action.payload));
    }
  }

  return next(action);
};

const modesReducer = modesSlice.reducer;

export {
  modesMiddleware,
  modesReducer
};