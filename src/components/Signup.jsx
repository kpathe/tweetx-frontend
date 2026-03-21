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
  const { register, handleSubmit } = useForm();

  const signup = async (data) => {
    setError("");
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.profileImage && data.profileImage[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
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
      setError(error.message);
    }
  };
  return (
    <div>
      <div>
        {/* logo */}

        <form onSubmit={handleSubmit(signup)}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            {...register("fullName", { required: true })}
          />

          <Input
            label="Username"
            placeholder="Enter a username"
            {...register("username", { required: true })}
          />
          <Input
            label="Email : "
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: true,
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
            placeholder="Your password"
            {...register("password", { required: true })}
          />
          <Input
            label="Profile Image"
            accept="image/png, image/jpg, image/jpeg"
            type="file"
            placeholder="Upload kadak DP"
            {...register("profileImage", {})}
          />

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </div>

      <div>
        <p>{error}</p>
      </div>
    </div>
  );
}

export default Signup;
