const FeedTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["For you", "Following"];

  return (
    <div className="sticky flex top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className="flex-1 hover:bg-gray-200/50 dark:hover:bg-slate-800/50 transition-colors pt-4 font-bold relative"
        >
          <div className="pb-4 inline-block relative">
            <span
              className={
                activeTab === tab
                  ? "text-black dark:text-white"
                  : "text-gray-500"
              }
            >
              {tab}
            </span>
            {/* The Blue Underline */}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0] rounded-full" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default FeedTabs;
