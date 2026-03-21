import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeTweet } from "../store/tweetSlice";
import tweetService from "../services/tweet.service";
import InteractionBar from "./InteractionBar";

function TweetCard({ tweet }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.userData.data);

  const author = tweet?.author;
  console.log(author);

  const isOwner = currentUser?.user?._id === author?._id;
  console.log(isOwner);

  const deleteTweet = async () => {
    if (isOwner) {
      const confirmed = window.confirm("Delete this tweet?");
      if (confirmed) {
        const success = await tweetService.deleteTweet(tweet._id);
        if (success) {
          dispatch(removeTweet(tweet._id));
        }
      }
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
      <div className="flex gap-3">
        <img
          src={author?.profileImage || "https://placehold.co/150"}
          className="h-12 w-12 rounded-full object-cover"
          alt="avatar"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <span className="font-bold dark:text-white">
                {author?.fullName}
              </span>
              <span className="text-gray-500">
                @{author?.username || "username"}
              </span>
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
          {/* Option 1: Standard Logical AND */}
          {tweet?.imageURL && (
            <div className="mt-3 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <img
                src={tweet.imageURL}
                alt="tweet"
                className="w-full h-auto object-cover max-h-128"
              />
            </div>
          )}
          <InteractionBar tweet={tweet} />
        </div>
      </div>
    </div>
  );
}

export default TweetCard;
