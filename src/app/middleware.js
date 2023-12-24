import { useCheckAuthStatusQuery } from '../apis/van-pi/vanpi-app-api';
import { setLoggedIn } from './authSlice';
import { setRelaysState } from './relaysSlice';
import store from './store';

export const authMiddleware = () => (next) => async (action) => {
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

export const relaysMiddleware = () => (next) => async (action) => {
  if (action.type === 'vanpi-app-api/executeQuery/fulfilled') {
    if(action.meta.arg.endpointName === 'getRelaysState') {
      store.dispatch(setRelaysState(action.payload));
    }
  }

  return next(action);
};