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
      {/* Logo - Right aligned, same width as nav icons */}
      <div className="flex justify-end mb-6">
        <Link
          to="/"
          className="flex items-center justify-center w-12 h-12 text-3xl font-bold text-violet-600 dark:text-violet-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all"
        >
          𝕏
        </Link>
      </div>

      {/* Navigation Items - Right aligned */}
      <ul className="flex flex-col space-y-4 flex-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.slug ||
            (item.slug === "/" && location.pathname === "/");

          return (
            <li key={item.name} className="flex justify-end">
              <button
                onClick={() => navigate(item.slug)}
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-violet-100 dark:bg-violet-900/30 shadow-md dark:shadow-lg"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800/50"
                }`}
                title={item.name}
              >
                <item.icon
                  className={`w-6 h-6 transition-all ${
                    isActive
                      ? "text-violet-600 dark:text-violet-400 stroke-[2.5px]"
                      : "text-gray-900 dark:text-gray-300 stroke-[2px] hover:text-violet-600 dark:hover:text-violet-400"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Theme Toggle Button - Right aligned */}
      <div className="flex justify-end mb-2 px-2">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-900 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
          title={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}
        >
          {themeMode === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Logout Button - Right aligned */}
      {authStatus && (
        <div className="flex justify-end">
          <LogoutBtn />
        </div>
      )}
    </nav>
  );
}

export default Sidebar;
