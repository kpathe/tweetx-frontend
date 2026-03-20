import React from "react";
import InteractionBar from "./InteractionBar";

function TweetDetailCard({ tweet }) {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={tweet?.owner?.avatar}
          className="h-14 w-14 rounded-full"
          alt="avatar"
        />
        <div>
          <p className="font-bold text-lg dark:text-white">
            {tweet?.owner?.name}
          </p>
          <p className="text-gray-500">@{tweet?.owner?.username}</p>
        </div>
      </div>

      <p className="text-2xl leading-relaxed dark:text-gray-100 mb-4">
        {tweet?.content}
      </p>

      <div className="py-3 border-y border-gray-100 dark:border-gray-800 text-gray-500 text-sm">
        {new Date(tweet?.createdAt).toLocaleTimeString()} ·{" "}
        {new Date(tweet?.createdAt).toLocaleDateString()}
      </div>

      <div className="py-2">
        <InteractionBar tweet={tweet} />
      </div>
    </div>
  );
}

export default TweetDetailCard;
