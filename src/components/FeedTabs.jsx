import React, { useState } from "react";

const FeedTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["For you", "Following"];

  return (
    <div
      className="flex w-full"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className="flex-1 relative transition-colors"
          style={{ color: activeTab === tab ? "var(--text-primary)" : "var(--text-secondary)" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <div className="py-4 flex flex-col items-center">
            <span className="text-[15px]" style={{ fontWeight: activeTab === tab ? 700 : 500 }}>
              {tab}
            </span>
          </div>
          {activeTab === tab && (
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full"
              style={{ backgroundColor: "var(--accent-color)" }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default FeedTabs;
