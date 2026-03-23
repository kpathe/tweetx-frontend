import React from "react";
import InteractionBar from "./InteractionBar";

function TweetDetailCard({ tweet }) {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={tweet?.data?.owner?.avatar || "https://placehold.co/400"}
          className="h-14 w-14 rounded-full"
          alt="avatar"
        />
        <div>
          <p className="font-bold text-lg dark:text-white">
            {tweet?.data?.author?.name}
          </p>
          <p className="text-gray-500">@{tweet?.data?.author?.username}</p>
        </div>
      </div>

      <p className="text-2xl leading-relaxed dark:text-gray-100 mb-4">
        {tweet?.data?.content}
      </p>

      {tweet?.data?.image && (
        <div className="mt-3 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <img
            src={tweet?.data?.image}
            alt="tweet"
            className="w-full h-auto object-cover max-h-128"
          />
        </div>
      )}

      <div className="py-3 border-y border-gray-100 dark:border-gray-800 text-gray-500 text-sm">
        {new Date(tweet?.data?.createdAt).toLocaleTimeString()} ·{" "}
        {new Date(tweet?.data?.createdAt).toLocaleDateString()}
      </div>

      <div className="py-2">
        <InteractionBar tweet={tweet?.data} />
      </div>
    </div>
  );
}

export default TweetDetailCard;
