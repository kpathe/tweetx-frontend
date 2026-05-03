import React, { useState, useEffect } from "react";
import authService from "../../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Home, Search, Bell, UserPlus, User, Moon, Sun, LogOut } from "lucide-react";
import { light, dark } from "../../store/themeSlice";
import { logout } from "../../store/authSlice";
import userService from "../../services/user.service";
import Avatar from "../Avatar";

function Sidebar() {
  const authStatus = useSelector((state) => state.auth.status);
  const themeMode = useSelector((state) => state.theme.themeMode);
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const username = userData?.data?.user?.username || "me";
  const dispatch = useDispatch();
  const isDark = themeMode === "dark";

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await userService.getNotifications();
        if (response.success && response.data) {
          const unread = response.data.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        // silently fail
      }
    };
    if (authStatus) fetchNotifications();
  }, [authStatus, location.pathname]);

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
                    {item.label === "Notifications" && unreadCount > 0 && (
                      <div
                        className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: "var(--accent-color)", border: "2px solid var(--bg-primary)" }}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
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

          {/* Logout */}
          <div className="flex xl:justify-start justify-center">
            <button
              onClick={() => {
                authService.logout().then(() => {
                  dispatch(logout());
                  navigate("/");
                });
              }}
              className="flex items-center gap-5 py-3 px-3 rounded-full transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <LogOut size={26} />
              <span className="text-xl hidden xl:block pr-4">
                Logout
              </span>
            </button>
          </div>
        </nav>
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
              <Avatar
                src={userData?.data?.user?.profileImage}
                name={userData?.data?.user?.fullName}
                username={username}
                size={40}
              />
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
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
