import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addTweet } from "../store/tweetSlice";
import tweetService from "../services/tweet.service";
import interactionService from "../services/interaction.service";
import { Button } from "./index";
import { ImageIcon, X } from "lucide-react";

function PostForm({
  isComment = false,
  parentId = null,
  onSuccess = () => {},
}) {
  const MAX_LIMIT = 280;
  const { register, handleSubmit, reset, watch } = useForm();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const contentValue = watch("content") || "";
  const imageValue = watch("image");

  // Handle image preview
  useEffect(() => {
    if (imageValue && imageValue[0]) {
      const url = URL.createObjectURL(imageValue[0]);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [imageValue]);

  const charCount = contentValue.length;
  const isOverLimit = charCount > MAX_LIMIT;

  // For comments, we only care about text. For tweets, we check text or image.
  const isButtonDisabled = isComment 
    ? !contentValue?.trim() || isOverLimit || isSubmitting
    : (!contentValue?.trim() && (!imageValue || imageValue.length === 0)) || isOverLimit || isSubmitting;

  const authData = useSelector((state) => state.auth.userData);
  const currentUser = authData?.data?.user || authData?.user || authData;

  const submit = async (data) => {
    if (isOverLimit) return;
    
    setIsSubmitting(true);

    try {
      let response;

      if (isComment && parentId) {
        // 🚀 Comment Logic: Only send content as per your backend
        response = await interactionService.addComment(parentId, data.content);
      } else {
        // 🚀 Tweet Logic: Send FormData with optional image
        const formData = new FormData();
        if (data.content?.trim()) formData.append("content", data.content);
        if (data.image?.[0]) formData.append("image", data.image[0]);
        
        response = await tweetService.createTweet(formData);
      }

      if (response) {
        const resultData = response.data?.data || response.data || response;

        if (isComment) {
          // Format comment with owner info
          const formattedComment = {
            ...resultData,
            owner: {
              _id: currentUser._id,
              fullName: currentUser.fullName,
              username: currentUser.username,
              profileImage: currentUser.profileImage,
            },
            likes: [],
            createdAt: new Date().toISOString(),
          };
          reset();
          onSuccess({ data: formattedComment });
        } else {
          // Standardize the object for instant UI updates (tweets)
          const formattedItem = {
            ...resultData,
            author: {
              _id: currentUser._id,
              fullName: currentUser.fullName,
              username: currentUser.username,
              profileImage: currentUser.profileImage,
            },
            likesCount: 0,
            commentsCount: 0,
            isLiked: false,
          };

          // Only update the main tweet feed if it's a top-level post
          dispatch(addTweet(formattedItem));
          reset();
          onSuccess(formattedItem); // Closes the modal or triggers parent update
        }
      }
    } catch (error) {
      console.error("PostForm :: submit :: error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className={`p-4 ${!isComment ? "border-b border-gray-200 dark:border-gray-700" : ""} bg-white dark:bg-slate-950`}
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="hidden sm:block flex-shrink-0">
          <img
            src={currentUser?.profileImage || "https://placehold.co/100"}
            className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
            alt="avatar"
          />
        </div>

        <div className="flex-1 min-w-0">
          <textarea
            {...register("content")}
            className="w-full bg-transparent text-lg outline-none resize-none dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder={isComment ? "Post your reply..." : "What's happening?!"}
            rows={isComment ? "2" : "3"}
          />

          {/* Image Preview */}
          {imagePreview && !isComment && (
            <div className="relative mt-4 rounded-2xl overflow-hidden group">
              <img
                src={imagePreview}
                alt="preview"
                className="max-w-full max-h-64 object-cover rounded-2xl"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImagePreview(null);
                  // Clear the file input
                  const fileInput = document.getElementById("tweet-image");
                  if (fileInput) fileInput.value = "";
                }}
                className="absolute top-2 right-2 p-1.5 bg-gray-900/70 hover:bg-gray-900 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-2">
              {/* 🖼️ Hide Image Icon if it's a comment */}
              {!isComment && (
                <label
                  htmlFor="tweet-image"
                  className="p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-full cursor-pointer transition-all disabled:opacity-50"
                  style={{ cursor: isSubmitting ? "not-allowed" : "pointer" }}
                >
                  <ImageIcon size={20} />
                  <input
                    id="tweet-image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={isSubmitting}
                    {...register("image")}
                  />
                </label>
              )}
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              {charCount > 0 && (
                <span className={`text-sm font-medium ${isOverLimit ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500"}`}>
                  {MAX_LIMIT - charCount}
                </span>
              )}
              <Button
                disabled={isButtonDisabled}
                type="submit"
                isLoading={isSubmitting}
                className="rounded-full px-6 py-2 bg-violet-600 dark:bg-violet-700 hover:bg-violet-700 dark:hover:bg-violet-600 text-white font-bold text-base min-w-fit"
              >
                {isComment ? "Reply" : "Tweet"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PostForm;