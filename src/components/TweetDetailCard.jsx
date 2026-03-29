import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import InteractionBar from "./InteractionBar";

function TweetDetailCard({ tweet, onCommentAdded }) {
  if (!tweet) return null;

  return (
    <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900">
      {/* Author Section */}
      <div className="p-4">
        <div className="flex gap-4 items-start">
          <Link to={`/u/${tweet.author?.username}`} onClick={(e) => e.stopPropagation()}>
            <img 
              src={tweet.author?.profileImage || "https://placehold.co/150"} 
              className="w-16 h-16 rounded-full object-cover hover:opacity-80 transition-opacity" 
              alt="avatar" 
            />
          </Link>
          <div className="flex-1">
            <Link to={`/u/${tweet.author?.username}`} onClick={(e) => e.stopPropagation()}>
              <h2 className="font-bold text-2xl dark:text-white leading-tight hover:underline">
                {tweet.author?.fullName}
              </h2>
            </Link>
            <Link to={`/u/${tweet.author?.username}`} onClick={(e) => e.stopPropagation()}>
              <p className="text-gray-500 text-lg hover:underline">@{tweet.author?.username}</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Tweet Content - Full Detail */}
      <div className="px-4 pb-4">
        <p className="text-2xl dark:text-gray-100 leading-relaxed whitespace-pre-wrap font-normal">
          {tweet.content}
        </p>
      </div>

      {/* Tweet Image */}
      {tweet.imageURL && (
        <div className="px-4 pb-4">
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <img src={tweet.imageURL} className="w-full h-auto max-h-96 object-cover" alt="tweet detail" />
          </div>
        </div>
      )}

      {/* Timestamp - Full Detail */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 text-gray-500 text-base">
        {format(new Date(tweet.createdAt), "h:mm a · MMM d, yyyy")}
      </div>

      {/* Interactions */}
      <div className="px-4 py-4 text-gray-500">
        <InteractionBar tweet={tweet} onCommentAdded={onCommentAdded} />
      </div>
    </div>
  );
}

export default TweetDetailCard;