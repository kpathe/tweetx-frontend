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
      className={`p-5 ${!isComment ? "border-b border-gray-100 dark:border-gray-800" : ""} bg-white dark:bg-slate-950 transition-all`}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img
            src={currentUser?.profileImage || "https://via.placeholder.com/150"}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-500/10 shadow-sm"
            alt="avatar"
          />
        </div>

        <div className="flex-1 min-w-0">
          <textarea
            {...register("content")}
            className="w-full bg-transparent text-xl outline-none resize-none dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-h-[50px] mt-2"
            placeholder={isComment ? "Post your reply..." : "What's happening?!"}
            rows={isComment ? "2" : "3"}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />

          {/* Image Preview */}
          {imagePreview && !isComment && (
            <div className="relative mt-4 rounded-2xl overflow-hidden group border border-gray-100 dark:border-gray-800 shadow-sm">
              <img
                src={imagePreview}
                alt="preview"
                className="max-w-full max-h-96 w-full object-cover"
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
                className="absolute top-3 right-3 p-2 bg-gray-900/80 hover:bg-black rounded-full transition-all text-white backdrop-blur-sm"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-gray-800/50">
            <div className="flex items-center gap-1">
              {!isComment && (
                <label
                  htmlFor="tweet-image"
                  className="p-2.5 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-full cursor-pointer transition-all"
                  title="Add Image"
                >
                  <ImageIcon size={22} />
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
              {/* Added some dummy icons for X-like feel */}
              <button type="button" className="p-2.5 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-full opacity-60 cursor-default">
                 <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            </div>

            <div className="flex items-center gap-5">
              {charCount > 0 && (
                <div className="flex items-center gap-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isOverLimit ? "border-red-500 text-red-500" : "border-violet-200 dark:border-violet-900 text-gray-400"}`}>
                      {MAX_LIMIT - charCount}
                   </div>
                </div>
              )}
              <Button
                disabled={isButtonDisabled}
                type="submit"
                isLoading={isSubmitting}
                className={`rounded-full px-8 py-2.5 font-extrabold text-base transition-all shadow-md active:scale-95 ${
                  isButtonDisabled 
                    ? "bg-violet-600/50 text-white/50" 
                    : "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20"
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