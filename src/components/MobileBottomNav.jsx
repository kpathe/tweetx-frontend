import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Search, Bell, UserPlus, User } from "lucide-react";

function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);
  const username = userData?.data?.user?.username || "me";

  const navItems = [
    { name: "Home", slug: "/", icon: Home },
    { name: "Search", slug: "/search", icon: Search },
    { name: "Notifications", slug: "/notifications", icon: Bell },
    { name: "Follow", slug: "/follow", icon: UserPlus },
    { name: "Profile", slug: `/u/${username}`, icon: User },
  ];

  if (!authStatus) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.slug || (item.slug === "/" && location.pathname === "/");
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.slug)}
              className="flex flex-col items-center justify-center w-full h-full transition-all duration-200"
              title={item.name}
            >
              <item.icon
                size={24}
                className={`transition-all ${
                  isActive
                    ? "text-violet-600 dark:text-violet-400 stroke-[2.5px]"
                    : "text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 stroke-[2px]"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MobileBottomNav;
