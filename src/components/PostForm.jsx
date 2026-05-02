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

          
          dispatch(addTweet(formattedItem));
          reset();
          onSuccess(formattedItem); 
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
      className={`px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-primary)]`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 pt-1">
          {currentUser?.profileImage ? (
            <img
              src={currentUser.profileImage}
              className="w-10 h-10 rounded-full object-cover"
              alt="avatar"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--accent-color)] font-bold">
              U
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <textarea
            {...register("content")}
            className="w-full bg-transparent text-xl outline-none resize-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] min-h-[50px] mt-2"
            placeholder={isComment ? "Post your reply" : "What is happening?!"}
            rows={isComment ? "1" : "2"}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />

          {/* Image Preview */}
          {imagePreview && !isComment && (
            <div className="relative mt-3 rounded-2xl overflow-hidden border border-[var(--border-color)]">
              <img
                src={imagePreview}
                alt="preview"
                className="max-w-full max-h-[500px] w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImagePreview(null);
                  const fileInput = document.getElementById("tweet-image");
                  if (fileInput) fileInput.value = "";
                }}
                className="absolute top-2 right-2 p-1.5 bg-[rgba(15,20,25,0.75)] hover:bg-[rgba(39,44,48,0.75)] rounded-full transition-all text-white backdrop-blur-sm"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-2 pt-2">
            <div className="flex items-center -ml-2">
              {!isComment && (
                <>
                  <label
                    htmlFor="tweet-image"
                    className="p-2 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 rounded-full cursor-pointer transition-all"
                    title="Media"
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
                  <button type="button" className="p-2 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 rounded-full transition-all" title="GIF">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zM5 18a1 1 0 01-1-1V7a1 1 0 011-1h14a1 1 0 011 1v10a1 1 0 01-1 1H5z"/><path d="M11 10h1v4h-1zM10 14h-1v-4h3v1h-2v1h1v1h-1v1zM15 10h3v1h-2v1h1v1h-1v1h-1v-4z"/></svg>
                  </button>
                  <button type="button" className="p-2 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 rounded-full transition-all" title="Poll">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 5v14h12V5H6zm2 2h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg>
                  </button>
                  <button type="button" className="p-2 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 rounded-full transition-all" title="Emoji">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm-3.5 6a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm7 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-3.5 4c2.5 0 4.5 1.5 4.5 3.5h-9c0-2 2-3.5 4.5-3.5z"/></svg>
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {charCount > 0 && (
                <div className={`text-[13px] ${isOverLimit ? "text-red-500" : "text-[var(--text-secondary)]"}`}>
                  {MAX_LIMIT - charCount}
                </div>
              )}
              <Button
                disabled={isButtonDisabled}
                type="submit"
                isLoading={isSubmitting}
                className={`rounded-full px-5 py-1.5 font-bold text-[15px] transition-all ${
                  isButtonDisabled 
                    ? "bg-[var(--accent-color)] opacity-50 text-white" 
                    : "bg-[var(--accent-color)] hover:opacity-90 text-white"
                }`}
              >
                {isComment ? "Reply" : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PostForm;