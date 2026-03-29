import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setTweets } from "../store/tweetSlice";
import tweetService from "../services/tweet.service";
import userService from "../services/user.service";
import { TweetCard, Spinner } from "../components";
import { ArrowLeft, Search } from "lucide-react";

function Profile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Get tweets from Redux instead of local state
  const allTweets = useSelector((state) => state.tweet.allTweets);
  const loggedInUser = useSelector((state) => state.auth.userData);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

 

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Fetch User Profile
        const userProfile = await userService.getProfile(username);
        if (userProfile?.data) {
          setUser(userProfile.data);
          const isMeInFollowers = userProfile.data.followers.some(
            (follower) => follower.username === loggedInUser?.username,
          );
          setIsFollowing(isMeInFollowers);
        }

        // 2. Fetch Tweets and store them in REDUX
        const tweetsResponse = await tweetService.getUserTweets(username);
        if (tweetsResponse?.data) {
          const data = tweetsResponse.data;
          dispatch(setTweets({ data }));
        }
      } catch (error) {
        console.error("Profile :: Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();

    // Cleanup: Optional - clear tweets when leaving profile so home feed doesn't mix
    // return () => dispatch(setTweets([]));
  }, [username, loggedInUser?.username, dispatch]);

  const handleFollowToggle = async () => {
    const previousState = isFollowing;
    try {
      setIsFollowing(!previousState);
      setUser((prev) => ({
        ...prev,
        followersCount: previousState
          ? prev.followersCount - 1
          : prev.followersCount + 1,
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
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Spinner size="lg" className="text-violet-600 dark:text-violet-400" />
      </div>
    );

  const isOwnProfile =
    loggedInUser?.data?.user?.username === username ||
    loggedInUser?.username === username;

  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-950">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-700 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-900 dark:text-white"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1 text-center px-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">
            {user?.fullName}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {allTweets.length} posts
          </p>
        </div>

        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-900 dark:text-white">
          <Search size={20} />
        </button>
      </div>

      {/* Cover Image - Reduced height */}
      <div className="relative h-32 sm:h-40 bg-gradient-to-r from-violet-400 to-violet-600 dark:from-violet-700 dark:to-violet-900 w-full">
        {/* Profile Picture centered on bottom edge of cover */}
        <div className="absolute bottom-0 left-4 translate-y-1/2">
          <img
            src={user?.profileImage || "https://placehold.co/150"}
            className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white dark:border-slate-950 object-cover bg-white ring-1 ring-gray-200 dark:ring-gray-700 shadow-lg"
            alt="profile"
          />
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-4 pt-20 pb-4">
        {/* Name with Edit/Follow Button */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.fullName}
          </h1>
          {/* Edit/Follow Button */}
          <div>
            {isOwnProfile ? (
              <Link to="/edit-profile">
                <button className="px-6 py-2 rounded-full font-bold border-2 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                  Edit profile
                </button>
              </Link>
            ) : (
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-2 rounded-full font-bold transition-all border-2 ${
                  isFollowing
                    ? "bg-transparent border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 hover:text-red-500"
                    : "bg-violet-600 dark:bg-violet-700 text-white border-violet-600 dark:border-violet-700 hover:bg-violet-700 dark:hover:bg-violet-600"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Username and Joined Date */}
        <div className="flex items-center gap-2 mb-3">
          <p className="text-gray-500 dark:text-gray-400">@{user?.username}</p>
          {user?.createdAt && (
            <p className="text-gray-500 dark:text-gray-400">
              • Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Bio */}
        <p className="text-base text-gray-700 dark:text-gray-200 mb-4">
          {user?.bio || ""}
        </p>

        {/* Metadata - Links and Joined Date */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          {user?.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              🔗 {user.website}
            </a>
          )}
        </div>

        {/* Following and Followers count */}
        <div className="flex gap-5 text-sm">
          <div>
            <span className="font-bold text-gray-900 dark:text-white">
              {user?.followingCount || 0}
            </span>{" "}
            <span className="text-gray-600 dark:text-gray-400">Following</span>
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white">
              {user?.followersCount || 0}
            </span>{" "}
            <span className="text-gray-600 dark:text-gray-400">Followers</span>
          </div>
        </div>
      </div>

      {/* Tweets Section */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        {allTweets.length > 0 ? (
          allTweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
        ) : (
          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">No tweets yet</p>
            <p className="text-sm mt-1">
              {isOwnProfile
                ? "Share your first tweet to get started!"
                : "This user hasn't posted any tweets yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
