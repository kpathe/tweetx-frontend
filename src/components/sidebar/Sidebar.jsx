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
    { label: "Home", path: "/", icon: Home },
    { label: "Search", path: "/search", icon: Search },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Connect", path: "/follow", icon: UserPlus },
    { label: "Profile", path: `/u/${username}`, icon: User },
  ];

  const isDarkMode = themeMode === "dark";

  return (
    <div className="flex flex-col h-full py-2 justify-between">
      <div className="flex flex-col">
        {/* Logo */}
        <div className="mb-1">
          <Link to="/" className="p-3 hover:bg-[var(--bg-tertiary)] rounded-full transition-all inline-block">
            <span className="text-3xl font-black text-[var(--text-primary)]">𝕏</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center group w-fit"
            >
              <div className={`flex items-center gap-4 p-3 rounded-full transition-all group-hover:bg-[var(--bg-tertiary)] ${
                location.pathname === item.path ? "font-bold" : "font-normal"
              }`}>
                <div className="relative">
                  <item.icon
                    size={28}
                    strokeWidth={location.pathname === item.path ? 2.5 : 2}
                    className="text-[var(--text-primary)]"
                  />
                  {item.label === "Notifications" && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent-color)] text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-[var(--bg-primary)]">
                      2
                    </div>
                  )}
                </div>
                <span className="text-xl hidden xl:block pr-4 text-[var(--text-primary)]">
                  {item.label}
                </span>
              </div>
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(themeMode === "dark" ? light() : dark())}
            className="flex items-center group w-fit"
          >
             <div className="flex items-center gap-4 p-3 rounded-full transition-all group-hover:bg-[var(--bg-tertiary)]">
               {themeMode === "dark" ? <Sun size={28} className="text-[var(--text-primary)]" /> : <Moon size={28} className="text-[var(--text-primary)]" />}
               <span className="text-xl hidden xl:block pr-4 text-[var(--text-primary)]">
                 {themeMode === "dark" ? "Light Mode" : "Dark Mode"}
               </span>
             </div>
          </button>

          {/* Post Button */}
          <div className="pt-4 pr-4">
             <button className="bg-[var(--accent-color)] text-white xl:w-full py-3.5 rounded-full font-bold text-[17px] shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center">
                <span className="hidden xl:block">Post</span>
                <span className="xl:hidden">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H14.5V11zm-2.5 0h-1.5v2h1.5V11zM6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H6z"/></svg>
                </span>
             </button>
          </div>
        </nav>
      </div>

      {/* User Info Section */}
      {authStatus && (
        <div className="mb-4 pr-4">
          <div className="flex items-center gap-3 p-3 hover:bg-[var(--bg-tertiary)] rounded-full transition-all group cursor-pointer">
            <div className="flex-shrink-0">
              {userData?.data?.user?.profileImage ? (
                 <img src={userData.data.user.profileImage} className="w-10 h-10 rounded-full object-cover" alt="profile" />
              ) : (
                 <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--accent-color)] font-bold">
                   {username?.[0]?.toUpperCase() || "U"}
                 </div>
              )}
            </div>
            <div className="hidden xl:block flex-1 min-w-0">
               <p className="font-bold truncate text-[var(--text-primary)]">{userData?.data?.user?.fullName || "User"}</p>
               <p className="text-[15px] text-[var(--text-secondary)] truncate">@{username || "username"}</p>
            </div>
            <div className="hidden xl:block">
               <LogoutBtn />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
