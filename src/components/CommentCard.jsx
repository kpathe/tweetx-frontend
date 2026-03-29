import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InteractionBar from "./InteractionBar";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import interactionService from "../services/interaction.service";

function CommentCard({ comment, onCommentDelete }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.userData.data);
  const author = comment.owner; // Populated from backend
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUser?.user?._id === comment?.owner?._id;

  const handleDeleteComment = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await interactionService.deleteComment(comment._id);
      if (onCommentDelete) {
        onCommentDelete(comment._id);
      }
    } catch (error) {
      console.error("CommentCard :: handleDeleteComment :: error", error);
      alert("Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3 p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
      <Link to={`/u/${author?.username || author?._id}`} className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <img
          src={author?.profileImage || "https://placehold.co/100"}
          className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
          alt="avatar"
        />
      </Link>

      <div className="flex flex-col w-full">
        <div className="flex items-center gap-1 justify-between">
          <div className="flex items-center gap-1">
            <Link to={`/u/${author?.username || author?._id}`} className="font-bold dark:text-white hover:underline text-[15px]" onClick={(e) => e.stopPropagation()}>
              {author?.fullName}
            </Link>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-xs">
              {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt)) : "now"}
            </span>
          </div>

          {isOwner && (
            <button
              onClick={handleDeleteComment}
              disabled={isDeleting}
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded text-sm disabled:opacity-50"
            >
              {isDeleting ? "..." : "Delete"}
            </button>
          )}
        </div>

        <p className="mt-1 text-[15px] dark:text-gray-200 leading-normal">
          {comment.content}
        </p>

        <div className="mt-2 -ml-2">
          <InteractionBar tweet={comment} isCommentCard={true} />
        </div>
      </div>
    </div>
  );
}

export default CommentCard;