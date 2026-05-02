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
    <div
      className="px-4 py-3 transition-colors cursor-pointer group relative"
      style={{ borderBottom: "1px solid var(--border-color)" }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-secondary)"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
    >
      <div className="flex gap-3">
        <Link
          to={`/u/${author?.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 pt-0.5"
        >
          {author?.profileImage ? (
            <img
              src={author.profileImage}
              className="h-10 w-10 rounded-full object-cover"
              alt="avatar"
            />
          ) : (
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center font-bold"
              style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--accent-color)" }}
            >
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
                className="flex items-center gap-1"
              >
                <span className="font-bold hover:underline truncate" style={{ color: "var(--text-primary)" }}>
                  {author?.fullName}
                </span>
              </Link>
              <span style={{ color: "var(--text-secondary)" }}>@{author?.username}</span>
              <span style={{ color: "var(--text-secondary)" }}>·</span>
              <span className="hover:underline whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                {formatRelativeTime(tweet.createdAt)}
              </span>
            </div>

            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTweet(e);
                }}
                className="p-2 -mr-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                style={{ color: "var(--text-secondary)" }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <p
            className="mt-0.5 text-[15px] leading-normal whitespace-pre-wrap break-words cursor-pointer"
            style={{ color: "var(--text-primary)" }}
            onClick={handleContentClick}
          >
            {tweet.content}
          </p>

          {tweet?.imageURL && (
            <div
              className="mt-3 rounded-2xl overflow-hidden cursor-pointer"
              style={{ border: "1px solid var(--border-color)" }}
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
