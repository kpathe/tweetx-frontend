import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeTweet } from "../store/tweetSlice";
import tweetService from "../services/tweet.service";

function TweetCard({ tweet }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.userData);

  // Check if the logged-in user owns this tweet
  const isOwner = currentUser?._id === tweet?.owner?._id;

  const deleteTweet = async () => {
    const confirmed = window.confirm("Delete this tweet?");
    if (confirmed) {
      const success = await tweetService.deleteTweet(tweet._id);
      if (success) {
        dispatch(removeTweet(tweet._id));
      }
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
      <div className="flex gap-3">
        <img
          src={tweet?.owner?.profileImage || "https://via.placeholder.com/150"}
          className="h-12 w-12 rounded-full object-cover"
          alt="avatar"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <span className="font-bold dark:text-white">
                {tweet?.owner?.fullName}
              </span>
              <span className="text-gray-500">@{tweet?.owner?.username || "username"}</span>
            </div>
            {isOwner && (
              <button
                onClick={deleteTweet}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full"
              >
                Delete
              </button>
            )}
          </div>
          <p className="mt-2 text-gray-800 dark:text-gray-200 leading-normal">
            {tweet.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TweetCard;
