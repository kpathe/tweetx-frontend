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
    <div className="w-full min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          Connect
        </h1>
        <p className="text-sm text-gray-500 font-medium">People you might know</p>
      </div>

      <div className="flex-1 divide-y divide-gray-100 dark:divide-gray-800">
        {loading ? (
          <div className="p-10 space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-gray-100 dark:bg-slate-800 rounded-full"></div>
                  <div className="space-y-3">
                    <div className="w-40 h-4 bg-gray-100 dark:bg-slate-800 rounded"></div>
                    <div className="w-24 h-3 bg-gray-100 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
                <div className="w-24 h-10 bg-gray-100 dark:bg-slate-800 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-all group"
            >
              <Link to={`/u/${user.username}`} className="flex gap-4 items-center flex-1 min-w-0">
                <div className="relative">
                  <img
                    src={user.profileImage || "https://via.placeholder.com/150"}
                    className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-violet-500 transition-all shadow-sm"
                    alt={user.username}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-gray-900 dark:text-white group-hover:underline truncate text-lg">
                      {user.fullName}
                    </p>
                    {user.followers?.length > 10 && (
                       <svg className="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" />
                       </svg>
                    )}
                  </div>
                  <p className="text-gray-500 font-medium">@{user.username}</p>
                  {user.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1 italic">
                      {user.bio}
                    </p>
                  )}
                </div>
              </Link>
              <button
                onClick={() => handleFollowToggle(user._id)}
                className={`ml-4 px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
                  followingStates[user._id]
                    ? "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 hover:border-red-200"
                    : "bg-violet-600 text-white hover:bg-violet-700 hover:shadow-violet-500/20 hover:shadow-lg"
                }`}
              >
                {followingStates[user._id] ? (
                  <>
                    <UserCheck size={18} />
                    Following
                  </>
                ) : (
                  "Follow"
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="p-20 text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-violet-50 dark:bg-violet-900/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <UserPlus className="text-violet-600 w-10 h-10 opacity-50" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Finding connections...</h3>
            <p className="text-gray-500">We couldn't find any new people to suggest right now. Try searching for your friends!</p>
            <Link to="/search" className="mt-8 inline-block bg-violet-600 text-white font-bold px-8 py-3 rounded-full hover:bg-violet-700 transition-all">
              Go to Search
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Connect;