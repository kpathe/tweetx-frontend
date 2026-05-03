import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTweets, setLoading } from "../store/tweetSlice";
import { PostForm, TweetCard, Container, FeedTabs, Spinner } from "../components";
import feedService from "../services/feed.service";

function Home() {
  const [activeTab, setActiveTab] = useState("For you");
  const dispatch = useDispatch();
  const tweets = useSelector((state) => state.tweet?.allTweets || []);
  const loading = useSelector((state) => state.tweet.loading);

  useEffect(() => {
    const fetchSelectedFeed = async () => {
      dispatch(setLoading(true));
      try {
        let response;
        if (activeTab === "For you") {
          response = await feedService.getHomeFeed();
        } else {
          response = await feedService.getFeed();
        }

        if (response) {
          dispatch(setTweets(response));
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
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </Container>
    );

  return (
    <div className="w-full">
      <div
        className="sticky top-0 z-10"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <FeedTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <PostForm />

      <div className="flex flex-col">
        {tweets?.length > 0 ? (
          tweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
        ) : (
          <div className="p-10 text-center">
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>No tweets yet</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Be the first to share something
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
