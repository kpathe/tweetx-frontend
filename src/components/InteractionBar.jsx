import React, { useState } from "react";
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
  const [optimisticLike, setOptimisticLike] = useState({
    tweetId: null,
    liked: null,
    countDelta: 0,
  });
  const [commentDeltaByTweet, setCommentDeltaByTweet] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = currentUser?.user?._id;
  const tweetId = tweet?._id;
  const baseIsLiked = tweet?.likes?.includes(userId) || !!tweet?.isLiked;
  const baseLikesCount = tweet?.likes?.length ?? tweet?.likesCount ?? 0;
  const likeState =
    optimisticLike.tweetId === tweetId
      ? optimisticLike
      : { liked: null, countDelta: 0 };
  const isLiked = likeState.liked ?? baseIsLiked;
  const likesCount = Math.max(0, baseLikesCount + likeState.countDelta);
  const internalCommentsCount =
    (tweet?.commentsCount ?? tweet?.comments?.length ?? 0) +
    (commentDeltaByTweet[tweetId] || 0);

  // If a commentsCount prop is passed in (from TweetDetailCard/TweetPage),
  // use it as the source of truth. Otherwise fall back to internal state
  // so regular feed cards still work independently.
  const commentsCount =
    commentsCountProp !== undefined ? commentsCountProp : internalCommentsCount;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wasLiked = isLiked;
    try {
      setOptimisticLike({
        tweetId,
        liked: !wasLiked,
        countDelta: wasLiked ? -1 : 1,
      });

      if (isCommentCard) {
        await interactionService.toggleCommentLike(tweetId);
      } else {
        await interactionService.toggleTweetLike(tweetId);
      }
    } catch {
      setOptimisticLike({ tweetId: null, liked: null, countDelta: 0 });
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
      setCommentDeltaByTweet((prev) => ({
        ...prev,
        [tweetId]: (prev[tweetId] || 0) + 1,
      }));
      dispatch(updateTweetCommentsCount({ tweetId, delta: +1 }));
    }
    if (onCommentAdded) {
      onCommentAdded(newComment);
    }
  };

  return (
    <>
    <div className="flex items-center gap-1 mt-1 -ml-2" style={{ maxWidth: "400px" }}>
      {/* Reply */}
      {!isCommentCard && (
        <button
          onClick={handleCommentClick}
          className="group flex items-center gap-0.5 transition-colors"
          style={{ color: "var(--text-secondary)" }}
          title="Reply"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full transition-colors group-hover:bg-blue-500/10">
            <MessageCircle size={18} className="group-hover:text-blue-500" />
          </div>
          <span className="text-[13px] group-hover:text-blue-500">
            {commentsCount > 0 ? commentsCount : ""}
          </span>
        </button>
      )}

      {/* Like */}
      <button
        onClick={handleLike}
        className="group flex items-center gap-0.5 transition-colors ml-auto"
        style={{ color: isLiked ? "#f91880" : "var(--text-secondary)" }}
        title={isLiked ? "Unlike" : "Like"}
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full transition-colors group-hover:bg-pink-500/10">
          <Heart
            size={18}
            fill={isLiked ? "currentColor" : "none"}
            className="group-hover:text-pink-500 transition-all"
          />
        </div>
        <span className="text-[13px] group-hover:text-pink-500">
          {likesCount > 0 ? likesCount : ""}
        </span>
      </button>

      {/* Share */}
      <button
        className="group flex items-center transition-colors ml-auto"
        style={{ color: "var(--text-secondary)" }}
        title="Share"
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full transition-colors group-hover:bg-blue-500/10">
          <svg className="w-[18px] h-[18px] group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
      </button>
    </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PostForm
          isComment={true}
          parentId={tweetId}
          onSuccess={handleCommentSuccess}
        />
      </Modal>
    </>
  );
}

export default InteractionBar;
