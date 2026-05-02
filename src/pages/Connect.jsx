import React, { useEffect, useState } from "react";
import userService from "../services/user.service";
import { UserPlus, UserCheck } from "lucide-react";
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
    <div className="w-full min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <div className="p-4 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-primary)] opacity-95 backdrop-blur-md z-10">
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">
          Connect
        </h1>
        <p className="text-[13px] text-[var(--text-secondary)] font-medium">Suggested for you</p>
      </div>

      <div className="flex-1 divide-y divide-[var(--border-color)]">
        {loading ? (
          <div className="p-10 space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-full"></div>
                  <div className="space-y-3">
                    <div className="w-40 h-4 bg-[var(--bg-secondary)] rounded"></div>
                    <div className="w-24 h-3 bg-[var(--bg-secondary)] rounded"></div>
                  </div>
                </div>
                <div className="w-24 h-10 bg-[var(--bg-secondary)] rounded-full"></div>
              </div>
            ))}
          </div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="p-4 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-all group"
            >
              <Link to={`/u/${user.username}`} className="flex gap-3 items-center flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      className="w-10 h-10 rounded-full object-cover"
                      alt={user.username}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--accent-color)] font-bold">
                       {user.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-[var(--text-primary)] hover:underline truncate text-[15px]">
                      {user.fullName}
                    </p>
                    {user.followers?.length > 10 && (
                       <svg className="w-[18px] h-[18px] text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" />
                       </svg>
                    )}
                  </div>
                  <p className="text-[var(--text-secondary)] text-[15px]">@{user.username}</p>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFollowToggle(user._id);
                }}
                className={`ml-4 px-5 py-1.5 rounded-full font-bold text-[15px] transition-all whitespace-nowrap ${
                  followingStates[user._id]
                    ? "border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/20"
                    : "bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90"
                }`}
              >
                {followingStates[user._id] ? "Following" : "Follow"}
              </button>
            </div>
          ))
        ) : (
          <div className="p-20 text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-6">
               <UserPlus className="text-[var(--accent-color)] w-10 h-10 opacity-50" />
            </div>
            <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2">Finding people...</h3>
            <p className="text-[var(--text-secondary)]">We couldn't find any suggestions right now.</p>
            <Link to="/search" className="mt-8 inline-block bg-[var(--accent-color)] text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition-all">
              Go to Search
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Connect;