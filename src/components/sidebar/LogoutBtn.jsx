import React from "react";
import authService from "../../services/auth.service";
import { logout } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react"; // Matching the icon style

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
    });
  };

  return (
    <button
      onClick={logoutHandler}
      className="flex items-center gap-4 px-4 py-3  text-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all group"
    >
      {/* Icon */}
      <LogOut className="w-7 h-7" />
    </button>
  );
}

export default LogoutBtn;
