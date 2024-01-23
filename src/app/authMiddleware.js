import { createSlice } from '@reduxjs/toolkit';
import store from './store';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loggedIn: null,
  },
  reducers: {
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload;
    },
  },
});

const setLoggedIn = authSlice.actions.setLoggedIn;

const authMiddleware = () => (next) => async (action) => {
  if (action.type === 'vanpi-app-api/executeQuery/fulfilled') {
    if(!store.getState().loggedIn) store.dispatch(setLoggedIn(true));
  } else if (action.type === 'vanpi-app-api/executeQuery/rejected') {
    if(!action.payload) return;

    const [
      endpointName,
      status
    ] = [
      action.meta.arg.endpointName,
      action.payload.status
    ];

    if(status === 401) {
      store.dispatch(setLoggedIn(false));
    } else if(endpointName === 'checkAuthStatus' && ['FETCH_ERROR', 404].includes(status)) {
      // checkAuthStatus returns 404 
      // if authentication is disabled 
      // on the server
      store.dispatch(setLoggedIn(true));
    }
  };

  return next(action);
};

const authReducer = authSlice.reducer;

export {
  setLoggedIn,
  authReducer,
  authMiddleware
};