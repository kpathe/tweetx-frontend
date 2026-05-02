import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateTweetCommentsCount, setTweetCommentsCount } from "../store/tweetSlice";
import { ArrowLeft } from "lucide-react";
import tweetService from "../services/tweet.service";
import interactionService from "../services/interaction.service";
import { CommentCard, Spinner } from "../components";
import TweetDetailCard from "../components/TweetDetailCard";
import PostForm from "../components/PostForm";

function TweetPage() {
  const { tweetId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tRes, cRes] = await Promise.all([
        tweetService.getTweet(tweetId),
        interactionService.getTweetComments(tweetId),
      ]);
      const tweetData = tRes?.data || tRes;
      const commentsData = cRes?.data || cRes;

      setTweet(tweetData);
      setComments(commentsData);
      const exactCount = commentsData?.length ?? 0;
      setCommentsCount(exactCount);
      dispatch(setTweetCommentsCount({ tweetId, count: exactCount }));
    } catch (error) {
      console.error("Error fetching detail view", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentDelete = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    setCommentsCount((prev) => Math.max(0, prev - 1));
    dispatch(updateTweetCommentsCount({ tweetId, delta: -1 }));
  };

  const handleCommentSuccess = (newComment) => {
    if (newComment?.data) {
      setComments((prev) => [newComment.data, ...prev]);
    } else {
      fetchData();
      return;
    }
    setCommentsCount((prev) => prev + 1);
    dispatch(updateTweetCommentsCount({ tweetId, delta: +1 }));
  };

  useEffect(() => {
    fetchData();
  }, [tweetId]);

  if (loading)
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div
        className="sticky top-0 z-10 p-4 flex items-center gap-4"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full transition-colors"
          style={{ color: "var(--text-primary)" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Post
        </h1>
      </div>

      <TweetDetailCard
        tweet={tweet}
        commentsCount={commentsCount}
        onCommentAdded={handleCommentSuccess}
      />

      <div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onCommentDelete={handleCommentDelete}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>No comments yet</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Be the first to share your thoughts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TweetPage;