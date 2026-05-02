import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/sidebar/Sidebar";
import MobileBottomNav from "./MobileBottomNav";

function MainLayout({ children }) {
  const userData = useSelector((state) => state.auth.userData);
  const userAvatar = userData?.data?.user?.avatar;

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 max-w-7xl mx-auto">
      {/* Desktop Sidebar - Icon only, narrow */}
      <div className="hidden lg:flex lg:w-20 xl:w-64 sticky top-0 h-screen border-r border-gray-200 dark:border-gray-800 overflow-y-auto bg-white dark:bg-slate-950">
        <Sidebar />
      </div>

      {/* Main Content Area - Takes most space */}
      <main className="flex-1 max-w-2xl min-h-screen border-r border-gray-200 dark:border-gray-800 overflow-y-auto pb-20 lg:pb-0 bg-white dark:bg-slate-950 relative">
        {/* Mobile Header with User DP */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 z-10 backdrop-blur-md">
          <Link to="/" className="text-2xl font-bold text-violet-600">𝕏</Link>
          {userAvatar && (
            <img
              src={userAvatar}
              alt="User"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-500/20"
            />
          )}
        </div>
        {children || <Outlet />}
      </main>

      {/* Right Sidebar - Widgets, hidden on tablets and below */}
      <aside className="hidden lg:block lg:w-80 xl:w-96 sticky top-0 h-screen p-6 overflow-y-auto bg-white dark:bg-slate-950">
        <div className="space-y-6">
          {/* Search Widget */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search TweetX"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 dark:bg-slate-900 border border-transparent focus:bg-white dark:focus:bg-slate-950 focus:border-violet-500 text-gray-900 dark:text-white placeholder-gray-500 transition-all outline-none shadow-sm"
            />
          </div>

          {/* Trending Widget */}
          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-extrabold text-xl text-gray-900 dark:text-white">
                What's Trending
              </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 hover:bg-gray-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {i === 1 ? "Technology · Trending" : "World news · LIVE"}
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5 group-hover:text-violet-600 transition-colors">
                        #{i === 1 ? "TweetX" : i === 2 ? "ReactJS" : "WebDev2026"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {10.5 * i}K Posts
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-violet-500 p-1 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full p-4 text-left text-violet-600 dark:text-violet-400 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors">
              Show more
            </button>
          </div>
          
          <footer className="px-4 text-xs text-gray-500 space-x-3">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Cookies</a>
            <span>© 2026 TweetX Corp.</span>
          </footer>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default MainLayout;
