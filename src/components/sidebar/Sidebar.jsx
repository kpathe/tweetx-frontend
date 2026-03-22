import React from "react";
import { Container, LogoutBtn } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Bell, UserPlus, User } from "lucide-react";

function Sidebar() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.auth.userData);
  const username = userData?.data?.user?.username || "me";

  const navItems = [
    { name: "Home", slug: "/", icon: Home },
    { name: "Search", slug: "/search", icon: Search },
    { name: "Notifications", slug: "/notifications", icon: Bell },
    { name: "Follow", slug: "/follow", icon: UserPlus },
    { name: "Profile", slug: `/${username}`, icon: User },
  ];

  console.log(authStatus);
  return (
    <nav className="flex flex-col h-full space-y-2">
      <div className="mb-4 px-4 py-2">
        <Link
          to="/"
          className="inline-block p-3 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-all"
        >
          <div className="w-8 h-8 bg-black dark:bg-white rounded-sm" />
        </Link>
      </div>

      <ul className="flex flex-col space-y-1 w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.slug;

          return (
            <li key={item.name}>
              <button
                onClick={() => navigate(item.slug)}
                className={`flex items-center gap-4 px-4 py-3 w-fit text-xl hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-all group ${
                  isActive ? "font-bold" : "font-medium"
                }`}
              >
                <item.icon
                  className={`w-7 h-7 transition-all ${
                    isActive
                      ? "text-[#000000] stroke-[3px]"
                      : "dark:text-white stroke-[2px]"
                  }`}
                />
              </button>
            </li>
          );
        })}

        {authStatus && (
          <li className="pt-4">
            <LogoutBtn />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Sidebar;
