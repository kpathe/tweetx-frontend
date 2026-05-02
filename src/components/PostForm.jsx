import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addTweet } from "../store/tweetSlice";
import tweetService from "../services/tweet.service";
import interactionService from "../services/interaction.service";
import { Button } from "./index";
import { ImageIcon, X } from "lucide-react";
import Avatar from "./Avatar";

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
      className="px-4 py-3"
      style={{ borderBottom: "1px solid var(--border-color)" }}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 pt-1">
          <Avatar
            src={currentUser?.profileImage}
            name={currentUser?.fullName}
            username={currentUser?.username}
            size={40}
          />
        </div>

        <div className="flex-1 min-w-0">
          <textarea
            {...register("content")}
            className="w-full bg-transparent text-xl outline-none resize-none min-h-[56px] mt-2"
            style={{ color: "var(--text-primary)" }}
            placeholder={isComment ? "Post your reply" : "What is happening?!"}
            rows={isComment ? "1" : "2"}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />

          {/* Image Preview */}
          {imagePreview && !isComment && (
            <div
              className="relative mt-3 rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border-color)" }}
            >
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
                className="absolute top-2 right-2 p-1.5 rounded-full transition-all text-white"
                style={{ backgroundColor: "rgba(15,20,25,0.75)" }}
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Bottom toolbar */}
          <div
            className="flex items-center justify-between mt-3 pt-3"
            style={{ borderTop: isComment ? "none" : "1px solid var(--border-color)" }}
          >
            <div className="flex items-center -ml-2">
              {!isComment && (
                <>
                  <label
                    htmlFor="tweet-image"
                    className="p-2 rounded-full cursor-pointer transition-colors"
                    style={{ color: "var(--accent-color)" }}
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
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {charCount > 0 && (
                <span className="text-[13px]" style={{ color: isOverLimit ? "#f4212e" : "var(--text-secondary)" }}>
                  {MAX_LIMIT - charCount}
                </span>
              )}
              <Button
                disabled={isButtonDisabled}
                type="submit"
                isLoading={isSubmitting}
                className="rounded-full px-5 py-1.5 font-bold text-[15px] text-white transition-opacity"
                style={{
                  backgroundColor: "var(--accent-color)",
                  opacity: isButtonDisabled ? 0.5 : 1,
                }}
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