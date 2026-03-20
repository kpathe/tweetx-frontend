import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
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
      const session = await authService.signup(data);
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
            label="Name"
            placeholder="Enter your full name"
            {...register("name", { required: true })}
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
            placeholder="Your password"
            {...register("password", { required: true })}
          />
          <Input label="Profile Image" placeholder="Upload kadak DP" />

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
