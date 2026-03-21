import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTweets, setLoading } from "../store/tweetSlice";
import { PostForm, TweetCard, Container, FeedTabs } from "../components";
import feedService from "../services/feed.service";

function Home() {
  const [activeTab, setActiveTab] = useState("For you");
  const dispatch = useDispatch();
  const tweets = useSelector((state) => state.tweet?.allTweets || []);
  // console.log(tweets);
  const loading = useSelector((state) => state.tweet.loading);

  useEffect(() => {
    const fetchSelectedFeed = async () => {
      dispatch(setLoading(true));
      try {
        let response;
        if (activeTab === "For you") {
          response = await feedService.getHomeFeed(); // Your random/algo feed
        } else {
          response = await feedService.getFeed(); // Feed from followed users
        }

        if (response) {
          dispatch(setTweets(response)); // This fills your 'allTweets' array
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchSelectedFeed();
  }, [activeTab, dispatch]);

  if (loading)
    return (
      <Container>
        <h1>Loading Feed...</h1>
      </Container>
    );

  return (
    <div className="w-full">
      <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-10">
        <FeedTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <PostForm />

      <div className="flex flex-col">
        {tweets?.length > 0 ? (
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
