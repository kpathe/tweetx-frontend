import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allTweets: [],
  loading: false,
};

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  reducers: {
    setTweets: (state, action) => {
      state.allTweets = action.payload;
    },
    addTweet: (state, action) => {
      state.allTweets.unshift(action.payload);
    },
    removeTweet: (state, action) => {
      state.allTweets = state.allTweets.filter(
        (tweet) => tweet._id !== action.payload,
      );
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setTweets, addTweet, removeTweet, setLoading } =
  tweetSlice.actions;
export default tweetSlice.reducer;
