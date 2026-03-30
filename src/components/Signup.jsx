import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input } from "./index";
import { useDispatch } from "react-redux";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (data) => {
    console.log(data);
    setError("");
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.profileImage && data.profileImage[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const session = await authService.signup(formData);
      if (session) {
        const userData = await userService.getCurrentUser();
        if (userData) {
          dispatch(login(userData));
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(signup)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          error={errors.fullName?.message}
          {...register("fullName", {
            required: "Full name is required",
          })}
        />

        <Input
          label="Username"
          placeholder="Enter a username"
          error={errors.username?.message}
          {...register("username", {
            required: "Username is required",
          })}
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            validate: {
              matchPattern: (value) =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "Email address must be a valid address",
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Choose a strong password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <Input
          label="Profile Image (Optional)"
          accept="image/png, image/jpg, image/jpeg"
          type="file"
          placeholder="Upload profile picture"
          {...register("profileImage", {})}
        />

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-3 text-base font-semibold"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
}

export default Signup;
