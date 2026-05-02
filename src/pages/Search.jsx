import React, { useState, useEffect } from "react";
import userService from "../services/user.service";
import { SearchInput } from "../components";
import Avatar from "../components/Avatar";
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
      <div
        className="p-4 sticky top-0 z-10"
        style={{
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-primary)",
        }}
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
        />
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="p-8 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }} />
                <div className="space-y-2 flex-1">
                  <div className="w-36 h-4 rounded" style={{ backgroundColor: "var(--bg-secondary)" }} />
                  <div className="w-24 h-3 rounded" style={{ backgroundColor: "var(--bg-secondary)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          results.map((user) => (
            <Link
              to={`/u/${user.username}`}
              key={user._id}
              className="flex items-center gap-3 px-4 py-3 transition-colors"
              style={{ borderBottom: "1px solid var(--border-color)" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-secondary)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <Avatar
                src={user.profileImage}
                name={user.fullName}
                username={user.username}
                size={40}
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] truncate" style={{ color: "var(--text-primary)" }}>
                  {user.fullName}
                </p>
                <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>
                  @{user.username}
                </p>
              </div>
            </Link>
          ))
        ) : query && !loading ? (
          <div className="p-16 text-center max-w-xs mx-auto">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              No results for "{query}"
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Try searching for something else.
            </p>
          </div>
        ) : (
          <div className="p-16 text-center max-w-xs mx-auto">
            <div className="text-4xl mb-4 opacity-50">✨</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Discover people
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Search for names or usernames to find and follow others.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
