import React from "react";
import authService from "../../services/auth.service";
import { logout } from "../../store/authSlice";
import { useDispatch } from "react-redux";
function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
    });
  };
  return <button onClick={logoutHandler}>Logout</button>;
}

export default LogoutBtn;
