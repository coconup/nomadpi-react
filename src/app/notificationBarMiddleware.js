import { createSlice } from '@reduxjs/toolkit';
import store from './store';
import { toReadableName } from '../utils';

const slice = createSlice({
  name: 'notification_bar',
  initialState: {},
  reducers: {
    setSuccess: (state, action) => {
      return {
        ...state,
        error: null,
        success: action.payload
      }
    },
    setError: (state, action) => {
      return {
        ...state,
        success: null,
        error: action.payload
      }
    }
  }
});

const {
  setSuccess,
  setError
} = slice.actions;

const notificationBarMiddleware = () => (next) => async (action) => {
  const isMutationSuccess = action.type === 'nomadpi-app-api/executeMutation/fulfilled';
  const isMutationError = action.type === 'nomadpi-app-api/executeMutation/rejected';

  if(isMutationSuccess || isMutationError) {
    const { endpointName } = action.meta.arg;

    if(endpointName.startsWith('create') || endpointName.startsWith('update')) {
      const resourceName = toReadableName(endpointName.replace(/^(create|update)/, ''));
      
      if(isMutationSuccess) {
        store.dispatch(setSuccess(`${resourceName} successfully updated`));
      } else if(isMutationError) {
        store.dispatch(setError(`Error updating ${resourceName}: ${action.payload.error}`));
      }   
    }
  }

  return next(action);
};

const notificationBarReducer = slice.reducer;

export {
  notificationBarReducer,
  notificationBarMiddleware,
  setSuccess,
  setError
};