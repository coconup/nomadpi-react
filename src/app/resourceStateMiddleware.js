// import { createSlice } from '@reduxjs/toolkit';
// import store from './store';
// import { uppercaseFirstLetter } from '../utils';

// const resourceNames = [
//   'gps',
//   'modes',
//   'relays',
//   'batteries',
//   'waterTanks',
//   'temperatureSensors',
//   'solarChargeControllers',
//   'alarm'
// ];

// const states = {};

// let initialState = {};
// let reducers = {};
// let actionNames = [];

// resourceNames.forEach(name => {
//   const uppercaseResourceName = uppercaseFirstLetter(name);

//   initialState[name] = {};

//   reducers[`set${uppercaseResourceName}State`] = (state, action) => {
//     state[name] = action.payload;
//   };

//   actionNames.push(`get${uppercaseResourceName}State`);
// })

// const slice = createSlice({
//   name: `state`,
//   initialState,
//   reducers
// });

// const middleware = () => (next) => async (action) => {
//   let endpointName;

//   if (action.type === 'vanpi-app-api/executeQuery/fulfilled') {
//     endpointName = action.meta.arg.endpointName;
//   } else if (action.type === 'vanpi-app-api/queries/queryResultPatched') {
//     endpointName = action.payload.queryCacheKey.split('(')[0];
//   }

//   if(endpointName && actionNames.find(a => a === endpointName)) {
//     const state = store.getState();
//     const { data } = Object.values(state['vanpi-app-api'].queries).find(q => q.endpointName === endpointName);

//     const setter = slice.actions[endpointName.replace(/^get/, 'set')];

//     store.dispatch(setter(data));
//   }

//   return next(action);
// };

// const resourcesStateReducer = slice.reducer;
// const resourcesStateMiddleware = middleware;

// export {
//   resourcesStateReducer,
//   resourcesStateMiddleware,
//   resourceNames
// };