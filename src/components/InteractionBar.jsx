import React, { useState } from "react";
import tweetService from "../services/tweet.service";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function InteractionBar({ tweet }) {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.userData);
    
    // Check if current user is in the likes array
    const [isLiked, setIsLiked] = useState(tweet?.likes?.includes(currentUser?._id));
    const [likesCount, setLikesCount] = useState(tweet?.likes?.length || 0);

    const handleLike = async (e) => {
        e.stopPropagation(); // Prevents navigating to tweet page when clicking like
        try {
            const response = await tweetService.toggleLike(tweet._id);
            if (response) {
                setIsLiked(!isLiked);
                setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
            }
        } catch (error) {
            console.error("Like Toggle Failed", error);
        }
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();
        navigate(`/tweet/${tweet._id}`);
    };

    return (
        <div className="flex justify-between items-center max-w-md mt-3 text-gray-500">
            {/* Comment */}
            <button 
                onClick={handleCommentClick}
                className="flex items-center gap-2 hover:text-blue-500 transition-colors group"
            >
                <span className="p-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 rounded-full">💬</span>
                <span className="text-sm">{tweet?.comments?.length || 0}</span>
            </button>

            {/* Like */}
            <button 
                onClick={handleLike}
                className={`flex items-center gap-2 transition-colors group ${isLiked ? "text-pink-600" : "hover:text-pink-600"}`}
            >
                <span className={`p-2 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 rounded-full`}>
                    {isLiked ? "❤️" : "🤍"}
                </span>
                <span className="text-sm">{likesCount}</span>
            </button>

            {/* Views (Mock/Static for now) */}
            <div className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                <span className="p-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 rounded-full">📊</span>
                <span className="text-sm">{tweet?.viewsCount || 0}</span>
            </div>

            {/* Share */}
            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 rounded-full transition-colors">
                📤
            </button>
        </div>
    );
}

export default InteractionBar;