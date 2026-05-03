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
      state.allTweets = action.payload.data || [];
    },
    addTweet: (state, action) => {
      const newTweet = action.payload.data || action.payload;

      if (Array.isArray(state.allTweets)) {
        state.allTweets.unshift(newTweet);
      } else {
        state.allTweets = [newTweet];
      }
    },
    removeTweet: (state, action) => {
      state.allTweets = state.allTweets.filter(
        (tweet) => tweet._id !== action.payload,
      );
    },
    // Sets commentsCount to an exact value — used on TweetPage load to correct
    // any stale count the backend may have returned in the feed.
    setTweetCommentsCount: (state, action) => {
      const { tweetId, count } = action.payload;
      // console.log("reducer hit", { tweetId, count, allTweets: state.allTweets.map(t => t._id) });
      state.allTweets = state.allTweets.map((tweet) =>
        tweet._id === tweetId
          ? { ...tweet, commentsCount: count }
          : tweet
      );
    },
    // Increments or decrements commentsCount on a specific tweet in the store.
    // Uses map() instead of find+mutate so a new array reference is produced,
    // which guarantees useSelector triggers a re-render in Home/feed components.
    updateTweetCommentsCount: (state, action) => {
      const { tweetId, delta } = action.payload;
      state.allTweets = state.allTweets.map((tweet) =>
        tweet._id === tweetId
          ? { ...tweet, commentsCount: Math.max(0, (tweet.commentsCount ?? 0) + delta) }
          : tweet
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setTweets, addTweet, removeTweet, updateTweetCommentsCount, setTweetCommentsCount, setLoading } =
  tweetSlice.actions;
export default tweetSlice.reducer;