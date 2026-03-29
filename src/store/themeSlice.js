import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  themeMode: localStorage.getItem("theme") || "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    light: (state) => {
      state.themeMode = "light";
      localStorage.setItem("theme", "light");
    },
    dark: (state) => {
      state.themeMode = "dark";
      localStorage.setItem("theme", "dark");
    },
  },
});

export const { light, dark } = themeSlice.actions;
export default themeSlice.reducer;


