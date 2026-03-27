import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import tweetService from "../services/tweet.service";
import userService from "../services/user.service";
import { TweetCard } from "../components";

function Profile() {
  const { username } = useParams();
  const loggedInUser = useSelector((state) => state.auth.userData);

  const [user, setUser] = useState(null);
  const [userTweets, setUserTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const userProfile = await userService.getProfile(username);

        // Inside your useEffect
        if (userProfile?.data) {
          setUser(userProfile.data);

          // 1. Check if the logged-in user's username exists in the followers array
          const isMeInFollowers = userProfile.data.followers.some(
            (follower) => follower.username === loggedInUser?.username,
          );

          setIsFollowing(isMeInFollowers);
        }

        const tweets = await tweetService.getUserTweets(username);
        if (tweets?.data) {
          setUserTweets(tweets.data);
        }
      } catch (error) {
        console.error("Profile :: Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [loggedInUser?.username, username]);

  const handleFollowToggle = async () => {
    const previousState = isFollowing;

    try {
      setIsFollowing(!previousState);

      setUser((prev) => ({
        ...prev,
        followersCount: previousState
          ? prev.followersCount - 1 // If we were following, decrement
          : prev.followersCount + 1, // If we weren't, increment
      }));

      if (previousState) {
        await userService.unfollow(user?._id);
      } else {
        await userService.follow(user?._id);
      }
    } catch (error) {
      setIsFollowing(previousState);
      setUser((prev) => ({
        ...prev,
        followersCount: previousState
          ? prev.followersCount + 1
          : prev.followersCount - 1,
      }));
      console.error("Follow/Unfollow failed:", error);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center dark:text-white">Loading Profile...</div>
    );

  const isOwnProfile = loggedInUser?.data?.user?.username === username;

  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-900">
      {/* Header / Cover Area */}
      <div className="h-40 bg-gray-200 dark:bg-slate-800 w-full relative">
        <div className="absolute -bottom-16 left-4">
          <img
            src={user?.profileImage || "https://placehold.co/150"}
            className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-900 object-cover bg-white"
            alt="profile"
          />
        </div>

        {/* Action Button Area */}
        <div className="absolute -bottom-14 right-4">
          {isOwnProfile ? (
            <Link to="/edit-profile">
              <button className="px-5 py-2 rounded-full font-bold border border-gray-300 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">
                Edit profile
              </button>
            </Link>
          ) : (
            <button
              onClick={handleFollowToggle}
              className={`px-6 py-2 rounded-full font-bold transition-all border ${
                isFollowing
                  ? "bg-transparent border-gray-300 dark:border-gray-600 text-black dark:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  : "bg-black dark:bg-white text-white dark:text-black border-transparent hover:opacity-80"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* User Info Section */}
      <div className="px-4 mt-16 mb-6">
        <div className="pt-2">
          <h1 className="text-xl font-extrabold dark:text-white leading-tight">
            {user?.fullName || "User Name"}
          </h1>
          <p className="text-gray-500">@{user?.username}</p>

          <p className="mt-3 text-[15px] dark:text-gray-200 leading-normal">
            {user?.bio || "No bio yet."}
          </p>

          <div className="flex gap-5 mt-3 text-sm">
            <p className="text-gray-500">
              <span className="font-bold text-black dark:text-white">
                {user?.followingCount || 0}
              </span>{" "}
              Following
            </p>
            <p className="text-gray-500">
              <span className="font-bold text-black dark:text-white">
                {user?.followersCount || 0}
              </span>{" "}
              Followers
            </p>
          </div>
        </div>
      </div>

      {/* Tweets Feed */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        {userTweets.length > 0 ? (
          userTweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
        ) : (
          <div className="p-10 text-center text-gray-500">
            No tweets yet from @{username}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
