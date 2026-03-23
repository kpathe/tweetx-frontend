import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addTweet } from "../store/tweetSlice";
import tweetService from "../services/tweet.service";
import { Button, Input } from "./index";
import { ImageIcon } from "lucide-react";

function PostForm() {
  const { register, handleSubmit, reset, watch } = useForm();
  const dispatch = useDispatch();

  const contentValue = watch("content");
  const imageValue = watch("image");

  const isButtonDisabled =
    !contentValue?.trim() && (!imageValue || imageValue.length === 0);

  const currentUser = useSelector((state) => state.auth.userData.data.user);

  const submit = async (data) => {
    const hasContent = data.content && data.content.trim().length > 0;
    const hasImage = data.image && data.image.length > 0;

    if (!hasContent && !hasImage) {
      return;
    }
    const formData = new FormData();
    console.log(formData);

    // 2. Only append content if it exists
    if (hasContent) {
      formData.append("content", data.content);
    }

    if (hasImage) {
      formData.append("image", data.image[0]);
    }

    try {
      const response = await tweetService.createTweet(formData);

      if (response) {
        // 1. Get the raw tweet from the response
        const newTweet = response.data?.data || response.data || response;

        // 2. THE PATCH: Manually add the author object from our Auth State
        // This ensures the TweetCard has the data it needs to render immediately
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

        // 3. Dispatch the "Complete" tweet
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
      className="p-4 border-b border-gray-200 dark:border-gray-800"
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <textarea
            {...register("content")}
            className="w-full bg-transparent text-xl outline-none resize-none dark:text-white"
            placeholder="What's happening?!"
            rows="3"
          />

          <div className="flex justify-end mt-2">
            <label
              htmlFor="tweet-image"
              className="p-2 text-[#1d9bf0]  dark:hover:bg-slate-800 rounded-full cursor-pointer transition-all"
              title="Add image"
            >
              <ImageIcon size={22} />

              {/* 2. The Actual Input is visually hidden but functional */}
              <input
                id="tweet-image"
                type="file"
                className="hidden" // 👈 This hides the "No file chosen" text
                accept="image/*"
                {...register("image")}
              />
            </label>
            <Button
              disabled={isButtonDisabled}
              type="submit"
              className="rounded-full px-6 font-bold disabled:opacity-50 disabled:cursor-default"
            >
              Tweet
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PostForm;
