import { useEffect, useState } from "react";
import userService from "../src/services/user.service";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice"; 
import { Outlet } from "react-router-dom";
import { Spinner } from "./components";

function App() {
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.themeMode);

  useEffect(() => {
    userService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoader(false)); 
  }, [dispatch]); 

  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(themeMode);
  }, [themeMode]);

  if (loader) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Spinner size="lg" className="text-violet-600 dark:text-violet-400" />
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
