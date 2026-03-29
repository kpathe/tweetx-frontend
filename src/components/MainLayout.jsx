import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/sidebar/Sidebar";
import MobileBottomNav from "./MobileBottomNav";

function MainLayout({ children }) {
  const userData = useSelector((state) => state.auth.userData);
  const userAvatar = userData?.data?.user?.avatar;

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      {/* Desktop Sidebar - Icon only, narrow */}
      <div className="hidden lg:flex lg:w-64 sticky top-0 h-screen border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-white dark:bg-slate-950">
        <Sidebar />
      </div>

      {/* Main Content Area - Takes most space */}
      <main className="flex-1 max-w-2xl min-h-screen border-r border-gray-200 dark:border-gray-700 overflow-y-auto pb-20 lg:pb-0 bg-white dark:bg-slate-950">
        {/* Mobile Header with User DP */}
        <div className="lg:hidden flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-slate-950 z-10 backdrop-blur-sm bg-white/75 dark:bg-slate-950/75">
          {userAvatar && (
            <img
              src={userAvatar}
              alt="User"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
            />
          )}
        </div>
        {children || <Outlet />}
      </main>

      {/* Right Sidebar - Widgets, hidden on tablets and below */}
      <aside className="hidden xl:block xl:w-80 sticky top-0 h-screen p-4 overflow-y-auto bg-white dark:bg-slate-950">
        <div className="space-y-4">
          {/* Search Widget */}
          <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
            <input
              type="text"
              placeholder="Search TweetX"
              className="w-full px-4 py-2 rounded-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>

          {/* What's happening Widget */}
          <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
            <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-4">
              What's Trending
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
                    Trending Worldwide
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    #{i === 1 ? "TweetX" : i === 2 ? "ReactJS" : "WebDevelopment"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {100 * i}K Posts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav/>
    </div>
  );
}

export default MainLayout;
