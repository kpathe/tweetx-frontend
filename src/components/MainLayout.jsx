import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900 justify-center">
      <div className="flex w-full max-w-7xl">
        {/* 1. Sticky Sidebar */}
        <aside className="w-1/4 sticky top-0 h-screen border-r border-gray-200 dark:border-gray-800 px-4 py-6">
          <Sidebar />
        </aside>

        {/* 2. Main Content (Scrollable) */}
        <main className="w-1/2 min-h-screen border-r border-gray-200 dark:border-gray-800">
          <Outlet /> {/* This is where Home, Profile, etc. appear */}
        </main>

        {/* 3. Right Widgets (Desktop Only) */}
        <aside className="w-1/4 hidden lg:block px-6 py-6">
          <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-4">
            <h2 className="font-bold text-xl mb-4">Who to follow</h2>
            {/* We'll build a mini-user-list component here later */}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MainLayout;
