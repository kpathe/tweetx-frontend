import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Camera, X } from "lucide-react";
import { Input, Button } from "../components";
import userService from "../services/user.service";
import { login } from "../store/authSlice";

function EditProfile() {
  const { userData } = useSelector((state) => state.auth);
  const [preview, setPreview] = useState(userData?.data?.user?.profileImage || "");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: userData?.data?.user?.fullName || "",
      bio: userData?.data?.user?.bio || "",
    },
  });

  // Handle Image Preview
  const imageFile = watch("profileImage");
  React.useEffect(() => {
    if (imageFile && imageFile[0]) {
      const url = URL.createObjectURL(imageFile[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);
  const onUpdate = async (data) => {
    setError("");
    try {
      const updatePayload = {
        newFullName: data.fullName,
        newEmail: data.email || userData?.data?.user?.email,
        profileImage: data.profileImage?.[0] || null,
        newBio: data.bio,
      };

      await userService.editProfile(updatePayload);

      // Fetch updated user data and dispatch
      const updatedUserData = await userService.getCurrentUser();
      if (updatedUserData) {
        dispatch(login(updatedUserData));
        navigate(`/u/${updatedUserData?.data?.user?.username}`);
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  const onDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This action is permanent.",
    );
    if (confirmDelete) {
      try {
        await userService.deleteAccount();
        // Clear local storage/Redux if your service doesn't do it automatically
        navigate("/signup");
      } catch (err) {
        setError("Could not delete account. Try again later.");
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 bg-white dark:bg-slate-900 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold dark:text-white">
          Edit Profile
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
        >
          <X className="dark:text-white" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onUpdate)} className="space-y-8">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <img
              src={preview}
              className="w-32 h-32 rounded-full object-cover border-4 border-[#1d9bf0] brightness-90 group-hover:brightness-75 transition-all"
              alt=""
            />
            <label
              htmlFor="image-upload"
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
            >
              <Camera
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                size={32}
              />
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                {...register("profileImage")}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">Click photo to change</p>
        </div>

        <div className="space-y-4">
          <Input
            label="Display Name"
            placeholder="Your name"
            {...register("fullName")}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold dark:text-gray-300">Bio</label>
            <textarea
              placeholder="What's on your mind?"
              className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white focus:border-[#1d9bf0] outline-none min-h-[120px] transition-all"
              {...register("bio")}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium text-center">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-lg"
        >
          {isSubmitting ? "Saving Changes..." : "Save Profile"}
        </Button>
      </form>

      {/* Danger Zone */}
      <div className="mt-20 pt-10 border-t border-red-100 dark:border-red-900/30">
        <h3 className="text-red-600 font-bold mb-2">Danger Zone</h3>
        <p className="text-gray-500 text-sm mb-6">
          Deleting your account will remove all your tweets and media. This
          cannot be undone.
        </p>
        <button
          onClick={onDelete}
          className="w-full py-3 rounded-full border border-red-500 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
