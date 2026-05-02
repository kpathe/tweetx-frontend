import React from "react";
import { LogoutBtn } from "../index";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Home, Search, Bell, UserPlus, User, Moon, Sun, Feather } from "lucide-react";
import { light, dark } from "../../store/themeSlice";

function Sidebar() {
  const authStatus = useSelector((state) => state.auth.status);
  const themeMode = useSelector((state) => state.theme.themeMode);
  const location = useLocation();
  const userData = useSelector((state) => state.auth.userData);
  const username = userData?.data?.user?.username || "me";
  const dispatch = useDispatch();
  const isDark = themeMode === "dark";

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Search", path: "/search", icon: Search },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Connect", path: "/follow", icon: UserPlus },
    { label: "Profile", path: `/u/${username}`, icon: User },
  ];

  return (
    <div className="flex flex-col h-full py-2 justify-between">
      <div>
        {/* Logo */}
        <div className="mb-2 flex xl:justify-start justify-center">
          <Link
            to="/"
            className="p-3 rounded-full transition-colors inline-flex items-center justify-center"
            style={{ color: "var(--text-primary)" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <span className="text-[28px] font-black">𝕏</span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex xl:justify-start justify-center"
              >
                <div
                  className="flex items-center gap-5 py-3 px-3 rounded-full transition-colors"
                  style={{
                    fontWeight: isActive ? 700 : 400,
                    color: "var(--text-primary)",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div className="relative">
                    <Icon size={26} strokeWidth={isActive ? 2.8 : 2} />
                    {item.label === "Notifications" && (
                      <div
                        className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: "var(--accent-color)", border: "2px solid var(--bg-primary)" }}
                      >
                        3
                      </div>
                    )}
                  </div>
                  <span className="text-xl hidden xl:block pr-4">{item.label}</span>
                </div>
              </Link>
            );
          })}

          {/* Theme Toggle */}
          <div className="flex xl:justify-start justify-center">
            <button
              onClick={() => dispatch(isDark ? light() : dark())}
              className="flex items-center gap-5 py-3 px-3 rounded-full transition-colors"
              style={{ color: "var(--text-primary)" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              {isDark ? <Sun size={26} /> : <Moon size={26} />}
              <span className="text-xl hidden xl:block pr-4">
                {isDark ? "Light mode" : "Dark mode"}
              </span>
            </button>
          </div>
        </nav>

        {/* Post Button */}
        <div className="mt-4 flex xl:justify-start justify-center xl:pr-4">
          <button
            className="xl:w-full py-3 px-4 rounded-full font-bold text-[17px] flex items-center justify-center text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent-color)" }}
          >
            <span className="hidden xl:block">Post</span>
            <Feather size={22} className="xl:hidden" />
          </button>
        </div>
      </div>

      {/* User Profile at Bottom */}
      {authStatus && (
        <div className="xl:pr-4 flex xl:justify-start justify-center">
          <Link
            to={`/u/${username}`}
            className="flex items-center gap-3 p-3 rounded-full transition-colors w-full"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <div className="flex-shrink-0">
              {userData?.data?.user?.profileImage ? (
                <img
                  src={userData.data.user.profileImage}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="profile"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--accent-color)" }}
                >
                  {username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="hidden xl:flex flex-1 items-center justify-between min-w-0">
              <div className="min-w-0">
                <p className="font-bold truncate" style={{ color: "var(--text-primary)" }}>
                  {userData?.data?.user?.fullName || "User"}
                </p>
                <p className="text-[15px] truncate" style={{ color: "var(--text-secondary)" }}>
                  @{username}
                </p>
              </div>
              <LogoutBtn />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
