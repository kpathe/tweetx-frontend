import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addTweet } from "../store/tweetSlice";
import tweetService from "../services/tweet.service";
import { Button } from "./index";
import { ImageIcon } from "lucide-react";

function PostForm() {
  const MAX_LIMIT = 280; // Standard X limit
  const { register, handleSubmit, reset, watch } = useForm();
  const dispatch = useDispatch();

  const contentValue = watch("content") || "";
  const imageValue = watch("image");
  
  const charCount = contentValue.length;
  const isOverLimit = charCount > MAX_LIMIT;

  // Button is disabled if: (Empty AND no image) OR (Over the limit)
  const isButtonDisabled =
    (!contentValue?.trim() && (!imageValue || imageValue.length === 0)) || isOverLimit;

  // Accessing user data from Redux safely
  const authData = useSelector((state) => state.auth.userData);
  const currentUser = authData?.data?.user || authData?.user || authData;

  const submit = async (data) => {
    if (isOverLimit) return;

    const hasContent = data.content && data.content.trim().length > 0;
    const hasImage = data.image && data.image.length > 0;

    if (!hasContent && !hasImage) return;

    const formData = new FormData();
    if (hasContent) formData.append("content", data.content);
    if (hasImage) formData.append("image", data.image[0]);

    try {
      const response = await tweetService.createTweet(formData);

      if (response) {
        const newTweet = response.data?.data || response.data || response;

        const tweetWithAuthor = {
          ...newTweet,
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

        dispatch(addTweet(tweetWithAuthor));
        reset();
      }
    } catch (error) {
      console.error("PostForm :: submit :: error", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900"
    >
      <div className="flex gap-4">
        {/* User Avatar (Optional UI touch) */}
        <div className="hidden sm:block">
          <img 
            src={currentUser?.profileImage || "https://placehold.co/100"} 
            className="w-12 h-12 rounded-full object-cover" 
            alt="avatar"
          />
        </div>

        <div className="flex-1">
          <textarea
            {...register("content")}
            className="w-full bg-transparent text-xl outline-none resize-none dark:text-white placeholder-gray-500"
            placeholder="What's happening?!"
            rows="3"
          />

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-2">
              <label
                htmlFor="tweet-image"
                className="p-2 text-[#1d9bf0] hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-all"
                title="Add image"
              >
                <ImageIcon size={20} />
                <input
                  id="tweet-image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  {...register("image")}
                />
              </label>
              {imageValue?.[0] && (
                <span className="text-xs text-gray-500">Image selected</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Character Counter Logic */}
              {charCount > 0 && (
                <span className={`text-sm font-medium ${
                  isOverLimit ? "text-red-500" : 
                  (MAX_LIMIT - charCount <= 20) ? "text-yellow-600" : "text-gray-400"
                }`}>
                  {MAX_LIMIT - charCount}
                </span>
              )}

              <Button
                disabled={isButtonDisabled}
                type="submit"
                className="rounded-full px-6 py-2 bg-[#1d9bf0] text-white font-bold disabled:opacity-50 disabled:cursor-default hover:bg-[#1a8cd8] transition-all"
              >
                Tweet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PostForm;