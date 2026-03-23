import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import tweetService from "../services/tweet.service";
import userService from "../services/user.service";
import { TweetCard, } from "../components";

function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [userTweets, setUserTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const userProfile = await userService.getProfile(username);
        console.log(userProfile.data);
        if (userProfile) setUser(userProfile?.data);

        const tweets = await tweetService.getUserTweets(username);
        console.log(tweets)
        if (tweets) setUserTweets(tweets?.data);
      } catch (error) {
        console.error("Profile :: Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [username]);

  if (loading)
    return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="w-full">
      {/* Header / Cover Area */}
      <div className="h-32 bg-violet-200 dark:bg-slate-800 w-full"></div>

      {/* User Info */}
      <div className="px-4 -mt-12 mb-6">
        <img
          src={user?.avatar || "https://placehold.co/150"}
          className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-900 object-cover"
        />
        <div className="mt-3">
          <h1 className="text-2xl font-bold dark:text-white">{user?.name}</h1>
          <p className="text-gray-500">@{user?.username}</p>
          <p className="mt-2 dark:text-gray-300">
            {user?.bio || "No bio yet."}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800">
        {userTweets.map((tweet) => (
          <TweetCard key={tweet._id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}

export default Profile;
