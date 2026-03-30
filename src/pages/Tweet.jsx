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
      // Sync Redux store with the real count from the server so TweetCard
      // in the feed shows the correct number, overwriting any stale backend value.
      dispatch(setTweetCommentsCount({ tweetId, count: exactCount }));
      console.log("dispatched setTweetCommentsCount", { tweetId, count: exactCount })
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

      <TweetDetailCard
        tweet={tweet}
        commentsCount={commentsCount}
        onCommentAdded={handleCommentSuccess}
      />



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