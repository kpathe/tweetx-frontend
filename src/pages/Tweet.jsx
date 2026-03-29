import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import tweetService from "../services/tweet.service";
import interactionService from "../services/interaction.service";
import { CommentCard, Spinner } from "../components"; // Standard non-clickable card
import TweetDetailCard from "../components/TweetDetailCard";
import PostForm from "../components/PostForm";

function TweetPage() {
  const { tweetId } = useParams();
  const navigate = useNavigate();
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tRes, cRes] = await Promise.all([
        tweetService.getTweet(tweetId),
        interactionService.getTweetComments(tweetId),
      ]);
      // Handle nested response structure
      setTweet(tRes?.data || tRes);
      setComments(cRes?.data || cRes);
    } catch (error) {
      console.error("Error fetching detail view", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentDelete = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId),
    );
  };

  const handleCommentSuccess = (newComment) => {
    // Add the new comment to the list
    if (newComment?.data) {
      setComments((prevComments) => [newComment.data, ...prevComments]);
    } else {
      // Fallback: refetch all comments
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, [tweetId]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Spinner size="lg" className="text-violet-600 dark:text-violet-400" />
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-950 border-x border-gray-200 dark:border-gray-700">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-900 dark:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tweet</h1>
      </div>

      <TweetDetailCard tweet={tweet} onCommentAdded={handleCommentSuccess} />

      <PostForm isComment parentId={tweetId} onSuccess={handleCommentSuccess} />

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onCommentDelete={handleCommentDelete}
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">No comments yet</p>
            <p className="text-sm mt-1">Be the first to share your thoughts</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TweetPage;
