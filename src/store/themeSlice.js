import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  themeMode: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    light: (state) => {
      state.themeMode = "light";
    },
    dark: (state) => {
      state.themeMode = "dark";
    },
  },
});

export const { light, dark } = themeSlice.actions;
export default themeSlice.reducer;
