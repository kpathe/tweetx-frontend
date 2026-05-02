import React from "react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import InteractionBar from "./InteractionBar";
import tweetService from "../services/tweet.service";
import { removeTweet } from "../store/tweetSlice";
import Avatar from "./Avatar";

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
    <div style={{ borderBottom: "1px solid var(--border-color)" }}>
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3 items-start">
          <Link to={`/u/${author?.username}`}>
            <Avatar
              src={author?.profileImage}
              name={author?.fullName}
              username={author?.username}
              size={48}
            />
          </Link>
          <div>
            <Link to={`/u/${author?.username}`}>
              <h2
                className="font-bold text-lg leading-tight hover:underline"
                style={{ color: "var(--text-primary)" }}
              >
                {author?.fullName}
              </h2>
            </Link>
            <p style={{ color: "var(--text-secondary)" }}>@{author?.username}</p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDeleteTweet}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="px-4 pb-4">
        <p
          className="text-xl leading-relaxed whitespace-pre-wrap"
          style={{ color: "var(--text-primary)" }}
        >
          {tweet.content}
        </p>
      </div>

      {tweet.imageURL && (
        <div className="px-4 pb-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <img
              src={tweet.imageURL}
              className="w-full h-auto max-h-[500px] object-cover"
              alt="tweet"
            />
          </div>
        </div>
      )}

      <div
        className="px-4 py-4 text-[15px]"
        style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border-color)" }}
      >
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