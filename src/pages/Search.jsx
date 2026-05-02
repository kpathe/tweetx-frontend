import React, { useState, useEffect } from "react";
import userService from "../services/user.service";
import { SearchInput } from "../components";
import { Link } from "react-router-dom";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await userService.searchUsers(query);
        if (response.success) {
          setResults(response.data);
        }
      } catch (error) {
        console.error("Search :: Error", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
        />
      </div>

      <div className="flex-1 divide-y divide-gray-100 dark:divide-gray-800">
        {loading ? (
          <div className="p-10 space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-14 h-14 bg-gray-100 dark:bg-slate-800 rounded-full"></div>
                <div className="space-y-3 flex-1">
                  <div className="w-40 h-4 bg-gray-100 dark:bg-slate-800 rounded"></div>
                  <div className="w-24 h-3 bg-gray-100 dark:bg-slate-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          results.map((user) => (
            <Link
              to={`/u/${user.username}`}
              key={user._id}
              className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-all group"
            >
              <div className="relative">
                <img
                  src={user.profileImage || "https://via.placeholder.com/150"}
                  className="h-14 w-14 rounded-full object-cover border-2 border-transparent group-hover:border-violet-500 transition-all shadow-sm"
                  alt={user.username}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white group-hover:underline text-lg">
                  {user.fullName}
                </p>
                <p className="text-gray-500 font-medium">
                  @{user.username}
                </p>
                {user.bio && (
                   <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1 italic">
                     {user.bio}
                   </p>
                )}
              </div>
            </Link>
          ))
        ) : query && !loading ? (
          <div className="p-20 text-center max-w-xs mx-auto">
             <div className="text-4xl mb-4">🔍</div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No results for "{query}"</h3>
             <p className="text-gray-500 text-sm">Try searching for something else or check your spelling.</p>
          </div>
        ) : (
          <div className="p-20 text-center max-w-xs mx-auto">
             <div className="text-4xl mb-4 opacity-50">✨</div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Discover people</h3>
             <p className="text-gray-500 text-sm">Search for names or usernames to find and follow others.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
