// import { createSlice } from '@reduxjs/toolkit';
// import store from './store';

// const slice = createSlice({
//   name: 'slice',
//   initialState: {
//     settings: null,
//   },
//   reducers: {
//     setSettings: (state, action) => {
//       state.settings = action.payload;
//     },
//   },
// });

// const {
//   actions,
//   reducer: settingsReducer
// } = slice;

// const { setSettings } = actions;

// const settingsMiddleware = () => (next) => async (action) => {
//   if (action.type === 'vanpi-app-api/executeQuery/fulfilled') {
//     if(action.meta.arg.endpointName === `getSettings`) {
//       store.dispatch(setSettings(action.payload));
//     }
//   }

//   return next(action);
// };

// export {
//   settingsReducer,
//   settingsMiddleware
// };