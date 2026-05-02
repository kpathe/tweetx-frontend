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
    <div className="px-4 py-3 border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/50 transition-all cursor-pointer group relative bg-[var(--bg-primary)]">
      <div className="flex gap-3">
        <Link
          to={`/u/${author?.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 pt-1"
        >
          {author?.profileImage ? (
            <img
              src={author.profileImage}
              className="h-10 w-10 rounded-full object-cover hover:opacity-90 transition-opacity"
              alt="avatar"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--accent-color)] font-bold">
              {author?.username?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap items-center gap-x-1 min-w-0 text-[15px]">
              <Link
                to={`/u/${author?.username}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 group/author"
              >
                <span className="font-bold text-[var(--text-primary)] group-hover:underline truncate">
                  {author?.fullName}
                </span>
                {author?.followers?.length > 10 && (
                   <svg className="w-[18px] h-[18px] text-[var(--accent-color)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" />
                   </svg>
                )}
              </Link>
              <span className="text-[var(--text-secondary)] truncate">
                @{author?.username}
              </span>
              <span className="text-[var(--text-secondary)]">·</span>
              <span className="text-[var(--text-secondary)] hover:underline whitespace-nowrap">
                {formatRelativeTime(tweet.createdAt)}
              </span>
            </div>

            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTweet(e);
                }}
                className="p-2 -mr-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <p
            className="mt-0.5 text-[15px] text-[var(--text-primary)] leading-normal whitespace-pre-wrap break-words cursor-pointer"
            onClick={handleContentClick}
          >
            {tweet.content}
          </p>

          {tweet?.imageURL && (
            <div
              className="mt-3 rounded-2xl border border-[var(--border-color)] overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
              onClick={handleContentClick}
            >
              <img
                src={tweet.imageURL}
                alt="tweet"
                className="w-full h-auto object-cover max-h-[512px]"
              />
            </div>
          )}

          <div className="mt-1">
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
