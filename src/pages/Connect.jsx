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
          // Initialize following states if needed (though usually we suggest non-followed users)
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
    <div className="w-full min-h-screen">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <UserPlus className="text-violet-600" size={24} />
            Connect
          </h1>
          <p className="text-sm text-gray-500 mt-1">Suggested for you</p>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {loading ? (
            <div className="p-10 space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between animate-pulse">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-gray-200 dark:bg-slate-800 rounded"></div>
                      <div className="w-20 h-3 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>
                  <div className="w-20 h-8 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-all group"
              >
                <Link to={`/u/${user.username}`} className="flex gap-3 items-center">
                  <img
                    src={user.profileImage || "https://via.placeholder.com/150"}
                    className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
                    alt={user.username}
                  />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white group-hover:underline">
                      {user.fullName}
                    </p>
                    <p className="text-gray-500 text-sm font-medium">@{user.username}</p>
                    {user.bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => handleFollowToggle(user._id)}
                  className={`px-5 py-1.5 rounded-full font-bold text-sm transition-all flex items-center gap-1.5 ${
                    followingStates[user._id]
                      ? "bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                      : "bg-violet-600 text-white hover:bg-violet-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {followingStates[user._id] ? (
                    <>
                      <UserCheck size={16} />
                      Following
                    </>
                  ) : (
                    "Follow"
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-gray-500">
              <p className="text-lg font-medium">No suggestions right now</p>
              <p className="text-sm">Check back later for new connections!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Connect;