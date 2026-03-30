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
      <div className="flex justify-between items-center max-w-md mt-1 text-gray-500 dark:text-gray-400">
        {!isCommentCard && (
          <button
            onClick={handleCommentClick}
            className="group flex items-center gap-1 hover:text-violet-500 dark:hover:text-violet-400 outline-none transition-colors"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-full group-hover:bg-violet-500/10 dark:group-hover:bg-violet-400/20 transition-all duration-200">
              <MessageCircle size={18} />
            </div>
            <span className="text-xs font-medium pr-2">{commentsCount}</span>
          </button>
        )}

        <button
          onClick={handleLike}
          className={`group flex items-center gap-1 outline-none transition-colors ${
            isLiked
              ? "text-rose-600 dark:text-rose-500"
              : "hover:text-rose-600 dark:hover:text-rose-500"
          }`}
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-full group-hover:bg-rose-500/10 dark:group-hover:bg-rose-500/20 transition-all duration-200">
            <Heart
              size={18}
              className={`${isLiked ? "fill-current" : "fill-none"} transition-transform duration-150 group-active:scale-125`}
            />
          </div>
          <span className="text-xs font-medium pr-2">{likesCount}</span>
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