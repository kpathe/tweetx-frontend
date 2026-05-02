import React, { useState, useEffect } from "react";
import { MessageCircle, Heart } from "lucide-react";
import interactionService from "../services/interaction.service";
import { useSelector, useDispatch } from "react-redux";
import { updateTweetCommentsCount } from "../store/tweetSlice";
import Modal from "./Modal";
import PostForm from "./PostForm";

function InteractionBar({
  tweet,
  isCommentCard = false,
  onCommentAdded,
  commentsCount: commentsCountProp,
}) {
  const currentUser = useSelector((state) => state.auth.userData?.data);
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [internalCommentsCount, setInternalCommentsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If a commentsCount prop is passed in (from TweetDetailCard/TweetPage),
  // use it as the source of truth. Otherwise fall back to internal state
  // so regular feed cards still work independently.
  const commentsCount =
    commentsCountProp !== undefined ? commentsCountProp : internalCommentsCount;

  useEffect(() => {
    const userId = currentUser?.user?._id;
    const actualCount = tweet?.commentsCount ?? tweet?.comments?.length ?? 0;

    setIsLiked(tweet?.likes?.includes(userId) || !!tweet?.isLiked);
    setLikesCount(tweet?.likes?.length || tweet?.likesCount || 0);
    setInternalCommentsCount(actualCount);
  }, [tweet, currentUser]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wasLiked = isLiked;
    try {
      setIsLiked(!wasLiked);
      setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

      if (isCommentCard) {
        await interactionService.toggleCommentLike(tweet._id);
      } else {
        await interactionService.toggleTweetLike(tweet._id);
      }
    } catch (error) {
      setIsLiked(wasLiked);
      setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCommentSuccess = (newComment) => {
    setIsModalOpen(false);
    if (commentsCountProp === undefined) {
      // Feed card context — update both local state and Redux store
      setInternalCommentsCount((prev) => prev + 1);
      dispatch(updateTweetCommentsCount({ tweetId: tweet._id, delta: +1 }));
    }
    if (onCommentAdded) {
      onCommentAdded(newComment);
    }
  };

  return (
    <>
    <div className="flex justify-between items-center max-w-sm mt-1 -ml-2">
      {!isCommentCard && (
        <button
          onClick={handleCommentClick}
          className="group flex items-center text-gray-500 dark:text-gray-500 hover:text-blue-500 transition-colors"
          title="Reply"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-full group-hover:bg-blue-500/10 transition-all">
            <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-xs font-medium ml-1 group-hover:underline">
            {commentsCount > 0 ? commentsCount : ""}
          </span>
        </button>
      )}

      {/* Placeholder for Retweet - added for visual completeness */}
      <button className="group flex items-center text-gray-500 dark:text-gray-500 hover:text-green-500 transition-colors cursor-default opacity-50">
        <div className="w-9 h-9 flex items-center justify-center rounded-full group-hover:bg-green-500/10 transition-all">
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </div>
      </button>

      <button
        onClick={handleLike}
        className={`group flex items-center transition-colors ${
          isLiked
            ? "text-rose-600"
            : "text-gray-500 dark:text-gray-500 hover:text-rose-600"
        }`}
        title={isLiked ? "Unlike" : "Like"}
      >
        <div className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isLiked ? "group-hover:bg-rose-600/10" : "group-hover:bg-rose-600/10"}`}>
          <Heart
            size={18}
            className={`${isLiked ? "fill-current" : "fill-none"} transition-all duration-200 group-hover:scale-110 group-active:scale-125`}
          />
        </div>
        <span className={`text-xs font-medium ml-1 ${isLiked ? "underline" : "group-hover:underline"}`}>
          {likesCount > 0 ? likesCount : ""}
        </span>
      </button>

      {/* Placeholder for Share/Bookmark */}
      <button className="group flex items-center text-gray-500 dark:text-gray-500 hover:text-violet-500 transition-colors cursor-default opacity-50">
        <div className="w-9 h-9 flex items-center justify-center rounded-full group-hover:bg-violet-500/10 transition-all">
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        </div>
      </button>
    </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PostForm
          isComment={true}
          parentId={tweet._id}
          onSuccess={handleCommentSuccess}
        />
      </Modal>
    </>
  );
}

export default InteractionBar;