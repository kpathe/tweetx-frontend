import React, { useState, useEffect } from "react";
import { MessageCircle, Heart } from "lucide-react";
import interactionService from "../services/interaction.service";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import PostForm from "./PostForm";

function InteractionBar({ tweet, isCommentCard = false, onCommentAdded }) {
  const currentUser = useSelector((state) => state.auth.userData);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(tweet?.commentsCount || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const hasLiked = tweet?.likes?.includes(currentUser?._id) || tweet?.isLiked;
    setIsLiked(!!hasLiked);
    setLikesCount(tweet?.likes?.length || tweet?.likesCount || 0);
    setCommentsCount(tweet?.commentsCount || 0);
  }, [tweet, currentUser?._id]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // 🛡️ Stops navigation to Detail page
    
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
    e.stopPropagation(); // 🛡️ Stops navigation to Detail page
    setIsModalOpen(true);
  };

  const handleCommentSuccess = (newComment) => {
    setIsModalOpen(false);
    setCommentsCount(prev => prev + 1);
    // Call the parent callback if provided
    if (onCommentAdded) {
      onCommentAdded(newComment);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center max-w-md mt-3 text-gray-500 dark:text-gray-400">
        {!isCommentCard && (
          <button 
            onClick={handleCommentClick} 
            className="group flex items-center gap-2 hover:text-violet-600 dark:hover:text-violet-400 outline-none transition-colors"
          >
            <div className="p-2 rounded-full group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 transition-colors">
              <MessageCircle size={18} />
            </div>
            <span className="text-xs font-medium">{commentsCount}</span>
          </button>
        )}

        <button 
          onClick={handleLike} 
          className={`group flex items-center gap-2 outline-none transition-colors ${
            isLiked ? "text-red-600 dark:text-red-400" : "hover:text-red-600 dark:hover:text-red-400"
          }`}
        >
          <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
            <Heart 
              size={18} 
              className={isLiked ? "fill-current" : "fill-none"} 
            />
          </div>
          <span className="text-xs font-medium">{likesCount}</span>
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PostForm isComment={true} parentId={tweet._id} onSuccess={handleCommentSuccess} />
      </Modal>
    </>
  );
}

export default InteractionBar;