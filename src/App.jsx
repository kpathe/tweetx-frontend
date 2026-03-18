import { useEffect, useState } from "react";
import userService from "../src/services/user.service";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice"; // Import the actions!
import { Outlet } from "react-router-dom";

function App() {
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // We call the service and handle the Promise
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
  }, []); // 

  
  if (loader) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="w-full block">
        <h1>TweetX</h1>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
