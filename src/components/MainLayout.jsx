import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/sidebar/Sidebar";
import MobileBottomNav from "./MobileBottomNav";

function MainLayout({ children }) {
  const userData = useSelector((state) => state.auth.userData);

  return (
    <div
      className="flex min-h-screen mx-auto w-full"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Desktop Sidebar */}
      <div
        className="hidden sm:flex sm:w-[88px] xl:w-[275px] flex-shrink-0 sticky top-0 h-screen overflow-y-auto"
        style={{ borderRight: "1px solid var(--border-color)" }}
      >
        {/* Push sidebar content to the right side of the column */}
        <div className="ml-auto px-3 w-full xl:w-auto xl:min-w-[250px]">
          <Sidebar />
        </div>
      </div>

      {/* Main Content Area */}
      <main
        className="flex-1 min-h-screen pb-16 sm:pb-0 relative sm:max-w-[600px]"
        style={{
          borderRight: "1px solid var(--border-color)",
        }}
      >
        {/* Mobile Header */}
        <div
          className="sm:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-30"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <Link to="/" style={{ color: "var(--text-primary)" }}>
            <span className="text-2xl font-black">𝕏</span>
          </Link>
          <div className="flex items-center gap-2">
            {userData?.data?.user?.profileImage ? (
              <img
                src={userData.data.user.profileImage}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--accent-color)" }}
              >
                U
              </div>
            )}
          </div>
        </div>
        {children || <Outlet />}
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:flex lg:w-[350px] xl:w-[400px] flex-shrink-0 sticky top-0 h-screen overflow-y-auto pl-6 pr-8 pt-2">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="sticky top-0 pb-3 pt-1 z-10" style={{ backgroundColor: "var(--bg-primary)" }}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-12 pr-4 py-3 rounded-full outline-none transition-colors"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid transparent",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-color)";
                  e.target.style.backgroundColor = "transparent";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "transparent";
                  e.target.style.backgroundColor = "var(--bg-secondary)";
                }}
              />
            </div>
          </div>

          {/* Subscribe to Premium */}
          <div
            className="p-4 rounded-2xl space-y-2"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <h2 className="font-extrabold text-xl" style={{ color: "var(--text-primary)" }}>
              Subscribe to Premium
            </h2>
            <p className="text-[15px] leading-snug" style={{ color: "var(--text-primary)" }}>
              Subscribe to unlock new features and if eligible, receive a share of ads revenue.
            </p>
            <button
              className="px-4 py-2 rounded-full font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              Subscribe
            </button>
          </div>

          {/* What's happening */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <div className="p-4">
              <h2 className="font-extrabold text-xl" style={{ color: "var(--text-primary)" }}>
                What's happening
              </h2>
            </div>
            {[
              { category: "Technology · Trending", tag: "#TweetX", posts: "10.5K" },
              { category: "Trending in India", tag: "#Sayantan", posts: "21K" },
              { category: "Trending in India", tag: "#ReactJS", posts: "31.5K" },
              { category: "Technology · Trending", tag: "#ChaiAurCode", posts: "42K" },
            ].map((item, i) => (
              <div
                key={i}
                className="px-4 py-3 cursor-pointer transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                      {item.category}
                    </p>
                    <p className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>
                      {item.tag}
                    </p>
                    <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                      {item.posts} Posts
                    </p>
                  </div>
                  <button
                    className="p-1.5 rounded-full transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent-color)";
                      e.currentTarget.style.backgroundColor = "rgba(29,155,240,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="12" cy="19" r="2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <button
              className="w-full p-4 text-left text-[15px] transition-colors"
              style={{ color: "var(--accent-color)" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              Show more
            </button>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] py-2" style={{ color: "var(--text-secondary)" }}>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Cookie Policy</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Ads info</a>
            <span>© 2026 TweetX Corp.</span>
          </div>
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
