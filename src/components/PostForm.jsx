import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addTweet } from "../store/tweetSlice";
import tweetService from "../services/tweet.service";
import { Button } from "./index";

function PostForm() {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();

  const submit = async (data) => {
    try {
      const response = await tweetService.createTweet(data);
      if (response) {
        dispatch(addTweet(response));
        reset(); // Clears the textarea
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
            {...register("content", { required: true })}
            className="w-full bg-transparent text-xl outline-none resize-none dark:text-white"
            placeholder="What's happening?!"
            rows="3"
          />
          <div className="flex justify-end mt-2">
            <Button type="submit" className="rounded-full px-6 font-bold">
              Tweet
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PostForm;
