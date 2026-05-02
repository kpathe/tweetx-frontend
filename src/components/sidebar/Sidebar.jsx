import React from "react";
import { LogoutBtn } from "../index";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Bell, UserPlus, User, Moon, Sun } from "lucide-react";
import { light, dark } from "../../store/themeSlice";

function Sidebar() {
  const authStatus = useSelector((state) => state.auth.status);
  const themeMode = useSelector((state) => state.theme.themeMode);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.auth.userData);
  const username = userData?.data?.user?.username || "me";
  const dispatch = useDispatch();

  const navItems = [
    { name: "Home", slug: "/", icon: Home },
    { name: "Search", slug: "/search", icon: Search },
    { name: "Notifications", slug: "/notifications", icon: Bell },
    { name: "Follow", slug: "/follow", icon: UserPlus },
    { name: "Profile", slug: `/u/${username}`, icon: User },
  ];

  const toggleTheme = () => {
    const newMode = themeMode === "light" ? "dark" : "light";
    dispatch(newMode === "dark" ? dark() : light());
  };

  return (
    <nav className="flex flex-col h-full w-full px-3 py-4 bg-white dark:bg-slate-950">
      {/* Logo */}
      <div className="flex xl:justify-start justify-center mb-6 px-4">
        <Link
          to="/"
          className="flex items-center justify-center w-12 h-12 text-3xl font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 rounded-full transition-all"
        >
          𝕏
        </Link>
      </div>

      {/* Navigation Items */}
      <ul className="flex flex-col space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.slug ||
            (item.slug === "/" && location.pathname === "/");

          return (
            <li key={item.name} className="flex xl:justify-start justify-center">
              <button
                onClick={() => navigate(item.slug)}
                className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group ${
                  isActive
                    ? "font-bold text-violet-600 dark:text-violet-400"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800/50 text-gray-900 dark:text-gray-300"
                }`}
                title={item.name}
              >
                <div className="relative">
                  <item.icon
                    className={`w-7 h-7 transition-all ${
                      isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                    }`}
                  />
                  {item.name === "Notifications" && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-violet-600 rounded-full border-2 border-white dark:border-slate-950"></span>
                  )}
                </div>
                <span className="hidden xl:block text-xl">{item.name}</span>
              </button>
            </li>
          );
        })}
        
        {/* Post Button */}
        <li className="mt-4 px-2">
          <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-full shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center">
            <span className="hidden xl:block">Post</span>
            <svg className="xl:hidden w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </li>
      </ul>

      {/* Footer Actions */}
      <div className="flex flex-col gap-4 mt-auto border-t border-gray-100 dark:border-gray-800 pt-4 px-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-900 dark:text-gray-300 group"
        >
          <div className="p-1 group-hover:text-violet-600 transition-colors">
            {themeMode === "light" ? <Moon size={24} /> : <Sun size={24} />}
          </div>
          <span className="hidden xl:block text-lg capitalize">{themeMode} mode</span>
        </button>

        {/* User Info / Logout */}
        {authStatus && (
          <div className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors group cursor-pointer">
            {userData?.data?.user?.profileImage ? (
               <img src={userData.data.user.profileImage} className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700" alt="profile" />
            ) : (
               <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold">
                 {username?.[0]?.toUpperCase() || "U"}
               </div>
            )}
            <div className="hidden xl:block flex-1 min-w-0">
               <p className="font-bold truncate text-gray-900 dark:text-white">{userData?.data?.user?.fullName || "User"}</p>
               <p className="text-sm text-gray-500 truncate">@{username || "username"}</p>
            </div>
            <div className="hidden xl:block">
              <LogoutBtn />
            </div>
          </div>
        )}
        
        {/* Compact Logout for non-XL */}
        {authStatus && (
          <div className="xl:hidden flex justify-center">
            <LogoutBtn />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Sidebar;
