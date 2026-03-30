import React from "react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import InteractionBar from "./InteractionBar";
import tweetService from "../services/tweet.service";
import { removeTweet } from "../store/tweetSlice";

function TweetDetailCard({ tweet, commentsCount, onCommentAdded }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData?.data);

  if (!tweet) return null;

  const author = tweet?.author;
  const isOwner = currentUser?.user?._id === author?._id;

  const handleDeleteTweet = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Delete this tweet?")) {
      try {
        const success = await tweetService.deleteTweet(tweet._id);
        if (success) {
          dispatch(removeTweet(tweet._id));
          navigate("/");
        }
      } catch (error) {
        console.error("TweetDetailCard :: Error", error);
      }
    }
  };

  return (
    <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-950">
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-4 items-start">
          <Link to={`/u/${author?.username}`}>
            <img
              src={author?.profileImage || "https://placehold.co/150"}
              className="w-14 h-14 rounded-full object-cover hover:opacity-80 transition-opacity ring-1 ring-gray-100 dark:ring-gray-800"
              alt="avatar"
            />
          </Link>
          <div className="flex-1">
            <Link to={`/u/${author?.username}`}>
              <h2 className="font-bold text-2xl dark:text-white leading-tight hover:underline">
                {author?.fullName}
              </h2>
            </Link>
            <p className="text-gray-500 text-lg">@{author?.username}</p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDeleteTweet}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all duration-200"
          >
            <Trash2 size={22} />
          </button>
        )}
      </div>

      <div className="px-4 pb-4">
        <p className="text-2xl dark:text-gray-100 leading-relaxed whitespace-pre-wrap font-normal">
          {tweet.content}
        </p>
      </div>

      {tweet.imageURL && (
        <div className="px-4 pb-4">
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <img
              src={tweet.imageURL}
              className="w-full h-auto max-h-[500px] object-cover"
              alt="tweet"
            />
          </div>
        </div>
      )}

      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 text-gray-500 text-base">
        {format(new Date(tweet.createdAt), "h:mm a · MMM d, yyyy")}
      </div>

      <div className="px-4 py-2">
        <InteractionBar
          tweet={tweet}
          commentsCount={commentsCount}
          onCommentAdded={onCommentAdded}
        />
      </div>
    </div>
  );
}

export default TweetDetailCard;