import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input } from "./index";
import { useDispatch } from "react-redux";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import { useForm } from "react-hook-form";
import { setSessionHint } from "../utils/sessionHint";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      const session = await authService.login(data);
      if (session) {
        setSessionHint();
        const userData = await userService.getCurrentUser();
        if (userData) {
          dispatch(authLogin(userData));
          navigate("/");
        }
      }
    } catch (error) {
      // Custom error messages for wrong credentials
      let msg =
        error?.response?.data?.message?.toLowerCase() || error.message?.toLowerCase() || "";
      if (msg.includes("invalid") || msg.includes("not found") || msg.includes("wrong")) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(login)} className="space-y-4">
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
          placeholder="Enter your password"
          type="password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
          })}
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
          {isLoading ? "Logging in..." : "Log In"}
        </Button>
      </form>
    </div>
  );
}

export default Login;
