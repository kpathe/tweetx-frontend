import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/sidebar/Sidebar";
import MobileBottomNav from "./MobileBottomNav";

function MainLayout({ children }) {
  const userData = useSelector((state) => state.auth.userData);
  const userAvatar = userData?.data?.user?.avatar;

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] max-w-[1300px] mx-auto">
      {/* Desktop Sidebar */}
      <div className="hidden sm:flex flex-col sm:w-20 xl:w-[275px] sticky top-0 h-screen border-r border-[var(--border-color)] overflow-y-auto px-2">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[600px] min-h-screen border-r border-[var(--border-color)] pb-20 sm:pb-0 relative">
        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between px-4 py-3 sticky top-0 bg-[var(--bg-primary)] opacity-95 z-30 backdrop-blur-md border-b border-[var(--border-color)]">
          <Link to="/" className="text-2xl font-bold text-[var(--accent-color)]">𝕏</Link>
          <div className="flex items-center gap-2">
             {userData?.data?.user?.profileImage ? (
                <img src={userData.data.user.profileImage} className="w-8 h-8 rounded-full object-cover" />
             ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--accent-color)] text-xs font-bold">
                  U
                </div>
             )}
          </div>
        </div>
        {children || <Outlet />}
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block lg:w-[350px] xl:w-[400px] sticky top-0 h-screen p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="sticky top-0 bg-[var(--bg-primary)] pb-2 z-10">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-14 pr-4 py-3 rounded-full bg-[var(--bg-secondary)] border border-transparent focus:bg-transparent focus:border-[var(--accent-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-all outline-none"
              />
            </div>
          </div>

          {/* Subscribe to Premium Card */}
          <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-transparent space-y-3">
             <h2 className="font-extrabold text-xl text-[var(--text-primary)]">Subscribe to Premium</h2>
             <p className="text-[15px] text-[var(--text-primary)] font-medium leading-tight">
               Subscribe to unlock new features and if eligible, receive a share of ads revenue.
             </p>
             <button className="bg-[var(--accent-color)] text-white px-5 py-2.5 rounded-full font-bold hover:opacity-90 transition-opacity">
               Subscribe
             </button>
          </div>

          {/* Today's News / Trending Widget */}
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-transparent overflow-hidden">
            <div className="p-4">
              <h2 className="font-extrabold text-xl text-[var(--text-primary)]">
                What's happening
              </h2>
            </div>
            <div className="">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="px-4 py-3 hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors group relative"
                >
                  <div className="flex justify-between">
                    <div className="space-y-0.5">
                      <div className="text-[13px] text-[var(--text-secondary)]">
                        {i === 1 ? "Technology · Trending" : "Trending in India"}
                      </div>
                      <div className="font-bold text-[15px] text-[var(--text-primary)]">
                        #{i === 1 ? "TweetX" : i === 2 ? "Sayantan" : i === 3 ? "ReactJS" : "ChaiAurCode"}
                      </div>
                      <div className="text-[13px] text-[var(--text-secondary)]">
                        {10.5 * i}K Posts
                      </div>
                    </div>
                    <button className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] p-1 rounded-full hover:bg-[var(--accent-color)]/10 transition-all h-fit">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                       </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full p-4 text-left text-[var(--accent-color)] text-[15px] hover:bg-[var(--bg-tertiary)] transition-colors">
              Show more
            </button>
          </div>
          
          <footer className="px-4 py-4 text-[13px] text-[var(--text-secondary)] flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Cookie Policy</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Ads info</a>
            <span>© 2026 TweetX Corp.</span>
          </footer>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40">
        <MobileBottomNav />
      </div>
    </div>
  );
}

export default MainLayout;
