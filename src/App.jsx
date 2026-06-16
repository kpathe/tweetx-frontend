import { useEffect, useState } from "react";
import userService from "../src/services/user.service";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice"; 
import { Outlet } from "react-router-dom";
import { clearSessionHint, hasSessionHint } from "./utils/sessionHint";

function App() {
  const [loader, setLoader] = useState(() => hasSessionHint());
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.themeMode);

  useEffect(() => {
    if (!hasSessionHint()) {
      dispatch(logout());
      return;
    }

    userService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => {
        clearSessionHint();
        dispatch(logout());
      })
      .finally(() => setLoader(false));
  }, [dispatch]);

  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(themeMode);
  }, [themeMode]);

  if (loader) {
    return (
      <div  className="min-h-screen flex justify-center items-center">
        <h1 className="text-3xl font-semibold text-neutral-900 transition-colors duration-300 animate-pulse">Wait while deployment runs</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full block">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
