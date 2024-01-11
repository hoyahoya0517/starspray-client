import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  nav: false,
};

const navSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    navOff: (state) => {
      state.nav = false;
    },
    navOn: (state) => {
      state.nav = true;
    },
  },
});

export const store = configureStore({
  reducer: navSlice.reducer,
});

export const { navOff, navOn } = navSlice.actions;
