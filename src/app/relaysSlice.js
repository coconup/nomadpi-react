import { createSlice } from '@reduxjs/toolkit';

const relaysSlice = createSlice({
  name: 'relays',
  initialState: {
    relaysState: {},
  },
  reducers: {
    setRelaysState: (state, action) => {
      state.relaysState = action.payload;
    },
  },
});

export const { setRelaysState } = relaysSlice.actions;

export default relaysSlice.reducer;
