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
        navigate("/signup");
      } catch (err) {
        setError("Could not delete account. Try again later.");
      }
    }
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto p-4 md:p-8 min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>
          Edit Profile
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full transition-colors"
          style={{ color: "var(--text-primary)" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <X />
        </button>
      </div>

      <form onSubmit={handleSubmit(onUpdate)} className="space-y-8">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            {preview ? (
              <img
                src={preview}
                className="w-32 h-32 rounded-full object-cover brightness-90 group-hover:brightness-75 transition-all"
                style={{ border: "4px solid var(--accent-color)" }}
                alt=""
              />
            ) : (
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold"
                style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--accent-color)" }}
              >
                U
              </div>
            )}
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
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Click photo to change
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Display Name"
            placeholder="Your name"
            {...register("fullName")}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
              Bio
            </label>
            <textarea
              placeholder="What's on your mind?"
              className="w-full p-4 rounded-2xl bg-transparent outline-none min-h-[120px] transition-colors"
              style={{
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
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
          className="w-full py-4 rounded-full font-bold text-lg"
          style={{
            backgroundColor: "var(--text-primary)",
            color: "var(--bg-primary)",
          }}
        >
          {isSubmitting ? "Saving Changes..." : "Save Profile"}
        </Button>
      </form>

      {/* Danger Zone */}
      <div className="mt-20 pt-10" style={{ borderTop: "1px solid rgba(244,33,46,0.2)" }}>
        <h3 className="text-red-500 font-bold mb-2">Danger Zone</h3>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Deleting your account will remove all your tweets and media. This
          cannot be undone.
        </p>
        <button
          onClick={onDelete}
          className="w-full py-3 rounded-full font-bold transition-colors"
          style={{ border: "1px solid #f4212e", color: "#f4212e" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(244,33,46,0.1)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
