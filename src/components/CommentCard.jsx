import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import InteractionBar from "./InteractionBar";
import interactionService from "../services/interaction.service";
import Avatar from "./Avatar";

function CommentCard({ comment, onCommentDelete }) {
  const currentUser = useSelector((state) => state.auth.userData?.data);
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
    <div
      className="flex gap-3 p-4 transition-colors"
      style={{ borderBottom: "1px solid var(--border-color)" }}
    >
      {/* Avatar */}
      <Link
        to={`/u/${author?.username}`}
        className="flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar
          src={author?.profileImage}
          name={author?.fullName}
          username={author?.username}
          size={40}
        />
      </Link>

      <div className="flex flex-col w-full min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0 text-[15px]">
            <Link
              to={`/u/${author?.username}`}
              className="font-bold hover:underline truncate"
              style={{ color: "var(--text-primary)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {author?.fullName}
            </Link>
            <span style={{ color: "var(--text-secondary)" }}>@{author?.username}</span>
            <span style={{ color: "var(--text-secondary)" }}>·</span>
            <span className="text-[13px] whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
              {comment.createdAt
                ? formatDistanceToNow(new Date(comment.createdAt))
                : "now"}
            </span>
          </div>

          {isOwner && (
            <button
              onClick={handleDeleteComment}
              disabled={isDeleting}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors disabled:opacity-50"
              style={{ color: "var(--text-secondary)" }}
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
        <p className="mt-0.5 text-[15px] leading-normal" style={{ color: "var(--text-primary)" }}>
          {comment.content}
        </p>

        {/* Interactions */}
        <div className="mt-1 -ml-2">
          <InteractionBar tweet={comment} isCommentCard={true} />
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
