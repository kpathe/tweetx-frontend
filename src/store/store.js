import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import themeReducer from "./themeSlice";
import tweetReducer from "./tweetSlice";

const store = configureStore({
  reducer: { auth: authReducer, theme: themeReducer, tweet: tweetReducer },
});

export default store;
