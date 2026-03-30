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
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-70/50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer group">
      <div className="flex gap-3">
        <Link
          to={`/u/${author?.username}`}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={author?.profileImage || "https://placehold.co/150"}
            className="h-12 w-12 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
            alt="avatar"
          />
        </Link>

        <div className="flex-1">
          <div className="flex justify-between items-start gap-2">
            <div className="flex gap-2 items-center min-w-0">
              <Link
                to={`/u/${author?.username}`}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="font-bold dark:text-white hover:underline truncate">
                  {author?.fullName}
                </span>
              </Link>
              <Link
                to={`/u/${author?.username}`}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-gray-500 dark:text-gray-400 hover:underline text-sm truncate">
                  @{author?.username || "username"}
                </span>
              </Link>
              <span className="text-gray-400 dark:text-gray-600">·</span>
              <span className="text-gray-500 dark:text-gray-400 hover:underline text-sm whitespace-nowrap">
                {formatRelativeTime(tweet.createdAt)}
              </span>
            </div>

            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTweet(e);
                }}
                className="p-2 flex items-center justify-center rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <p
            className="mt-2 text-base text-gray-900 dark:text-gray-100 leading-normal cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleContentClick}
          >
            {tweet.content}
          </p>

          {tweet?.imageURL && (
            <div
              className="mt-3 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleContentClick}
            >
              <img
                src={tweet.imageURL}
                alt="tweet"
                className="w-full h-auto object-cover max-h-96"
              />
            </div>
          )}

          <div className="mt-3">
            {/* Pass commentsCount directly so InteractionBar always reflects
                the latest Redux value rather than its stale internal state */}
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
