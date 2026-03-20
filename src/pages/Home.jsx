import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTweets, setLoading } from "../store/tweetSlice";
import { PostForm, TweetCard, Container } from "../components";
import feedService from "../services/feed.service";

function Home() {
  const dispatch = useDispatch();
  const tweets = useSelector((state) => state.tweet.allTweets);
  console.log(tweets);
  const loading = useSelector((state) => state.tweet.loading);

  useEffect(() => {
    const fetchTweets = async () => {
      dispatch(setLoading(true));
      try {
        const response = await feedService.getHomeFeed();
        console.log(response.data);
        if (response) {
          dispatch(setTweets(response.data));
        }
      } catch (error) {
        console.error("Home :: fetchTweets :: error", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTweets();
  }, [dispatch]);

  if (loading)
    return (
      <Container>
        <h1>Loading Feed...</h1>
      </Container>
    );

  return (
    <div className="w-full">
      <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-10">
        <h1 className="text-xl font-bold dark:text-white">Home</h1>
      </div>

      <PostForm />

      <div className="flex flex-col">
        {tweets.length > 0 ? (
          tweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
        ) : (
          <div className="p-10 text-center text-gray-500">
            No tweets yet. Be the first to post!
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
