import React, { useState, useEffect } from "react";
import userService from "../services/user.service";
import { SearchInput, MainLayout } from "../components";
import { Link } from "react-router-dom";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Simple Debouncing: Wait for user to stop typing
    const delayDebounceFn = setTimeout(async () => {
      if (query) {
        const users = await userService.searchUsers(query);
        setResults(users);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <MainLayout>
      <div className="py-4 px-4">
        <div className="p-3 sticky top-0 bg-white dark:bg-slate-950 backdrop-blur-md z-10">
          <SearchInput
            value={query}
            onChange={setQuery}
            onClear={() => setQuery("")}
          />
        </div>

        <div className="mt-6 space-y-4">
          {results.map((user) => (
            <Link
              to={`/profile/${user.username}`}
              key={user._id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <img src={user.avatar} className="h-12 w-12 rounded-full" />
              <div>
                <p className="font-bold dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default Search;
