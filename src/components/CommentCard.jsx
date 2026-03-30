import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import InteractionBar from "./InteractionBar";
import interactionService from "../services/interaction.service";

function CommentCard({ comment, onCommentDelete }) {
  const currentUser = useSelector((state) => state.auth.userData.data);
  const author = comment.owner;
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUser?.user?._id === author?._id;

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
    <div className="flex gap-3 p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-950 transition-colors">
      {/* Avatar */}
      <Link
        to={`/u/${author?.username}`}
        className="flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={author?.profileImage || "https://placehold.co/100"}
          className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity ring-1 ring-gray-100 dark:ring-gray-800"
          alt="avatar"
        />
      </Link>

      <div className="flex flex-col w-full">
        {/* Header: Name, Handle, Date, and Delete Button */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-1 min-w-0">
            <Link
              to={`/u/${author?.username}`}
              className="font-bold dark:text-white hover:underline text-[15px] truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {author?.fullName}
            </Link>
            <span className="text-gray-500 text-sm truncate">
              @{author?.username}
            </span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-xs whitespace-nowrap">
              {comment.createdAt
                ? formatDistanceToNow(new Date(comment.createdAt))
                : "now"}
            </span>
          </div>

          {/* Icon-based Delete Button */}
          {isOwner && (
            <button
              onClick={handleDeleteComment}
              disabled={isDeleting}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all duration-200 disabled:opacity-50"
              title="Delete comment"
            >
              {isDeleting ? (
                <span className="text-[10px] animate-pulse">...</span>
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <p className="mt-1 text-[15px] dark:text-gray-200 leading-normal">
          {comment.content}
        </p>

        {/* Interactions */}
        <div className="mt-2 -ml-2">
          <InteractionBar tweet={comment} isCommentCard={true} />
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
