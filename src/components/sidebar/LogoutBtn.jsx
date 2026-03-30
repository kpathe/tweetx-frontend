import React, { use } from "react";
import authService from "../../services/auth.service";
import { logout } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
      navigate("/");
    });
  };

  return (
    <button
      onClick={logoutHandler}
      className="flex items-center justify-center w-12 h-12 rounded-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      title="Logout"
    >
      <LogOut className="w-6 h-6" />
    </button>
  );
}

export default LogoutBtn;
