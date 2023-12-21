import { useCheckAuthStatusQuery } from '../apis/van-pi/vanpi-app-api';
import { setLoggedIn } from './authSlice';
import store from './store';

export const authMiddleware = () => (next) => async (action) => {
  if (action.type === 'vanpi-app-api/executeQuery/fulfilled') {
    if(!store.getState().loggedIn) store.dispatch(setLoggedIn(true));
  } else if (action.type === 'vanpi-app-api/executeQuery/rejected') {
    if(action.payload.status === 401) {
      store.dispatch(setLoggedIn(false));
    }
  }

  return next(action);
};