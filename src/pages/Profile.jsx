import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setTweets } from "../store/tweetSlice";
import tweetService from "../services/tweet.service";
import userService from "../services/user.service";
import { TweetCard, Spinner } from "../components";
import Avatar from "../components/Avatar";
import { ArrowLeft } from "lucide-react";

function Profile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allTweets = useSelector((state) => state.tweet.allTweets);
  const loggedInUser = useSelector((state) => state.auth.userData);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const userProfile = await userService.getProfile(username);
        if (userProfile?.data) {
          setUser(userProfile.data);
          const isMeInFollowers = userProfile.data.followers.some(
            (follower) => follower.username === loggedInUser?.username,
          );
          setIsFollowing(isMeInFollowers);
        }

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
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <Spinner size="lg" />
      </div>
    );

  const isOwnProfile =
    loggedInUser?.data?.user?.username === username ||
    loggedInUser?.username === username;

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Top Header */}
      <div
        className="sticky top-0 z-20 px-4 py-3 flex items-center gap-4"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full transition-colors"
          style={{ color: "var(--text-primary)" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h2 className="font-bold text-lg leading-tight" style={{ color: "var(--text-primary)" }}>
            {user?.fullName}
          </h2>
          <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
            {allTweets.length} posts
          </p>
        </div>
      </div>

      {/* Cover Image */}
      <div
        className="relative h-32 sm:h-48 w-full"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        {user?.coverImage && (
          <img src={user.coverImage} alt="cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute bottom-0 left-4 translate-y-1/2">
          <Avatar
            src={user?.profileImage}
            name={user?.fullName}
            username={user?.username}
            size={128}
            className="sm:!w-36 sm:!h-36"
          />
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-4 pt-20 pb-4">
        {/* Name with Edit/Follow Button */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {user?.fullName}
          </h1>
          <div>
            {isOwnProfile ? (
              <Link to="/edit-profile">
                <button
                  className="px-5 py-1.5 rounded-full font-bold transition-colors"
                  style={{
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Edit profile
                </button>
              </Link>
            ) : (
              <button
                onClick={handleFollowToggle}
                className="px-5 py-1.5 rounded-full font-bold transition-all"
                style={
                  isFollowing
                    ? {
                        border: "1px solid var(--border-color)",
                        color: "var(--text-primary)",
                        backgroundColor: "transparent",
                      }
                    : {
                        backgroundColor: "var(--text-primary)",
                        color: "var(--bg-primary)",
                        border: "none",
                      }
                }
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Username and Joined Date */}
        <div className="flex items-center gap-2 mb-3">
          <p style={{ color: "var(--text-secondary)" }}>@{user?.username}</p>
          {user?.createdAt && (
            <p style={{ color: "var(--text-secondary)" }}>
              • Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Bio */}
        {user?.bio && (
          <p className="text-[15px] mb-4" style={{ color: "var(--text-primary)" }}>
            {user.bio}
          </p>
        )}

        {/* Metadata */}
        {user?.website && (
          <div className="mb-4">
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] hover:underline"
              style={{ color: "var(--accent-color)" }}
            >
              🔗 {user.website}
            </a>
          </div>
        )}

        {/* Following and Followers count */}
        <div className="flex gap-5 text-[15px]">
          <div>
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>
              {user?.followingCount || 0}
            </span>{" "}
            <span style={{ color: "var(--text-secondary)" }}>Following</span>
          </div>
          <div>
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>
              {user?.followersCount || 0}
            </span>{" "}
            <span style={{ color: "var(--text-secondary)" }}>Followers</span>
          </div>
        </div>
      </div>

      {/* Tweets Section */}
      <div style={{ borderTop: "1px solid var(--border-color)" }}>
        {allTweets.length > 0 ? (
          allTweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
        ) : (
          <div className="p-10 text-center">
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>No tweets yet</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
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
