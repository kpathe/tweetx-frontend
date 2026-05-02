import { useSelector, useDispatch } from "react-redux";
import { removeTweet } from "../store/tweetSlice";
import tweetService from "../services/tweet.service";
import InteractionBar from "./InteractionBar";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "../utils/formatTime";
import { Trash2 } from "lucide-react";

function TweetCard({ tweet }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.userData.data);

  const author = tweet?.author;
  const isOwner = currentUser?.user?._id === author?._id;

  const deleteTweet = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleContentClick = () => {
    window.location.href = `/tweet/${tweet?._id}`;

    console.log("TweetCard render", tweet._id, tweet.commentsCount);
  };

  return (
    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-slate-900/30 transition-all cursor-pointer group relative">
      <div className="flex gap-4">
        <Link
          to={`/u/${author?.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0"
        >
          <img
            src={author?.profileImage || "https://via.placeholder.com/150"}
            className="h-12 w-12 rounded-full object-cover border border-gray-100 dark:border-gray-800 hover:opacity-90 transition-opacity"
            alt="avatar"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap items-center gap-x-1.5 min-w-0">
              <Link
                to={`/u/${author?.username}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 group/author"
              >
                <span className="font-bold text-gray-900 dark:text-white group-hover/author:underline truncate">
                  {author?.fullName}
                </span>
                {author?.followers?.length > 10 && (
                   <svg className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" />
                   </svg>
                )}
              </Link>
              <Link
                to={`/u/${author?.username}`}
                onClick={(e) => e.stopPropagation()}
                className="text-gray-500 dark:text-gray-400 truncate"
              >
                @{author?.username || "username"}
              </Link>
              <span className="text-gray-400 dark:text-gray-600">·</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap hover:underline">
                {formatRelativeTime(tweet.createdAt)}
              </span>
            </div>

            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTweet(e);
                }}
                className="p-2 -mr-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <p
            className="mt-1 text-[15px] text-gray-800 dark:text-gray-200 leading-normal whitespace-pre-wrap break-words cursor-pointer"
            onClick={handleContentClick}
          >
            {tweet.content}
          </p>

          {tweet?.imageURL && (
            <div
              className="mt-3 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer hover:opacity-95 transition-opacity shadow-sm"
              onClick={handleContentClick}
            >
              <img
                src={tweet.imageURL}
                alt="tweet"
                className="w-full h-auto object-cover max-h-[512px]"
              />
            </div>
          )}

          <div className="mt-4">
            <InteractionBar
              tweet={tweet}
              commentsCount={tweet.commentsCount ?? 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetCard;
