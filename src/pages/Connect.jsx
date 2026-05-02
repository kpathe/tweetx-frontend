import React, { useEffect, useState } from "react";
import userService from "../services/user.service";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

function Connect() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getRecommendedUsers();
        if (response.success) {
          setUsers(response.data);
          const states = {};
          response.data.forEach((user) => {
            states[user._id] = false;
          });
          setFollowingStates(states);
        }
      } catch (err) {
        console.error("Connect :: Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleFollowToggle = async (userId) => {
    try {
      const isFollowing = followingStates[userId];
      if (isFollowing) {
        await userService.unfollow(userId);
      } else {
        await userService.follow(userId);
      }
      setFollowingStates((prev) => ({
        ...prev,
        [userId]: !prev[userId],
      }));
    } catch (error) {
      console.error("Connect :: Follow toggle error", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div
        className="px-4 py-3 sticky top-0 z-10"
        style={{
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-primary)",
        }}
      >
        <h1 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>
          Connect
        </h1>
        <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          Suggested for you
        </p>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="p-8 space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }} />
                  <div className="space-y-2">
                    <div className="w-32 h-4 rounded" style={{ backgroundColor: "var(--bg-secondary)" }} />
                    <div className="w-20 h-3 rounded" style={{ backgroundColor: "var(--bg-secondary)" }} />
                  </div>
                </div>
                <div className="w-20 h-9 rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }} />
              </div>
            ))}
          </div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="px-4 py-3 flex items-center justify-between transition-colors"
              style={{ borderBottom: "1px solid var(--border-color)" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-secondary)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <Link to={`/u/${user.username}`} className="flex gap-3 items-center flex-1 min-w-0">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    alt={user.username}
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                    style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--accent-color)" }}
                  >
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-[15px] truncate" style={{ color: "var(--text-primary)" }}>
                    {user.fullName}
                  </p>
                  <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>
                    @{user.username}
                  </p>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFollowToggle(user._id);
                }}
                className="ml-4 px-5 py-1.5 rounded-full font-bold text-[15px] transition-all whitespace-nowrap"
                style={
                  followingStates[user._id]
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
                {followingStates[user._id] ? "Following" : "Follow"}
              </button>
            </div>
          ))
        ) : (
          <div className="p-16 text-center max-w-sm mx-auto">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <UserPlus className="w-8 h-8" style={{ color: "var(--accent-color)", opacity: 0.5 }} />
            </div>
            <h3 className="text-2xl font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>
              Finding people...
            </h3>
            <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>
              We couldn't find any suggestions right now.
            </p>
            <Link
              to="/search"
              className="mt-6 inline-block px-6 py-2.5 rounded-full font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              Go to Search
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Connect;