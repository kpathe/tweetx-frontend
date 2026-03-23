import React, { useEffect, useState } from "react";
import userService from "../services/user.service";
import { UserPlus } from "lucide-react";

function Connect() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual service to fetch recommended users
    const fetchUsers = async () => {
      try {
        const response = await userService.getRecommendedUsers();
        if (response) setUsers(response.data);
      } catch (err) {
        console.error("Connect :: Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold">Connect</h1>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {loading ? (
          <div className="p-10 text-center animate-pulse">Loading suggestions...</div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer">
              <div className="flex gap-3">
                <img 
                  src={user.profileImage || "https://via.placeholder.com/150"} 
                  className="w-12 h-12 rounded-full object-cover"
                  alt={user.username}
                />
                <div>
                  <p className="font-bold hover:underline">{user.fullName}</p>
                  <p className="text-gray-500 text-sm">@{user.username}</p>
                </div>
              </div>
              <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full font-bold text-sm hover:opacity-80">
                Follow
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Connect;