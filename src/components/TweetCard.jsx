import { useSelector, useDispatch } from "react-redux";
import { removeTweet } from "../store/tweetSlice";
import tweetService from "../services/tweet.service";
import InteractionBar from "./InteractionBar";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "../utils/formatTime";

function TweetCard({ tweet }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.userData.data);

  const author = tweet?.author;
  console.log(author);

  const isOwner = currentUser?.user?._id === author?._id;
  // console.log(isOwner);
  console.log(tweet);

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

  return (
    <Link to={`/tweet/${tweet?._id}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
        <div className="flex gap-3">
          <Link to={`/u/${author?.username}`}>
            <img
              src={author?.profileImage || "https://placehold.co/150"}
              className="h-12 w-12 rounded-full object-cover"
              alt="avatar"
            />
          </Link>

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Link to={`/u/${author?.username}`}>
                  <span className="font-bold dark:text-white">
                    {author?.fullName}
                  </span>
                </Link>
                <Link to={`/u/${author?.username}`}>
                  <span className="text-gray-500">
                    @{author?.username || "username"}
                  </span>
                </Link>
              </div>
              
              {isOwner && (
                <button
                  onClick={(e) => deleteTweet(e)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                >
                  Delete
                </button>
              )}

              <span className="text-gray-500">·</span>
              <span className="text-gray-500 hover:underline text-sm">
                {formatRelativeTime(tweet.createdAt)}
              </span>
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
    </Link>
  );
}

export default TweetCard;
