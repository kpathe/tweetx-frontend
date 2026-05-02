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
    <div className="py-4 px-4 min-h-screen">
        <div className="p-3 sticky top-0 bg-white dark:bg-slate-950 backdrop-blur-md z-10">
          <SearchInput
            value={query}
            onChange={setQuery}
            onClear={() => setQuery("")}
          />
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <Link
                to={`/u/${user.username}`}
                key={user._id}
                className="flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              >
                <img
                  src={user.profileImage || "https://via.placeholder.com/150"}
                  className="h-14 w-14 rounded-full object-cover shadow-sm"
                  alt={user.username}
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">
                    @{user.username}
                  </p>
                </div>
              </Link>
            ))
          ) : query && !loading ? (
            <div className="text-center p-10 text-gray-500">
              No users found for "{query}"
            </div>
          ) : (
            <div className="text-center p-10 text-gray-400 italic">
              Type to search for users...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
