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
    <div className="flex justify-between items-center w-full mt-1 -ml-2 max-w-[425px]">
      {!isCommentCard && (
        <button
          onClick={handleCommentClick}
          className="group flex items-center text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
          title="Reply"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-[var(--accent-color)]/10 transition-all">
            <MessageCircle size={18} />
          </div>
          <span className="text-[13px] ml-1">
            {commentsCount > 0 ? commentsCount : ""}
          </span>
        </button>
      )}

      {/* Repost */}
      <button className="group flex items-center text-[var(--text-secondary)] hover:text-green-500 transition-colors cursor-pointer">
        <div className="w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-green-500/10 transition-all">
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </div>
        <span className="text-[13px] ml-1">2</span>
      </button>

      {/* Like */}
      <button
        onClick={handleLike}
        className={`group flex items-center transition-colors ${
          isLiked
            ? "text-rose-600"
            : "text-[var(--text-secondary)] hover:text-rose-600"
        }`}
        title={isLiked ? "Unlike" : "Like"}
      >
        <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-all group-hover:bg-rose-600/10`}>
          <Heart
            size={18}
            className={`${isLiked ? "fill-current" : "fill-none"} transition-all duration-200 group-active:scale-125`}
          />
        </div>
        <span className="text-[13px] ml-1">
          {likesCount > 0 ? likesCount : ""}
        </span>
      </button>

      {/* View/Analytics icon */}
      <button className="group flex items-center text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors cursor-pointer">
        <div className="w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-[var(--accent-color)]/10 transition-all">
           <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
        <span className="text-[13px] ml-1">10.5K</span>
      </button>

      {/* Share icon */}
      <button className="group flex items-center text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors cursor-pointer">
        <div className="w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-[var(--accent-color)]/10 transition-all">
           <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
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